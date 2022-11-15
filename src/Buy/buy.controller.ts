import { Category, Product } from '@prisma/client';
import { Controller, Get, Post, } from '@nestjs/common';
import { Body, Delete, Param, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { CreateBuyDTO } from './buy.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BuyService } from './buy.service';
import { ImageUploadService } from '../ImageUpload/imageUpload.service';

@Controller({
  path: "/buy"
})
export class BuyController {
  constructor(
    private readonly buyService: BuyService,

  ) { }

  @Get()
  async getAllBuys(@Query() query: any): Promise<{ data: any, paginate: any }> {
    const { data, totalPage, totalPerPage, pageNumber, allBuys } = await this.buyService.getAllBuys(query);
    return {
      data: data,
      paginate: {
        totalPage,
        totalPerPage,
        pageNumber,
        allBuys
      },
    }
  }

  @Post()
  async addbuy(@Body() buyDTO: CreateBuyDTO) {
    return await this.buyService.addBuy(buyDTO);
  }

}
