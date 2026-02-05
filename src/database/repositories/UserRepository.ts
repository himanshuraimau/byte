import { db, docToEntity, generateId } from "@/database/db";
import { COLLECTIONS } from "@/database/firebase.config";
import { User } from "@/types/entities";
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

export class UserRepository {
  private collectionRef = collection(db, COLLECTIONS.USERS);

  /**
   * Register a new user
   */
  async register(name: string, password: string): Promise<User> {
    try {
      // Check if username already exists
      const q = query(this.collectionRef, where("name", "==", name));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        throw new Error("Username already exists");
      }

      const userId = generateId();
      const userData = {
        name,
        password,
        created_at: Timestamp.now(),
      };

      await setDoc(doc(this.collectionRef, userId), userData);
      
      return docToEntity<User>({ id: userId }, userData);
    } catch (error: any) {
      console.error("User registration error:", error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(name: string, password: string): Promise<User> {
    try {
      const q = query(
        this.collectionRef, 
        where("name", "==", name), 
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Invalid username or password");
      }

      const userDoc = snapshot.docs[0];
      return docToEntity<User>(userDoc, userDoc.data());
    } catch (error: any) {
      console.error("User login error:", error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docToEntity<User>(docSnap, docSnap.data());
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      return null;
    }
  }

  /**
   * Get user by username
   */
  async getByName(name: string): Promise<User | null> {
    try {
      const q = query(this.collectionRef, where("name", "==", name));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      return docToEntity<User>(userDoc, userDoc.data());
    } catch (error: any) {
      console.error("Get user by name error:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("User not found");
      }

      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.password) updateData.password = data.password;

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      return docToEntity<User>(updatedDoc, updatedDoc.data());
    } catch (error: any) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw error;
    }
  }

  /**
   * Get all users (for admin purposes)
   */
  async getAll(): Promise<User[]> {
    try {
      const snapshot = await getDocs(this.collectionRef);
      return snapshot.docs.map(doc => docToEntity<User>(doc, doc.data()));
    } catch (error: any) {
      console.error("Get all users error:", error);
      return [];
    }
  }
}
