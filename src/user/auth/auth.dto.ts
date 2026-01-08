import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserType } from 'src/generated/prisma/enums';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone number must be a valid Bangladeshi 11-digit number',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
