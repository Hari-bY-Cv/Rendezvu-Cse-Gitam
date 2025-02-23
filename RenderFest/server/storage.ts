import {
  type User,
  type InsertUser,
  type Event,
  type Registration,
  type Team,
  type TeamMember,
  type InsertTeam,
  type InsertTeamMember,
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  verifyUser(id: number, code: string): Promise<boolean>;
  updateUserVerification(id: number, verified: boolean): Promise<void>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;

  // Registration operations
  createRegistration(userId: number, eventId: number): Promise<Registration>;
  getRegistrationsByUserId(userId: number): Promise<Registration[]>;

  // Team operations
  createTeam(team: InsertTeam, leaderId: number): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team>;
  getTeamsByEvent(eventId: number): Promise<Team[]>;
  getTeamsByMember(userId: number): Promise<Team[]>;
  getTeamDetails(teamId: number): Promise<{
    team: Team;
    members: (TeamMember & { user: User })[];
  }>;

  // Team member operations
  addTeamMember(teamId: number, member: InsertTeamMember & { userId: number }): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<void>;
  updateTeamMember(teamId: number, userId: number, updates: Partial<TeamMember>): Promise<TeamMember>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private registrations: Map<number, Registration>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.registrations = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.currentIds = {
      users: 1,
      events: 1,
      registrations: 1,
      teams: 1,
      teamMembers: 1
    };

    this.initializeEvents();
  }

  private initializeEvents() {
    const events: Event[] = [
      {
        id: this.currentIds.events++,
        name: "Grand Hackathon",
        type: "hackathon",
        price: 350,
        maxTeamSize: 3,
        startDate: new Date("2025-03-05T09:00:00"),
        endDate: new Date("2025-03-06T18:00:00")
      },
      {
        id: this.currentIds.events++,
        name: "AI/ML Workshop",
        type: "workshop",
        price: 100,
        maxTeamSize: 1,
        startDate: new Date("2025-03-05T10:00:00"),
        endDate: new Date("2025-03-05T13:00:00")
      }
    ];

    events.forEach(event => this.events.set(event.id, event));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = {
      ...insertUser,
      id,
      verified: false,
      verificationCode: Math.random().toString().slice(2, 8)
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async verifyUser(id: number, code: string): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user || user.verificationCode !== code) return false;
    await this.updateUserVerification(id, true);
    return true;
  }

  async updateUserVerification(id: number, verified: boolean): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      this.users.set(id, { ...user, verified });
    }
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createRegistration(userId: number, eventId: number): Promise<Registration> {
    const id = this.currentIds.registrations++;
    const registration: Registration = {
      id,
      userId,
      eventId,
      teamId: null,
      status: "pending",
      paymentStatus: "pending"
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrationsByUserId(userId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values())
      .filter(reg => reg.userId === userId);
  }

  async createTeam(team: InsertTeam, leaderId: number): Promise<Team> {
    const id = this.currentIds.teams++;
    const newTeam: Team = {
      ...team,
      id,
      leaderId,
      status: "forming",
      currentSize: 1,
      createdAt: new Date()
    };
    this.teams.set(id, newTeam);

    // Automatically add leader as first member
    await this.addTeamMember(id, {
      userId: leaderId,
      role: "leader",
      skills: team.requiredSkills || [],
    });

    return newTeam;
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team> {
    const team = await this.getTeamById(id);
    if (!team) throw new Error("Team not found");

    const updatedTeam = { ...team, ...updates };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  async getTeamsByEvent(eventId: number): Promise<Team[]> {
    return Array.from(this.teams.values())
      .filter(team => team.eventId === eventId);
  }

  async getTeamsByMember(userId: number): Promise<Team[]> {
    const memberTeams = Array.from(this.teamMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.teamId);

    return Array.from(this.teams.values())
      .filter(team => memberTeams.includes(team.id));
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values())
      .filter(member => member.teamId === teamId);
  }

  async getTeamDetails(teamId: number): Promise<{
    team: Team;
    members: (TeamMember & { user: User })[];
  }> {
    const team = await this.getTeamById(teamId);
    if (!team) throw new Error("Team not found");

    const members = await this.getTeamMembers(teamId);
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await this.getUserById(member.userId);
        if (!user) throw new Error("Team member user not found");
        return { ...member, user };
      })
    );

    return { team, members: membersWithUsers };
  }

  async addTeamMember(
    teamId: number,
    member: InsertTeamMember & { userId: number }
  ): Promise<TeamMember> {
    const team = await this.getTeamById(teamId);
    if (!team) throw new Error("Team not found");

    if (team.currentSize && team.currentSize >= (team.maxTeamSize || 4)) {
      throw new Error("Team is full");
    }

    const id = this.currentIds.teamMembers++;
    const newMember: TeamMember = {
      id,
      teamId,
      ...member,
      joinedAt: new Date(),
    };

    this.teamMembers.set(id, newMember);
    await this.updateTeam(teamId, { 
      currentSize: (team.currentSize || 1) + 1 
    });

    return newMember;
  }

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    const team = await this.getTeamById(teamId);
    if (!team) throw new Error("Team not found");

    const member = Array.from(this.teamMembers.values())
      .find(m => m.teamId === teamId && m.userId === userId);

    if (!member) throw new Error("Team member not found");

    if (member.role === "leader") {
      throw new Error("Cannot remove team leader");
    }

    this.teamMembers.delete(member.id);
    await this.updateTeam(teamId, { 
      currentSize: Math.max((team.currentSize || 1) - 1, 1)
    });
  }

  async updateTeamMember(
    teamId: number,
    userId: number,
    updates: Partial<TeamMember>
  ): Promise<TeamMember> {
    const member = Array.from(this.teamMembers.values())
      .find(m => m.teamId === teamId && m.userId === userId);

    if (!member) throw new Error("Team member not found");

    // Prevent changing role if it's the leader
    if (member.role === "leader" && updates.role && updates.role !== "leader") {
      throw new Error("Cannot change leader's role");
    }

    const updatedMember = { ...member, ...updates };
    this.teamMembers.set(member.id, updatedMember);
    return updatedMember;
  }
}

export const storage = new MemStorage();