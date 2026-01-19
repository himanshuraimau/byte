/**
 * Database Type Definitions
 */

export interface DatabaseResult {
  insertId?: number;
  rowsAffected: number;
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
}

export interface Repository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(dayId: number): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
