import { Injectable, HttpException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            }
        });
        if (user && bcrypt.compare(pass, user.password)) {
            const { password, ...currentUser } = user; // Remove Password From User Object

            return {
                user: currentUser,
                access_token: await this.getAccessToken(user),
                message: "Login Successfully"
            }
        }

        throw new HttpException("Login Not Success !", HttpStatus.BAD_REQUEST);
        
    }

    async getAccessToken(user: any) {
        const payload = { username: user.full_name, sub: user.id };
        return this.jwtService.sign(payload);
    }
}