import {IsOptional, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBuyDTO {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  product_id: string;
}
