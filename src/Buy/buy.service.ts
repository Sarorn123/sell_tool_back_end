import { Category } from '.prisma/client';
import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateBuyDTO } from './buy.dto';
import { ImageUploadService } from '../ImageUpload/imageUpload.service';
import { NotificationService } from '../Notification/notification.service';

@Injectable()
export class BuyService {
  constructor(
    private prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
    private readonly notificationService: NotificationService,
  ) { }

  async getAllBuys(query: any): Promise<any> {

    let pageNumber: number = 1;
    let totalPerPage: number = 10;

    if (query.pageNumber) {
      pageNumber = +query.pageNumber;
    }

    if (query.totalPerPage) {
      totalPerPage = +query.totalPerPage;
    }

    let queryTerms: any = {};
    if (query.user_id) {
      queryTerms.user_id = +query.user_id
    }
    if (query.product_id) {
      queryTerms.product_id = +query.product_id
    }

    if (query.start_date && query.end_date) {
      const end_date = new Date(query.end_date).toISOString();
      const start_date = new Date(query.start_date).toISOString();
      queryTerms.date = {
        lte: end_date,
        gte: start_date,
      }
    }

    const buys = await this.prisma.buy.findMany({
      where: queryTerms,
      include: {
        product: true,
        user: true,
      },
      orderBy: {
        date: "desc"
      },
      skip: totalPerPage * (pageNumber - 1),
      take: totalPerPage,
    });

    // pagination
    const allBuys = await this.prisma.buy.count();
    const totalPage = Math.ceil(allBuys / totalPerPage);

    let data = [];
    buys.forEach((buy: any) => {
      const image_url = this.imageUploadService.getImageUrl(buy.product.image_url);
      const newBuy = {
        id: buy.id,
        amount: buy.amount,
        user_id: buy.user_id,
        full_name: buy.user.full_name,
        email: buy.user.email,
        product_id: buy.product_id,
        product_name: buy.product.name,
        product_image: image_url,
        date: buy.date,
      }
      data.push(newBuy);
    });
    return { data, totalPage, totalPerPage, pageNumber, allBuys };

  }

  async addBuy(buyDTO: CreateBuyDTO) {

    const product = await this.prisma.product.findUnique({
      where: {
        id: +buyDTO.product_id
      }
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: +buyDTO.user_id
      }
    });

    if (!product) {
      throw new BadRequestException("Product Not Found !");
    }

    if (!user) {
      throw new BadRequestException("User Not Found !");
    }

    if (user.money < +product.price) {
      throw new BadRequestException("You Don't Have Enough Money !");
    }

    const newMoney = user.money - +product.price;

    const data = {
      user_id: +buyDTO.user_id,
      product_id: +buyDTO.product_id,
      amount: product.price,
    }

    const buy = await this.prisma.buy.create({ data });
    await this.prisma.user.update({
      where: {
        id: +buyDTO.user_id
      },
      data: {
        money: newMoney
      }
    });

    const notification = {
      title: "Sell Tool",
      message: user.full_name + " Buy " + product.name,
    }

    this.notificationService.notify("buyChannel","buy", notification)

    return buy; 
  }

}
