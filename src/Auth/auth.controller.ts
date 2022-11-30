import { Controller, Post, UseGuards, Body, HttpException, HttpStatus, Res, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../User/user.service';
import { CreateUserDTO } from '../User/user.dto';
import { User } from '@prisma/client';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { getUserLoggedIn } from 'src/Decorators/user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('login')
    async login(
            @Res({ passthrough: true }) res : Response,  
            @Body() req: { email: string, password: string,},
            @Req() request: Request
        ) {
            console.log(req);
        if (!req.email || !req.password) {
            throw new HttpException("email and password is required !", HttpStatus.BAD_REQUEST);
        }

        const authenticate = await this.authService.validateUser(req.email, req.password);
        const access_token = authenticate.access_token;
        try {
            res.cookie('access_token', access_token , {
                maxAge: 60*60*24*30,
                sameSite: 'none',
                httpOnly: true,
                secure: true,
                
            });
            res.cookie('role', authenticate.user.role.name , {
                maxAge: 60*60*24*30,
                sameSite: 'none',
                httpOnly: true,
                secure: true,
                
            });
            
            return authenticate.user;
            
        } catch (error) {
            return res.send(error);
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(
            @Res({ passthrough: true }) res : Response,  
            @Req() request: Request
        ) {

        try {
            res.cookie('access_token', null , {
                maxAge: -1,
                sameSite: 'strict',
                httpOnly: true,
            });

            res.cookie('role', null , {
                maxAge: -1,
                sameSite: 'strict',
                httpOnly: true,
            });
            
            return {message: "Logged Out"};
            
        } catch (error) {
            return res.send(error);
        }
    }

    @Post('signUp')
    @UseInterceptors(FileInterceptor('image'))
    async signUp(
        @Body() req :CreateUserDTO,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<User> {
       return await this.userService.addUser(req, file);
    }

    @Post('getUserByToken')
    @UseGuards(JwtAuthGuard)
    async getUserByToken(
        @getUserLoggedIn() user: any
        ): Promise<any> {
        return this.authService.getSingleUser(user.userId);
    }
}