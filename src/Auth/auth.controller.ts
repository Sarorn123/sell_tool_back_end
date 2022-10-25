import { Controller, Post, UseGuards, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../User/user.service';
import { CreateUserDTO } from '../User/user.dto';
import { User } from '@prisma/client';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('login')
    async login(@Body() req: { email: string, password: string }) {
        if (!req.email || !req.password) {
            throw new HttpException("email and password is required !", HttpStatus.BAD_REQUEST);
        }
        return this.authService.validateUser(req.email, req.password);
    }

    @Post('signUp')
    async signUp(@Body() req :CreateUserDTO): Promise<User> {
       return await this.userService.addUser(req);
    }
}