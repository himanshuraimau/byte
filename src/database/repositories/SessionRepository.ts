import { db, docToEntity, generateId, unixToDate } from "@/database/db";
import { COLLECTIONS } from "@/database/firebase.config";
import { Session } from "@/types/entities";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";

export class SessionRepository {
  private collectionRef = collection(db, COLLECTIONS.SESSIONS);

  /**
   * Create a new session
   */
  async create(
    dayId: string,
    name: string,
    durationMinutes: number,
    taskId?: string
  ): Promise<Session> {
    try {
      const sessionId = generateId();
      const sessionData: any = {
        day_id: dayId,
        name,
        duration_minutes: durationMinutes,
        started_at: Timestamp.now(),
        completed: false,
        created_at: Timestamp.now(),
      };

      if (taskId) {
        sessionData.task_id = taskId;
      }

      await setDoc(doc(this.collectionRef, sessionId), sessionData);
      
      return docToEntity<Session>({ id: sessionId }, sessionData);
    } catch (error: any) {
      console.error("Create session error:", error);
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  async getById(id: string): Promise<Session | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docToEntity<Session>(docSnap, docSnap.data());
    } catch (error: any) {
      console.error("Get session by ID error:", error);
      return null;
    }
  }

  /**
   * Get all sessions for a day
   */
  async getByDayId(dayId: string): Promise<Session[]> {
    try {
      const q = query(this.collectionRef, where("day_id", "==", dayId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Session>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get sessions by day ID error:", error);
      return [];
    }
  }

  /**
   * Get all sessions for a task
   */
  async getByTaskId(taskId: string): Promise<Session[]> {
    try {
      const q = query(this.collectionRef, where("task_id", "==", taskId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Session>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get sessions by task ID error:", error);
      return [];
    }
  }

  /**
   * Update session
   */
  async update(id: string, data: Partial<Session>): Promise<Session> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Session not found");
      }

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.duration_minutes !== undefined) updateData.duration_minutes = data.duration_minutes;
      if (data.completed !== undefined) updateData.completed = data.completed;
      if (data.ended_at !== undefined) {
        updateData.ended_at = data.ended_at ? Timestamp.fromDate(unixToDate(data.ended_at)) : null;
      }

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Session>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Update session error:", error);
      throw error;
    }
  }

  /**
   * Complete a session
   */
  async complete(id: string): Promise<Session> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Session not found");
      }

      await updateDoc(docRef, {
        completed: true,
        ended_at: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Session>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Complete session error:", error);
      throw error;
    }
  }

  /**
   * Delete session
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.collectionRef, id));
    } catch (error: any) {
      console.error("Delete session error:", error);
      throw error;
    }
  }

  /**
   * Get active (incomplete) sessions for a day
   */
  async getActiveSessions(dayId: string): Promise<Session[]> {
    try {
      const q = query(
        this.collectionRef,
        where("day_id", "==", dayId),
        where("completed", "==", false)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Session>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get active sessions error:", error);
      return [];
    }
  }
}
