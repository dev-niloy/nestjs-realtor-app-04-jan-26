import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from 'src/generated/prisma/enums';

interface SignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(
    { name, phone, email, password }: SignupParams,
    userType: UserType,
  ) {
    // check if user with email already exists
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRoundsEnv = process.env.SALT_ROUNDS;

    if (!saltRoundsEnv) {
      throw new Error('SALT_ROUNDS is not defined in environment variables');
    }

    const saltRounds = parseInt(saltRoundsEnv);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: userType,
      },
    });

    const token = this.generateJwtToken({
      userId: user.id,
      email: user.email,
      userType: user.user_type,
    });
    return { token };
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('User with this email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ConflictException('Wrong password!');
    }

    const token = this.generateJwtToken({
      userId: user.id,
      email: user.email,
      userType: user.user_type,
    });

    return { token };
  }

  generateProductKey(email: string, userType: UserType) {
    const string: string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    const saltRoundsEnv = process.env.SALT_ROUNDS;

    if (!saltRoundsEnv) {
      throw new Error('SALT_ROUNDS is not defined in environment variables');
    }

    const saltRounds = parseInt(saltRoundsEnv);

    return bcrypt.hash(string, saltRounds);
  }

  private generateJwtToken({
    userId,
    email,
    userType,
  }: {
    userId: number;
    email: string;
    userType: UserType;
  }) {
    const token = jwt.sign(
      { userId, email, userType },
      process.env.JSON_TOKEN_KEY as string,
      { expiresIn: '7d' },
    );
    return token;
  }
}
