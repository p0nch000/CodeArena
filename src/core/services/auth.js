import { prisma } from '@/core/db/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Auth {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    this.jwtSecret = process.env.JWT_SECRET;
    this.SALT_ROUNDS = 10;
  }

  async login(mail, password) {
    if (!mail || !password) {
      throw new Error('Email and password are required');
    }

    const user = await prisma.users.findUnique({
      where: { mail },
      select: {
        id_user: true,
        password_hash: true,
        user_role: true,
        username: true,
        mail: true
      }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        id_user: user.id_user,
        role: user.user_role,
        username: user.username,
        mail:user.mail
      }, 
      this.jwtSecret, 
      { expiresIn: '400h' }
    );

    return { token, user: { id: user.id_user, username: user.username, mail: user.mail ,role: user.user_role } };
  }
  
  async register(userData) {
    const { mail, password, username } = userData;
    
    if (!mail || !password || !username) {
      throw new Error('Email, password and username are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { mail },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new Error(
        existingUser.mail === mail 
          ? 'Email already registered' 
          : 'Username already taken'
      );
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    
    const newUser = await prisma.users.create({
      data: {
        mail,
        password_hash: hashedPassword,
        username,
        user_role: 'user', 
        points: 0 
      },
      select: {
        id_user: true,
        username: true,
        user_role: true,
        created_at: true
      }
    });

    return newUser;
  }
}

const authService = new Auth();
export default authService;