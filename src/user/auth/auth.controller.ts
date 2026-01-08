import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { GenerateProductKeyDto, SignInDto, SignupDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UserType } from 'src/generated/prisma/enums';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException(
          'Product key is required for non-buyer users',
        );
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isValidProductKey) {
        throw new UnauthorizedException('Invalid product key');
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('signin')
  signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Post('generate-product-key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
