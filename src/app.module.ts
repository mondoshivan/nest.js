import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { CatsService } from '@root/cat.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CatsService],
})
export class AppModule {}
