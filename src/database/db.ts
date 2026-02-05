import { db } from "./firebase.config";

// Re-export db for use in repositories
export { db };

/**
 * Initialize Firestore database
 * Firestore is automatically initialized with the firebase.config
 */
export async function initDatabase() {
  // Firestore is already initialized via firebase.config
  // Just return the db instance
  return db;
}

/**
 * Generate a unique ID for Firestore documents
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Convert Firestore timestamp to unix timestamp
 */
export function timestampToUnix(timestamp: any): number {
  if (!timestamp) return 0;
  if (timestamp.toDate) {
    return Math.floor(timestamp.toDate().getTime() / 1000);
  }
  if (timestamp instanceof Date) {
    return Math.floor(timestamp.getTime() / 1000);
  }
  return timestamp;
}

/**
 * Convert unix timestamp to Date for Firestore
 */
export function unixToDate(unix: number): Date {
  return new Date(unix * 1000);
}

/**
 * Convert Firestore document to entity
 */
export function docToEntity<T>(doc: any, data: any): T {
  const entity = { ...data, id: doc.id } as any;

  // Convert Firestore timestamps to unix
  if (data.created_at) {
    entity.created_at = timestampToUnix(data.created_at);
  }
  if (data.updated_at) {
    entity.updated_at = timestampToUnix(data.updated_at);
  }
  if (data.started_at) {
    entity.started_at = timestampToUnix(data.started_at);
  }
  if (data.ended_at) {
    entity.ended_at = data.ended_at ? timestampToUnix(data.ended_at) : null;
  }

  return entity as T;
}
