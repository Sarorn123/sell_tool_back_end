import { Body, Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateUserDTO, updateUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProductDTO } from '../Product/product.dto';
import { ImageUploadService } from '../ImageUpload/imageUpload.service';
import { Multer } from 'multer';
import { uuid } from 'uuidv4';


@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private imageUploadService: ImageUploadService,
  ) { }

  async getAllUsers(query: any): Promise<any> {

    let pageNumber: number = 1;
    let totalPerPage: number = 10;

    if (query.pageNumber) {
      pageNumber = Number(query.pageNumber);
    }

    if (query.totalPerPage) {
      totalPerPage = Number(query.totalPerPage);
    }

    let queryTerms = {};
    if (query.fullname) {
      queryTerms = { ...queryTerms, "full_name": { contains: query.fullname } }
    }

    let userQuery = await this.prisma.user.findMany({
      where: queryTerms,
      orderBy: {
        created_at: "desc"
      },
      skip: totalPerPage * (pageNumber - 1),
      take: totalPerPage,
    });

    const users = [];
    userQuery.forEach(user => {
      let image_url = "";
      if (user.image_url) {
        image_url = this.imageUploadService.getImageUrl(user.image_url)
      }
      users.push({ ...user, image_url });
    });

    // pagination
    const count = await this.prisma.user.count();
    const totalPage = Math.ceil(count / totalPerPage);

    return { users, totalPage, totalPerPage, pageNumber, count };
  }

  async addUser(createUserDTO: CreateUserDTO, file: Express.Multer.File): Promise<any> {

    if (createUserDTO.role_id) {
      const role = await this.prisma.role.findUnique({ where: { id: +createUserDTO.role_id } });
      if (!role) throw new HttpException("Role not found !", HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { email: createUserDTO.email } });
    if (user) throw new HttpException("Email Existed !", HttpStatus.BAD_REQUEST);

    // validate image  
    if (file) {
      const validateImage = this.imageUploadService.validateImage(file);
      if (!validateImage.accept) {
        throw new HttpException(validateImage.message, HttpStatus.BAD_REQUEST);
      }
      // Save Image To Google Cloud 
      const image_name = uuid();
      const path = await this.imageUploadService.saveImage(
        "profileImages/" + image_name + ".jpg",
        file.buffer,
      );
      createUserDTO.image_url = path;
    }

    // Bcrype Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);
    createUserDTO.gender = +createUserDTO.gender;
    createUserDTO.password = hashedPassword;
    createUserDTO.role_id = +createUserDTO.role_id;
    const newUser = await this.prisma.user.create({
      data: createUserDTO,
    });

    return newUser;

  }

  async addRole(name: string) {
    return this.prisma.role.create({
      data: {
        name
      }
    });
  }

  async getSingleUser(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        chargHistory: true,
        role: true,
      }
    });

    if (user) {
      if (user.image_url) user.image_url = this.imageUploadService.getImageUrl(user.image_url);
      return user;
    } else {
      throw new BadRequestException("User Not Founded");
    }

  }

  async updateUser(
    id: number,
    updateUserDTO: updateUserDTO,
    currentUser: { userId: number, username: string },
    file: Express.Multer.File
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new BadRequestException("User Not Found!");
    }


    if (user.id !== currentUser.userId) {
      throw new BadRequestException("You Can only update Your Sefl !");
    }

    // Check Email Logic 
    let isThisUser = true;
    const checkEmail = await this.prisma.user.findUnique({
      where: {
        email: updateUserDTO.email,
      }
    });
    if (checkEmail) {
      isThisUser = false;
      if (checkEmail.id === currentUser.userId) {
        isThisUser = true;
      }
    }
    if (!isThisUser) {
      throw new BadRequestException("Email Already Existed !");
    }

    // Check Password Logic 
    if (updateUserDTO.new_password) {
      if (!updateUserDTO.old_password) {
        throw new BadRequestException("old_password is need !");
      }

      if (!await bcrypt.compare(updateUserDTO.old_password, user.password)) {
        throw new BadRequestException("old_password not correct !");
      }
      updateUserDTO.password = await bcrypt.hash(updateUserDTO.new_password, 10)
    }
    // validate image  
    if (file) {
      console.log("file", file)
      const validateImage = this.imageUploadService.validateImage(file);
      if (!validateImage.accept) {
        throw new HttpException(validateImage.message, HttpStatus.BAD_REQUEST);
      }
      await this.imageUploadService.deleteImage(user.image_url);
      // Save Image To Google Cloud 
      const image_name = uuid();
      const path = await this.imageUploadService.saveImage(
        "profileImages/" + image_name + ".jpg",
        file.buffer,
      );
      updateUserDTO.image_url = path
    }
    updateUserDTO.gender = +updateUserDTO.gender

    const Updateduser = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        full_name: updateUserDTO.full_name,
        email: updateUserDTO.email,
        gender: updateUserDTO.gender,
        phone_number: updateUserDTO.phone_number,
        password: updateUserDTO.password,
        image_url: updateUserDTO.image_url,
      },
      include: {
        role: true,
        chargHistory: true,
      }
    });

    Updateduser.image_url = this.imageUploadService.getImageUrl(Updateduser.image_url)
    return Updateduser;
  }

  async chargeMoney(user_id: string, amount: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +user_id
      }
    });
    if (!user) throw new BadRequestException("user not found !");

    await this.prisma.chargHistory.create({
      data: {
        user_id: +user_id,
        currency: "រ",
        amount: amount
      },
    });

    return await this.prisma.user.update({
      where: {
        id: +user_id,
      },
      data: {
        money: +amount
      }
    })
  }

}