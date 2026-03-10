import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
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
}
