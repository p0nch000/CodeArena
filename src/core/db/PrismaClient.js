import { PrismaClient } from '@prisma/client';

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.prisma = new PrismaClient();
    Database.instance = this;
  }
  
  async connect() {
    try {
      await this.prisma.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  
  async disconnect() {
    await this.prisma.$disconnect();
  }
  
  get client() {
    return this.prisma;
  }
}

const db = new Database();
export default db;