import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from '@cats/dto/create-cat.dto';
import { CatsService } from '@cats/cats.service';
import { Cat } from '@cats/interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  /**
   * In Nest, thanks to TypeScript capabilities, it's extremely easy to manage dependencies
   * because they are resolved just by type.
   * In the example below, Nest will resolve the catsService by creating and returning an instance of CatsService
   * (or, in the normal case of a singleton, returning the existing instance if it has already been requested elsewhere).
   * This dependency is resolved and passed to your controller's constructor (or assigned to the indicated property).
   * @param catsService
   */
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
