import { 
  users, type User, type InsertUser,
  moodEntries, type MoodEntry, type InsertMoodEntry,
  medicines, type Medicine, type InsertMedicine,
  cartItems, type CartItem, type InsertCartItem,
  therapists, type Therapist, type InsertTherapist,
  sessions, type Session, type InsertSession,
  groupSessions, type GroupSession, type InsertGroupSession,
  groupSessionParticipants, type GroupSessionParticipant, type InsertGroupSessionParticipant,
  chatHistory, type ChatHistory, type InsertChatHistory
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Mood tracking methods
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntriesByUserId(userId: number): Promise<MoodEntry[]>;
  getMoodEntryById(id: number): Promise<MoodEntry | undefined>;
  
  // Medicine methods
  getMedicines(): Promise<Medicine[]>;
  getMedicineById(id: number): Promise<Medicine | undefined>;
  getMedicinesByCategory(category: string): Promise<Medicine[]>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemWithDetails(userId: number): Promise<(CartItem & { medicine: Medicine })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Therapist methods
  getTherapists(): Promise<Therapist[]>;
  getTherapistById(id: number): Promise<Therapist | undefined>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getUserSessions(userId: number): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | undefined>;
  updateSessionStatus(id: number, status: string): Promise<Session | undefined>;
  
  // Group session methods
  getGroupSessions(): Promise<GroupSession[]>;
  getGroupSessionById(id: number): Promise<GroupSession | undefined>;
  createGroupSession(session: InsertGroupSession): Promise<GroupSession>;
  joinGroupSession(participant: InsertGroupSessionParticipant): Promise<GroupSessionParticipant>;
  leaveGroupSession(sessionId: number, userId: number): Promise<boolean>;
  getGroupSessionParticipants(sessionId: number): Promise<GroupSessionParticipant[]>;
  updateGroupSessionParticipants(sessionId: number, count: number): Promise<GroupSession | undefined>;
  
  // Chat history methods
  saveChatHistory(entry: InsertChatHistory): Promise<ChatHistory>;
  getChatHistoryByUserId(userId: number): Promise<ChatHistory[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodEntries: Map<number, MoodEntry>;
  private medicines: Map<number, Medicine>;
  private cartItems: Map<number, CartItem>;
  private therapists: Map<number, Therapist>;
  private sessions: Map<number, Session>;
  private groupSessions: Map<number, GroupSession>;
  private groupSessionParticipants: Map<number, GroupSessionParticipant>;
  private chatHistory: Map<number, ChatHistory>;
  
  sessionStore: session.SessionStore;
  
  // Counters for IDs
  private userIdCounter: number;
  private moodEntryIdCounter: number;
  private medicineIdCounter: number;
  private cartItemIdCounter: number;
  private therapistIdCounter: number;
  private sessionIdCounter: number;
  private groupSessionIdCounter: number;
  private groupSessionParticipantIdCounter: number;
  private chatHistoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.medicines = new Map();
    this.cartItems = new Map();
    this.therapists = new Map();
    this.sessions = new Map();
    this.groupSessions = new Map();
    this.groupSessionParticipants = new Map();
    this.chatHistory = new Map();
    
    this.userIdCounter = 1;
    this.moodEntryIdCounter = 1;
    this.medicineIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.therapistIdCounter = 1;
    this.sessionIdCounter = 1;
    this.groupSessionIdCounter = 1;
    this.groupSessionParticipantIdCounter = 1;
    this.chatHistoryIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Mood tracking methods
  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.moodEntryIdCounter++;
    const moodEntry: MoodEntry = { ...entry, id, date: entry.date || new Date() };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }
  
  async getMoodEntriesByUserId(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getMoodEntryById(id: number): Promise<MoodEntry | undefined> {
    return this.moodEntries.get(id);
  }

  // Medicine methods
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }
  
  async getMedicineById(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }
  
  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values())
      .filter(medicine => medicine.category === category);
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
  }
  
  async getCartItemWithDetails(userId: number): Promise<(CartItem & { medicine: Medicine })[]> {
    const cartItems = await this.getCartItems(userId);
    return Promise.all(
      cartItems.map(async (item) => {
        const medicine = await this.getMedicineById(item.medicineId);
        return { ...item, medicine: medicine! };
      })
    );
  }
  
  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItems = await this.getCartItems(item.userId);
    const existingItem = existingItems.find(i => i.medicineId === item.medicineId);
    
    if (existingItem) {
      // Update the quantity instead of adding a new item
      return this.updateCartItem(existingItem.id, existingItem.quantity + item.quantity) as Promise<CartItem>;
    }
    
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...item, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const cartItems = await this.getCartItems(userId);
    cartItems.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Therapist methods
  async getTherapists(): Promise<Therapist[]> {
    return Array.from(this.therapists.values());
  }
  
  async getTherapistById(id: number): Promise<Therapist | undefined> {
    return this.therapists.get(id);
  }

  // Session methods
  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const session: Session = { ...sessionData, id };
    this.sessions.set(id, session);
    return session;
  }
  
  async getUserSessions(userId: number): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
  }
  
  async getSessionById(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }
  
  async updateSessionStatus(id: number, status: string): Promise<Session | undefined> {
    const session = await this.getSessionById(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, status };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  // Group session methods
  async getGroupSessions(): Promise<GroupSession[]> {
    return Array.from(this.groupSessions.values())
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
  }
  
  async getGroupSessionById(id: number): Promise<GroupSession | undefined> {
    return this.groupSessions.get(id);
  }
  
  async createGroupSession(sessionData: InsertGroupSession): Promise<GroupSession> {
    const id = this.groupSessionIdCounter++;
    const session: GroupSession = { ...sessionData, id };
    this.groupSessions.set(id, session);
    return session;
  }
  
  async joinGroupSession(participant: InsertGroupSessionParticipant): Promise<GroupSessionParticipant> {
    // Check if user is already in the session
    const existingParticipants = await this.getGroupSessionParticipants(participant.sessionId);
    const isAlreadyJoined = existingParticipants.some(p => p.userId === participant.userId);
    
    if (isAlreadyJoined) {
      throw new Error("User already joined this session");
    }
    
    // Add the participant
    const id = this.groupSessionParticipantIdCounter++;
    const groupSessionParticipant: GroupSessionParticipant = { ...participant, id };
    this.groupSessionParticipants.set(id, groupSessionParticipant);
    
    // Update the participant count
    const session = await this.getGroupSessionById(participant.sessionId);
    if (session) {
      await this.updateGroupSessionParticipants(
        participant.sessionId, 
        session.currentParticipants + 1
      );
    }
    
    return groupSessionParticipant;
  }
  
  async leaveGroupSession(sessionId: number, userId: number): Promise<boolean> {
    const participants = await this.getGroupSessionParticipants(sessionId);
    const participant = participants.find(p => p.userId === userId);
    
    if (!participant) return false;
    
    // Remove the participant
    const result = this.groupSessionParticipants.delete(participant.id);
    
    // Update the participant count
    const session = await this.getGroupSessionById(sessionId);
    if (session && result) {
      await this.updateGroupSessionParticipants(
        sessionId, 
        Math.max(0, session.currentParticipants - 1)
      );
    }
    
    return result;
  }
  
  async getGroupSessionParticipants(sessionId: number): Promise<GroupSessionParticipant[]> {
    return Array.from(this.groupSessionParticipants.values())
      .filter(participant => participant.sessionId === sessionId);
  }
  
  async updateGroupSessionParticipants(sessionId: number, count: number): Promise<GroupSession | undefined> {
    const session = await this.getGroupSessionById(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, currentParticipants: count };
    this.groupSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  // Chat history methods
  async saveChatHistory(entry: InsertChatHistory): Promise<ChatHistory> {
    const id = this.chatHistoryIdCounter++;
    const chatEntry: ChatHistory = { ...entry, id, timestamp: new Date() };
    this.chatHistory.set(id, chatEntry);
    return chatEntry;
  }
  
  async getChatHistoryByUserId(userId: number): Promise<ChatHistory[]> {
    return Array.from(this.chatHistory.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  
  // Initialize some sample data
  private initializeSampleData() {
    // Sample medicines
    const medicineCategories = ['Antidepressant', 'Anxiolytic', 'Mood Stabilizer', 'Sleep Aid', 'Supplement'];
    const medicineNames = [
      'Sertraline (Generic)',
      'Alprazolam (Generic)',
      'Lithium Carbonate',
      'Bupropion XL',
      'Omega-3 Fish Oil',
      'Melatonin (3mg)'
    ];
    
    const medicineDescriptions = [
      'SSRI medication commonly prescribed for depression, anxiety, and related conditions.',
      'Benzodiazepine medication for anxiety and panic disorders. Short-term use recommended.',
      'Standard treatment for bipolar disorder to stabilize mood and prevent manic/depressive episodes.',
      'NDRI medication used for depression and seasonal affective disorder with energizing effects.',
      'Supports brain health and may help with symptoms of depression and anxiety alongside treatment.',
      'Natural hormone supplement to help regulate sleep cycles and improve sleep quality.'
    ];
    
    const categories = [
      'Antidepressant',
      'Anxiolytic',
      'Mood Stabilizer',
      'Antidepressant',
      'Supplement',
      'Sleep Aid'
    ];
    
    const prices = [1299, 1550, 1875, 2450, 2299, 999];
    const ratings = [4, 4, 5, 4, 4, 5];
    const ratingCounts = [124, 89, 56, 78, 210, 342];
    
    for (let i = 0; i < medicineNames.length; i++) {
      const medicine: Medicine = {
        id: this.medicineIdCounter++,
        name: medicineNames[i],
        description: medicineDescriptions[i],
        category: categories[i],
        price: prices[i],
        rating: ratings[i],
        ratingCount: ratingCounts[i],
        inStock: true
      };
      
      this.medicines.set(medicine.id, medicine);
    }
    
    // Sample therapists
    const therapistNames = [
      'Dr. Sarah Johnson',
      'Dr. Michael Chen',
      'Lisa Rodriguez, LMFT',
      'James Wilson, LCSW',
      'Dr. Anita Patel',
      'Robert Taylor, LPC'
    ];
    
    const specializations = [
      'Anxiety & Depression',
      'Trauma & PTSD',
      'Couples Therapy',
      'Addiction Recovery',
      'Child & Adolescent',
      'Mindfulness & CBT'
    ];
    
    const bios = [
      'Dr. Johnson specializes in treating anxiety and depression using evidence-based approaches. She has over 15 years of experience helping clients achieve better mental health.',
      'With expertise in trauma-informed care, Dr. Chen helps clients process traumatic experiences and develop resilience. His gentle approach creates a safe space for healing.',
      'Lisa is passionate about helping couples improve communication and rebuild connection. She uses emotion-focused therapy to help partners understand each other more deeply.',
      'James brings compassion and understanding to his work with clients recovering from substance use. He combines motivational interviewing with practical tools for lasting change.',
      'Dr. Patel\'s playful yet structured approach helps children and adolescents navigate emotional challenges. She collaborates closely with families to support young people\'s growth.',
      'Robert specializes in mindfulness-based cognitive therapy, helping clients develop awareness of thought patterns and create meaningful change in their lives.'
    ];
    
    for (let i = 0; i < therapistNames.length; i++) {
      const therapist: Therapist = {
        id: this.therapistIdCounter++,
        name: therapistNames[i],
        specialization: specializations[i],
        bio: bios[i],
        available: true
      };
      
      this.therapists.set(therapist.id, therapist);
    }
    
    // Sample group sessions
    const groupSessionNames = [
      'Anxiety Management',
      'Grief Support',
      'Mindfulness Meditation',
      'Depression Support',
      'Stress Reduction',
      'Addiction Recovery'
    ];
    
    const groupSessionDescriptions = [
      'A supportive group for those dealing with anxiety. Learn practical coping skills and connect with others on a similar journey.',
      'This compassionate group provides space to process grief and loss in a supportive environment.',
      'Learn and practice mindfulness techniques to reduce stress and increase present-moment awareness.',
      'Connect with others experiencing depression in this supportive group focused on coping strategies and mutual understanding.',
      'Develop practical tools for managing stress in daily life and creating more balance.',
      'A recovery-focused group providing support and accountability for those dealing with various addictive behaviors.'
    ];
    
    const future = new Date();
    future.setDate(future.getDate() + 7);
    
    for (let i = 0; i < groupSessionNames.length; i++) {
      const futureDate = new Date(future);
      futureDate.setHours(9 + i, 0, 0, 0);
      
      const groupSession: GroupSession = {
        id: this.groupSessionIdCounter++,
        name: groupSessionNames[i],
        description: groupSessionDescriptions[i],
        therapistId: i + 1,
        sessionDate: futureDate,
        duration: 60,
        maxParticipants: 10,
        currentParticipants: 0,
        status: 'scheduled'
      };
      
      this.groupSessions.set(groupSession.id, groupSession);
    }
  }
}

export const storage = new MemStorage();
