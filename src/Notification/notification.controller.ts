import { Controller, Get, Post, } from '@nestjs/common';
import { Body, Delete, Param, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { NotificationService } from './notification.service';

@Controller({
  path: "/notification"
})
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,

  ) { }

  @Get()
  async getAllNotification(@Query() query: any): Promise<any> {
    return await this.notificationService.get10Notification();
  }

  @Post()
  async addNotification(@Body() notificationDTO: {message: string, title: string}) {
    return await this.notificationService.addNotification(notificationDTO);
  }

  @Put("/:id")
  async update( @Param('id') id: number,) {
    return await this.notificationService.updateSawNotification(id);
  }

}
