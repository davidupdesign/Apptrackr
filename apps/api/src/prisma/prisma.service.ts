import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // connecting to the database when the nestjs app starts
  async onModuleInit() {
    await this.$connect();
  }
}
