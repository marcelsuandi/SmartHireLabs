import { type User, type InsertUser, users as usersTable } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { getDb } = await import("./db");
    const db = getDb();
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { getDb } = await import("./db");
    const db = getDb();
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, username))
      .limit(1);
    return rows[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { getDb } = await import("./db");
    const db = getDb();
    const row = { ...insertUser, id: randomUUID() } as any;
    const inserted = await db
      .insert(usersTable)
      .values(row)
      .returning();
    return inserted[0] as User;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : new MemStorage();
