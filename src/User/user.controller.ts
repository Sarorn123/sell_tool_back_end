import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO, updateUserDTO } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { Roles } from '../Authorization/roles.decorator';
import { Role } from '../Authorization/role.enum';
import { getUserLoggedIn } from 'src/Decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: "/user"
})
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllusers(@Query() query: any): Promise<{ data: any, paginate: any }> {
    const { users, totalPage, totalPerPage, pageNumber, count } = await this.userService.getAllUsers(query);
    return {
      data: users,
      paginate: {
        totalPage,
        totalPerPage,
        pageNumber,
        total: count
      }
    }
  }

  @Post()
  async addUser(
    @Body() createUserDTO: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ data: User }> {
    return {
      data: await this.userService.addUser(createUserDTO, file)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async editUser(
    @Body() updateUserDTO: updateUserDTO,
    @getUserLoggedIn() currentUser: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ data: User }> {
    return {
      data: await this.userService.updateUser(+id, updateUserDTO, currentUser, file)
    }
  }

  @Get("/:id")
  async getSingleUser(@Param('id') id: string) {
    const user = await this.userService.getSingleUser(+id);
    return {
      data: user
    }
  }

  @Post('/addRole')
  async addRole(@Body() DTO: any): Promise<any> {
    return {
      data: await this.userService.addRole(DTO.name)
    }
  }

  @Post('/chargeMoney')
  async chargeMoney(@Body() DTO: any): Promise<any> {
    if (!DTO.user_id) throw new BadRequestException("user_id is requ");
    if (!DTO.amount) throw new BadRequestException("amount is requ");

    const user = await this.userService.chargeMoney(DTO.user_id, DTO.amount);
    return {
      data: user,
    }
  }

 
}
