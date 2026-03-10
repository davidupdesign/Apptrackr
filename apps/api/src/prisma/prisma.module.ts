import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // makes prismaservice acvailable everywhere w/out importing it
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
