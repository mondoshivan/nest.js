import { SendCatDTO } from '@dto/send-cat.dto';
import { Cat } from '@interfaces/cat.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: CatsService) {}

  @Get()
  getAll(): SendCatDTO[] {
    return this.appService.findAll();
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }
}
