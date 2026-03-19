import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // @UseGuards(AuthGuard('jwt')) protects this route — JWT required
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: { user: { userId: string; email: string } }) {
    return this.authService.getMe(req.user.userId);
  }

  // delete account
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  deleteAccount(@Request() req: { user: { userId: string; email: string } }) {
    return this.authService.deleteAccount(req.user.userId);
  }

  // update account
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateProfile(
    @Request() req: { user: { userId: string; email: string } },
    @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, body);
  }
}
