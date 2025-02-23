import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTeamSchema, insertTeamMemberSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handler middleware
  const handleError = (res: any, error: any) => {
    console.error('API Error:', error);
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.errors[0].message 
      });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  };

  // User registration and verification
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);

      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(userData);
      console.log(`Verification code for ${user.email}: ${user.verificationCode}`);
      res.json({ userId: user.id });
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/verify", async (req, res) => {
    try {
      const { userId, code } = req.body;
      if (!userId || !code) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const verified = await storage.verifyUser(userId, code);
      if (!verified) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(Number(req.params.id));
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Registrations
  app.post("/api/registrations", async (req, res) => {
    try {
      const { userId, eventId } = req.body;
      if (!userId || !eventId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const registration = await storage.createRegistration(userId, eventId);
      res.json(registration);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/registrations/:userId", async (req, res) => {
    try {
      const registrations = await storage.getRegistrationsByUserId(Number(req.params.userId));
      res.json(registrations);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Teams
  app.post("/api/teams", async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const { leaderId } = req.body;

      if (!leaderId) {
        return res.status(400).json({ error: "Leader ID is required" });
      }

      const event = await storage.getEventById(teamData.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const team = await storage.createTeam(teamData, leaderId);
      res.json(team);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/teams/event/:eventId", async (req, res) => {
    try {
      const teams = await storage.getTeamsByEvent(Number(req.params.eventId));
      res.json(teams);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/teams/member/:userId", async (req, res) => {
    try {
      const teams = await storage.getTeamsByMember(Number(req.params.userId));
      res.json(teams);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get("/api/teams/:teamId/details", async (req, res) => {
    try {
      const teamDetails = await storage.getTeamDetails(Number(req.params.teamId));
      res.json(teamDetails);
    } catch (error) {
      handleError(res, error);
    }
  });

  // Team Members
  app.post("/api/teams/:teamId/members", async (req, res) => {
    try {
      const teamId = Number(req.params.teamId);
      const memberData = insertTeamMemberSchema.parse(req.body);
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const member = await storage.addTeamMember(teamId, {
        ...memberData,
        userId
      });
      res.json(member);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.delete("/api/teams/:teamId/members/:userId", async (req, res) => {
    try {
      await storage.removeTeamMember(
        Number(req.params.teamId),
        Number(req.params.userId)
      );
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  app.patch("/api/teams/:teamId/members/:userId", async (req, res) => {
    try {
      const member = await storage.updateTeamMember(
        Number(req.params.teamId),
        Number(req.params.userId),
        req.body
      );
      res.json(member);
    } catch (error) {
      handleError(res, error);
    }
  });

  return httpServer;
}