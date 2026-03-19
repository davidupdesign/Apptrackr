import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationsService } from './applications.service';
import { Status } from '@prisma/client';

// defining the shape of the authenticated request
interface AuthRequest {
  user: { userId: string; email: string };
}

// @UseGuards on the class protects all routes in this controller
@UseGuards(AuthGuard('jwt'))
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.applicationsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.applicationsService.findOne(id, req.user.userId);
  }

  @Post()
  create(
    @Body()
    body: {
      company: string;
      role: string;
      status?: Status;
      notes?: string;
      salary?: number;
      url?: string;
      appliedAt: string;
    },
    @Request() req: AuthRequest,
  ) {
    return this.applicationsService.create(req.user.userId, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      company?: string;
      role?: string;
      status?: Status;
      notes?: string;
      salary?: number;
      url?: string;
      appliedAt?: string;
    },
    @Request() req: AuthRequest,
  ) {
    return this.applicationsService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.applicationsService.remove(id, req.user.userId);
  }

}
