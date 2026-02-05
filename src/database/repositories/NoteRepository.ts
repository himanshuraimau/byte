import { db, docToEntity, generateId } from "@/database/db";
import { COLLECTIONS } from "@/database/firebase.config";
import { Note } from "@/types/entities";
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

export class NoteRepository {
  private collectionRef = collection(db, COLLECTIONS.NOTES);

  /**
   * Create a new note
   */
  async create(dayId: string, content: string): Promise<Note> {
    try {
      const noteId = generateId();
      const noteData = {
        day_id: dayId,
        content,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      await setDoc(doc(this.collectionRef, noteId), noteData);
      
      return docToEntity<Note>({ id: noteId }, noteData);
    } catch (error: any) {
      console.error("Create note error:", error);
      throw error;
    }
  }

  /**
   * Get note by ID
   */
  async getById(id: string): Promise<Note | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docToEntity<Note>(docSnap, docSnap.data());
    } catch (error: any) {
      console.error("Get note by ID error:", error);
      return null;
    }
  }

  /**
   * Get all notes for a day
   */
  async getByDayId(dayId: string): Promise<Note[]> {
    try {
      const q = query(this.collectionRef, where("day_id", "==", dayId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Note>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get notes by day ID error:", error);
      return [];
    }
  }

  /**
   * Update note
   */
  async update(id: string, content: string): Promise<Note> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Note not found");
      }

      await updateDoc(docRef, {
        content,
        updated_at: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Note>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Update note error:", error);
      throw error;
    }
  }

  /**
   * Delete note
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.collectionRef, id));
    } catch (error: any) {
      console.error("Delete note error:", error);
      throw error;
    }
  }
}
