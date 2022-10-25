import { Body, Controller, Get, Post, UseGuards, } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { Roles } from '../Authorization/roles.decorator';
import { Role } from '../Authorization/role.enum';

@Controller({
  path: "/user"
})
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<{ data: User[] }> {
    return {
      data: await this.userService.getAllUsers()
    }
  }

  @Post()
  async addUser(@Body() createUserDTO: CreateUserDTO): Promise<{ data: User }> {
    return {
      data: await this.userService.addUser(createUserDTO)
    }
  }

  @Post('/addRole')
  async addRole(@Body() DTO:any): Promise<any> {
    return {
      data: await this.userService.addRole(DTO.name)
    }
  }


}
