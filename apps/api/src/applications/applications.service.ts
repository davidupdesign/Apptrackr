import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  // GET ALL apps belonging to the logged-in user
  async findAll(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
    });
  }

  // GET SINGLE app — verify it belongs to the user
  async findOne(id: string, userId: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    if (app.userId !== userId) throw new ForbiddenException();
    return app;
  }

  // CREATE a new application
  async create(
    userId: string,
    data: {
      company: string;
      role: string;
      status?: Status;
      notes?: string;
      salary?: number;
      url?: string;
      appliedAt: string;
    },
  ) {
    return this.prisma.application.create({
      data: {
        userId,
        ...data,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
      },
    });
  }

  // UPDATE an existing application
  async update(
    id: string,
    userId: string,
    data: {
      company?: string;
      role?: string;
      status?: Status;
      notes?: string;
      salary?: number;
      url?: string;
      appliedAt?: string;
    },
  ) {
    // first verify it exists and belongs to the user
    await this.findOne(id, userId);

    return this.prisma.application.update({
      where: { id },
      data: {
        ...data,
        ...(data.appliedAt ? { appliedAt: new Date(data.appliedAt) } : {}),
      },
    });
  }

  // DELETE an application
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.application.delete({ where: { id } });
  }
}
