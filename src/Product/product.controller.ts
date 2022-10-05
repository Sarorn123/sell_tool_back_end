import { Product } from '@prisma/client';
import { Controller, Get, Post } from '@nestjs/common';
import { Body, Delete, Param, Put, Query } from '@nestjs/common/decorators';
import { CreateProductDTO, createCategoryDTO, UpdateProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller({
  path: "/product"
})
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // ====> Category <==== //

  @Post("/addCategory")
  async addCategory(@Body() createCategoryDTO: createCategoryDTO) {
    return await this.productService.addCategory(createCategoryDTO);
  }

  @Get("/getAllCategory")
  async getAllCategory() {
    return await this.productService.getAllCategory();
  }


  // ====> End Category <==== //

  @Get()
  async getAllProducts(@Query() query: any): Promise<{ data : Product[] }> {

    return {
      data : await this.productService.getAllProducts(query),
    }
  }

  @Post()
  async addProduct(@Body() createProductDTO: CreateProductDTO) {
    return await this.productService.addProduct(createProductDTO);
  }

  @Get('/:id')
  async getProduct(@Param('id') id: number) {
    return await this.productService.getProduct(id);
  }

  @Put('/:id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDTO: UpdateProductDTO) {
    return await this.productService.updateProduct(Number(id), updateProductDTO);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productService.deleteProduct(Number(id));
  }
}
