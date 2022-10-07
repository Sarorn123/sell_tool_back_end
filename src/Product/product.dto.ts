import {IsOptional, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  price: string;

  @IsOptional()
  description_kh: string;

  @IsOptional()
  description_en: string;
}

export class UpdateProductDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  image_url: string;

  @IsNotEmpty()
  price: string;

  @IsOptional()
  description_kh: string;

  @IsOptional()
  description_en: string;
}

export class createCategoryDTO {
  @IsNotEmpty()
  name: string;
}