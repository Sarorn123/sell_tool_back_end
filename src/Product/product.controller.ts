import { Category, Product } from '@prisma/client';
import { Controller, Get, Post, } from '@nestjs/common';
import { Body, Delete, Param, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { CreateProductDTO, createCategoryDTO, UpdateProductDTO } from './product.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: "/product"
})
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  // ====> Category <==== //

  @Post("/addCategory")
  async addCategory(@Body() createCategoryDTO: createCategoryDTO) {
    return await this.productService.addCategory(createCategoryDTO);
  }

  @Get("/getAllCategory")
  async getAllCategory(): Promise<{ data: Category[] }> {
    return {
      data: await this.productService.getAllCategory()
    }
  }

  // ====> End Category <==== //

  @Get()
  async getAllProducts(@Query() query: any): Promise<{ data: Product[] }> {

    return {
      data: await this.productService.getAllProducts(query),
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDTO: CreateProductDTO
  ): Promise<{data : Product}> {
    return {
      data : await this.productService.addProduct(createProductDTO, file),
    }
  }

  @Get('/:id')
  async getProduct(@Param('id') id: number): Promise<{ data: Product }> {
    return {
      data: await this.productService.getProduct(Number(id))
    }
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDTO: UpdateProductDTO): Promise<{ data: Product }> {
    return {
      data: await this.productService.updateProduct(Number(id), updateProductDTO, file)
    }
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number): Promise<{ data: Product }> {
    return {
      data: await this.productService.deleteProduct(Number(id))
    }
  }
}
