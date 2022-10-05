import { Category } from './../../node_modules/.prisma/client/index.d';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateProductDTO, createCategoryDTO, UpdateProductDTO } from './product.dto';
import { isNotIn } from 'class-validator';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  // ====> Category <==== //

  async addCategory(createCategoryDTO: createCategoryDTO): Promise<Category> {

    const category = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDTO.name
      }
    });

    if (category) {
      throw new HttpException(`Category name = ${createCategoryDTO.name} Already Existed !`, HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.category.create({
      data: createCategoryDTO
    });
  }

  async getAllCategory(): Promise<Category[]> {
    return this.prisma.category.findMany({



      include: {
        products: true,
      }
    });
  }

  // ====> End Category <==== //

  // get all products 
  async getAllProducts(query: any): Promise<Product[]> {

    let pageNumber: number = 1;
    let totalPerPage: number = 10;

    if (query.pageNumber) {
      pageNumber = Number(query.pageNumber);
    }

    if (query.totalPerPage) {
      totalPerPage = Number(query.totalPerPage);
    }

    let queryTerms = {};
    if (query.name) {
      queryTerms = { ...queryTerms, "name": { contains: query.name } }
    }
    if (query.categoryId) {
      queryTerms = { ...queryTerms, "categoryId": Number(query.categoryId) }
    }
    if (query.price) {
      queryTerms = { ...queryTerms, "price": query.price }
    }

    let allProducts = await this.prisma.product.findMany({
      where: queryTerms,
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc"
      },
      skip: totalPerPage * (pageNumber - 1),
      take: totalPerPage,
    });

    return allProducts;
  }

  // get single product
  async getProduct(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: {
        id: id,

      },
      include: {
        category: true,
      }
    });
  }

  // add product 
  async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {

    const category = await this.prisma.category.findFirst({
      where: {
        id: createProductDTO.categoryId
      }
    });

    if (!category) {
      throw new HttpException(`Category Id = ${createProductDTO.categoryId} Not Found`, HttpStatus.BAD_REQUEST);
    }

    const product = await this.prisma.product.findFirst({
      where: {
        name: createProductDTO.name,
        price: createProductDTO.price,
      }
    });

    if (product) {
      throw new HttpException(`Product Already Existed !`, HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.product.create({
      data: createProductDTO
    });
  }

  // update product 
  async updateProduct(id: number, updateProductDTO: UpdateProductDTO): Promise<Product> {

    const category = await this.prisma.category.findFirst({
      where: {
        id: updateProductDTO.categoryId
      }
    });

    if (!category) {
      throw new HttpException(`Category Id = ${updateProductDTO.categoryId} Not Found`, HttpStatus.BAD_REQUEST);
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: {
          not: id
        },
        name: updateProductDTO.name,
        price: updateProductDTO.price,
      }
    });

    if (product) {
      throw new HttpException(`Product Already Existed !`, HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.product.update({
      where: {
        id: id
      },
      data: updateProductDTO
    });
  }

  // delete product 
  async deleteProduct(id: number): Promise<any> {

    const product = await this.prisma.product.findFirst({
      where: {
        id: id
      }
    });

    if (!product) {
      throw new HttpException("Product Not Found", HttpStatus.BAD_REQUEST);
    }

    return this.prisma.product.delete({
      where: {
        id: id,
      }
    });
  }

}