import { Body, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {

    if (createUserDTO.role_id) {
      const role = await this.prisma.role.findUnique({ where: { id: +createUserDTO.role_id } });
      if (!role) throw new HttpException("Role not found !", HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { email: createUserDTO.email } });
    if (user) throw new HttpException("Email Existed !", HttpStatus.BAD_REQUEST);

    // Bcrype Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
    createUserDTO.gender = +createUserDTO.gender;
    createUserDTO.password = hashedPassword

    return this.prisma.user.create({
      data: createUserDTO,
    })
  }

  async addRole(name: string) {
    return this.prisma.role.create({
      data: {
        name
      }
    });
  }

}