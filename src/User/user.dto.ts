import { IsEmail, IsNotEmpty, IsOptional, Max, MaxLength } from "class-validator";

export class CreateUserDTO {

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(20)
  email : string

  @IsNotEmpty()
  @MaxLength(250)
  password : string

  @IsNotEmpty()
  @MaxLength(250)
  full_name : string

  @IsNotEmpty()
  @MaxLength(1)
  gender : number

  @IsNotEmpty()
  @MaxLength(250)
  phone_number : string

  @IsOptional()
  @MaxLength(1)
  role_id : number

  @IsOptional()
  image_url: string;

}


export class updateUserDTO {
  @IsOptional()
  @MaxLength(250)
  old_password : string

  @IsOptional()
  @MaxLength(250)
  new_password : string

  @IsOptional()
  @MaxLength(250)
  password : string
  
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(20)
  email : string

  @IsNotEmpty()
  @MaxLength(250)
  full_name : string

  @IsNotEmpty()
  @MaxLength(1)
  gender : any

  @IsNotEmpty()
  @MaxLength(250)
  phone_number : string

  @IsOptional()
  image_url : string
}