import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertUser, User } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      const user = await storage.getUserByUsername(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _pw, ...safeUser } = user as User;
      return res.json({ user: safeUser });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err?.message || "Login failed" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { fullName, email, password, phone } = req.body as Partial<InsertUser>;
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existing = await storage.getUserByUsername(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const insertUser: InsertUser = {
        fullName,
        email,
        password,
        phone: phone ?? null as any,
        role: "candidate",
      } as InsertUser;

      const created = await storage.createUser(insertUser);
      const { password: _pw, ...safeUser } = created as User;
      return res.status(201).json({ user: safeUser });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: err?.message || "Registration failed" });
    }
  });

  app.get("/api/health/db", async (_req, res) => {
    try {
      const { getDb } = await import("./db");
      const db = getDb();
      await db.execute(sql`select 1`);
      return res.json({ ok: true });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ ok: false, message: err?.message || "DB health check failed" });
    }
  });

  return httpServer;
}
