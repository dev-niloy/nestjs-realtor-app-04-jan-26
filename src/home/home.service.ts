import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prisma.home.findMany();
    return homes.map((home) => new HomeResponseDto(home));
  }

  async getAHome(id: number): Promise<HomeResponseDto> {
    const home = await this.prisma.home.findUnique({
      where: { id },
    });

    if (!home) {
      throw new Error('Home not found');
    }

    return new HomeResponseDto(home);
  }

  async createHome() {}

  async updateHome() {}

  async deleteHome(id: number) {
    // check if the home exists
    const home = await this.prisma.home.findUnique({
      where: { id },
    });
    if (!home) {
      throw new Error('Home not found');
    }

    // delete the home
    await this.prisma.home.delete({
      where: { id },
    });
  }

  async inquireHome() {}
}
