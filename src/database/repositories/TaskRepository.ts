import { db, docToEntity, generateId } from "@/database/db";
import { COLLECTIONS } from "@/database/firebase.config";
import { Task } from "@/types/entities";
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

export class TaskRepository {
  private collectionRef = collection(db, COLLECTIONS.TASKS);

  /**
   * Create a new task
   */
  async create(dayId: string, title: string): Promise<Task> {
    try {
      const taskId = generateId();
      const taskData = {
        day_id: dayId,
        title,
        progress: 0,
        completed: false,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      await setDoc(doc(this.collectionRef, taskId), taskData);
      
      return docToEntity<Task>({ id: taskId }, taskData);
    } catch (error: any) {
      console.error("Create task error:", error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<Task | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docToEntity<Task>(docSnap, docSnap.data());
    } catch (error: any) {
      console.error("Get task by ID error:", error);
      return null;
    }
  }

  /**
   * Get all tasks for a day
   */
  async getByDayId(dayId: string): Promise<Task[]> {
    try {
      const q = query(this.collectionRef, where("day_id", "==", dayId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => docToEntity<Task>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get tasks by day ID error:", error);
      return [];
    }
  }

  /**
   * Update task
   */
  async update(id: string, data: Partial<Task>): Promise<Task> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Task not found");
      }

      const updateData: any = { updated_at: Timestamp.now() };
      if (data.title !== undefined) updateData.title = data.title;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.completed !== undefined) updateData.completed = data.completed;

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Task>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Update task error:", error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  async delete(id: string): Promise<void> {
    try {
      // Delete associated sessions
      const sessionsQuery = query(
        collection(db, COLLECTIONS.SESSIONS), 
        where("task_id", "==", id)
      );
      const sessionsSnap = await getDocs(sessionsQuery);

      await Promise.all(sessionsSnap.docs.map(d => deleteDoc(d.ref)));

      // Delete the task
      await deleteDoc(doc(this.collectionRef, id));
    } catch (error: any) {
      console.error("Delete task error:", error);
      throw error;
    }
  }

  /**
   * Toggle task completion
   */
  async toggleComplete(id: string): Promise<Task> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Task not found");
      }

      const taskData = docSnap.data();
      const newCompleted = !taskData.completed;

      await updateDoc(docRef, {
        completed: newCompleted,
        progress: newCompleted ? 100 : taskData.progress,
        updated_at: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Task>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Toggle task complete error:", error);
      throw error;
    }
  }

  /**
   * Update task progress
   */
  async updateProgress(id: string, progress: number): Promise<Task> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Task not found");
      }

      const clampedProgress = Math.max(0, Math.min(100, progress));

      await updateDoc(docRef, {
        progress: clampedProgress,
        completed: clampedProgress === 100,
        updated_at: Timestamp.now(),
      });

      const updatedDoc = await getDoc(docRef);
      return docToEntity<Task>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Update task progress error:", error);
      throw error;
    }
  }
}
