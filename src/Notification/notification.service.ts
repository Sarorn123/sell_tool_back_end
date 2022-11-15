import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class NotificationService {

  private MyPusher: Pusher;
  constructor(
    private prisma: PrismaService
  ) {
    const Pusher = require('pusher');
    this.MyPusher = new Pusher({
      appId: process.env.PUSHER_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: "ap1",
      useTLS: true,
    });

  }

  // for push notification 
  notify(channel: string, event: string, data: any) {
    this.MyPusher.trigger(channel, event, data);
  }

  async addNotification(notificationDTO: any) {
    await this.prisma.notification.create({
      data: notificationDTO
    });

    const notices = await this.prisma.notification.findMany({
      orderBy: {
        date: "desc",
      },
      take: 10
    });

    return notices;
  }

  async get10Notification() {
    const notices = await this.prisma.notification.findMany({
      orderBy: {
        date: "desc",
      },
      take: 10
    });

    return notices;
  }

  async updateSawNotification(id: number) {

    await this.prisma.notification.update({
      where: {
        id: +id
      },
      data: {
        saw: true
      }
    });

    const notices = await this.prisma.notification.findMany({
      orderBy: {
        date: "desc",
      },
      take: 10
    });

    return notices;
  }



}