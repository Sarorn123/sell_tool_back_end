import { Injectable, HttpException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../Prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ImageUploadService } from '../ImageUpload/imageUpload.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private imageUploadService: ImageUploadService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            }
        });

        if (user) {
            const compare = await bcrypt.compare(pass, user.password)
            const { password, ...currentUser } = user; // Remove Password From User Object
            currentUser.image_url = this.imageUploadService.getImageUrl(user.image_url);
            if (compare) {
                return {
                    user: currentUser,
                    access_token: await this.getAccessToken(user),
                    message: "Login Successfully"
                }
            } else {
                throw new UnauthorizedException("Password Not Correct");
            }
        }
        throw new HttpException("User Not Found !", HttpStatus.BAD_REQUEST);
    }

    async getAccessToken(user: any) {
        const payload = { username: user.full_name, sub: user.id };
        return this.jwtService.sign(payload);
    }

    getSingleUser = async (user_id: number): Promise<any> => {
        const user = await this.prisma.user.findUnique({
            where: {
                id: user_id,
            },
            include: {
                role: true,
            }
        });
        const { password, ...currentUser } = user;
        currentUser.image_url = this.imageUploadService.getImageUrl(user.image_url);
        return currentUser;
    }
}