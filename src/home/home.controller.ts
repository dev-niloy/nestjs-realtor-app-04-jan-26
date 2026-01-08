import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  async getAllHomes(): Promise<HomeResponseDto[]> {
    const homes = this.homeService.getAllHomes();
    return homes;
  }

  @Get(':id')
  async getAHome(@Param('id') id: number): Promise<HomeResponseDto> {
    const home = this.homeService.getAHome(id);
    return home;
  }

  @Post()
  createHome() {}

  @Put(':id')
  updateHome() {}

  @Delete(':id')
  deleteHome(@Param('id') id: number) {
    return this.homeService.deleteHome(id);
  }

  @Post(':id')
  inquireHome() {}
}
