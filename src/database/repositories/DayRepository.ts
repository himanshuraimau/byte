import { db, docToEntity, generateId } from "@/database/db";
import { COLLECTIONS } from "@/database/firebase.config";
import { Day } from "@/types/entities";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where
} from "firebase/firestore";

export class DayRepository {
  private collectionRef = collection(db, COLLECTIONS.DAYS);

  /**
   * Get or create a day for a user
   */
  async getOrCreate(userId: string, date: string): Promise<Day> {
    try {
      // Check if day already exists
      const q = query(
        this.collectionRef, 
        where("user_id", "==", userId),
        where("date", "==", date)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const dayDoc = snapshot.docs[0];
        return docToEntity<Day>(dayDoc, dayDoc.data());
      }

      // Create new day
      const dayId = generateId();
      const dayData = {
        user_id: userId,
        date,
        created_at: Timestamp.now(),
      };

      await setDoc(doc(this.collectionRef, dayId), dayData);
      
      return docToEntity<Day>({ id: dayId }, dayData);
    } catch (error: any) {
      console.error("Get or create day error:", error);
      throw error;
    }
  }

  /**
   * Get day by ID
   */
  async getById(id: string): Promise<Day | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docToEntity<Day>(docSnap, docSnap.data());
    } catch (error: any) {
      console.error("Get day by ID error:", error);
      return null;
    }
  }

  /**
   * Get all days for a user
   */
  async getByUserId(userId: string): Promise<Day[]> {
    try {
      const q = query(this.collectionRef, where("user_id", "==", userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Day>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get days by user ID error:", error);
      return [];
    }
  }

  /**
   * Get all days that have entries (tasks, notes, or sessions) for a user
   */
  async findAllWithEntries(userId: string): Promise<Day[]> {
    try {
      // Get all days for the user
      const days = await this.getByUserId(userId);
      
      if (days.length === 0) return [];

      // Get all day IDs
      const dayIds = days.map(day => day.id);

      // Check which days have tasks, notes, or sessions
      const tasksQuery = query(
        collection(db, COLLECTIONS.TASKS),
        where("day_id", "in", dayIds.slice(0, 10)) // Firestore 'in' has limit of 10
      );
      const notesQuery = query(
        collection(db, COLLECTIONS.NOTES),
        where("day_id", "in", dayIds.slice(0, 10))
      );
      const sessionsQuery = query(
        collection(db, COLLECTIONS.SESSIONS),
        where("day_id", "in", dayIds.slice(0, 10))
      );

      const [tasksSnap, notesSnap, sessionsSnap] = await Promise.all([
        getDocs(tasksQuery),
        getDocs(notesQuery),
        getDocs(sessionsQuery),
      ]);

      // Collect unique day IDs that have entries
      const dayIdsWithEntries = new Set<string>();
      tasksSnap.docs.forEach(doc => dayIdsWithEntries.add(doc.data().day_id));
      notesSnap.docs.forEach(doc => dayIdsWithEntries.add(doc.data().day_id));
      sessionsSnap.docs.forEach(doc => dayIdsWithEntries.add(doc.data().day_id));

      // Filter days to only those with entries
      return days.filter(day => dayIdsWithEntries.has(day.id));
    } catch (error: any) {
      console.error("Find days with entries error:", error);
      return [];
    }
  }

  /**
   * Get days for a user within a date range
   */
  async getByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Day[]> {
    try {
      const q = query(
        this.collectionRef,
        where("user_id", "==", userId),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Day>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get days by date range error:", error);
      return [];
    }
  }

  /**
   * Delete a day and all associated data
   */
  async delete(id: string): Promise<void> {
    try {
      // Delete all associated tasks, notes, and sessions
      const tasksQuery = query(collection(db, COLLECTIONS.TASKS), where("day_id", "==", id));
      const notesQuery = query(collection(db, COLLECTIONS.NOTES), where("day_id", "==", id));
      const sessionsQuery = query(collection(db, COLLECTIONS.SESSIONS), where("day_id", "==", id));

      const [tasksSnap, notesSnap, sessionsSnap] = await Promise.all([
        getDocs(tasksQuery),
        getDocs(notesQuery),
        getDocs(sessionsQuery),
      ]);

      // Delete all related documents
      const deletePromises = [
        ...tasksSnap.docs.map(d => deleteDoc(d.ref)),
        ...notesSnap.docs.map(d => deleteDoc(d.ref)),
        ...sessionsSnap.docs.map(d => deleteDoc(d.ref)),
      ];

      await Promise.all(deletePromises);

      // Delete the day
      await deleteDoc(doc(this.collectionRef, id));
    } catch (error: any) {
      console.error("Delete day error:", error);
      throw error;
    }
  }
}
