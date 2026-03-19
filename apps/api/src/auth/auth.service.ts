import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    //checking if user already exists
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');

    // hashing password
    const hashed = await bcrypt.hash(password, 10);

    // creating user
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });

    // signing and returing a jwt
    return this.signToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    // finding user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // comparing submitted password with stored hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      // never returning the password
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  //  UPDATING ACC
  async updateProfile(
    userId: string,
    data: { name?: string; email?: string; password?: string },
  ) {
    // if password is being changed, hash it first
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // if email is changing, check it's not taken
    if (data.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
