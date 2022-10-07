import { Category } from './../../node_modules/.prisma/client/index.d';
import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateProductDTO, createCategoryDTO, UpdateProductDTO } from './product.dto';
import { ImageUploadService } from '../ImageUpload/imageUpload.service';
import { uuid } from 'uuidv4';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private imageUploadService: ImageUploadService,
  ) { }

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

    const finalProducts = [];
    allProducts.forEach(product => {
      const image_url = this.imageUploadService.getImageUrl(product.image_url)
      finalProducts.push({ ...product, image_url });
    });

    return finalProducts;
  }

  // get single product
  async getProduct(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      }
    });

    if (!product) {
      throw new HttpException("Not Product Found ", HttpStatus.BAD_REQUEST);
    }

    const image_url = this.imageUploadService.getImageUrl(product.image_url);
    return { ...product, image_url };

  }

  // add product 
  async addProduct(createProductDTO: CreateProductDTO, file: Express.Multer.File): Promise<Product> {

    const category = await this.prisma.category.findFirst({
      where: {
        id: Number(createProductDTO.categoryId)
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

    const validateImage = this.imageUploadService.validateImage(file);
    if (!validateImage.accept) {
      throw new HttpException(validateImage.message, HttpStatus.BAD_REQUEST);
    }

    // Save Image To Google Cloud 
    const image_name = uuid();
    const path: string = await this.imageUploadService.saveImage(
      "productImages/" + image_name + ".jpg",
      file.buffer,
    );

    const newCreateProductDTO = { ...createProductDTO, image_url: path, categoryId: Number(createProductDTO.categoryId) };
    const newProduct = await this.prisma.product.create({
      data: newCreateProductDTO,
    });

    const image_url = this.imageUploadService.getImageUrl(path);
    return { ...newProduct, image_url }
  }

  // update product 
  async updateProduct(
    id: number,
    updateProductDTO: UpdateProductDTO,
    file: Express.Multer.File | undefined
  ): Promise<Product> {

    const exist = await this.prisma.product.findFirst({
      where: {
        id: id
      }
    });

    if (!exist) {
      throw new HttpException(`Product Id = ${id} Not Found`, HttpStatus.BAD_REQUEST);
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id: Number(updateProductDTO.categoryId)
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

    // If Have Image To Change 
    if (file) {

      // Validate Image
      const validateImage = this.imageUploadService.validateImage(file);
      if (!validateImage.accept) {
        throw new HttpException(validateImage.message, HttpStatus.BAD_REQUEST);
      }

      // Delete Image First 
      await this.imageUploadService.deleteImage(exist.image_url);
      // Save Image To Google Cloud 
      const image_name = uuid();
      const path: string = await this.imageUploadService.saveImage(
        "productImages/" + image_name + ".jpg",
        file.buffer,
      );
      updateProductDTO = { ...updateProductDTO, image_url: path }
    }
    updateProductDTO = { ...updateProductDTO, categoryId: Number(updateProductDTO.categoryId) };
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: id
      },
      data: updateProductDTO
    });
    const image_url = this.imageUploadService.getImageUrl(updatedProduct.image_url);
    return { ...updatedProduct, image_url }
  }

  // delete product 
  async deleteProduct(id: number): Promise<Product> {

    const product = await this.prisma.product.findFirst({
      where: {
        id: id
      }
    });

    if (!product) {
      throw new HttpException("Product Not Found", HttpStatus.BAD_REQUEST);
    }

    // Delete Image From Google Cloud 
    await this.imageUploadService.deleteImage(product.image_url);
    return this.prisma.product.delete({
      where: {
        id: id,
      }
    });
  }

}