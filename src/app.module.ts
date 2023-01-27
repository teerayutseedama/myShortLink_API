import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules } from './shortlink/module.collection';

import { AppController } from './app.controller';
import { ShortLinkModule } from './shortlink/shortlink.module';
@Module({
  imports: [
    ...Modules,
    ShortLinkModule,
    MongooseModule.forRoot(
      'mongodb+srv://shotlinkUsername1111:LEesBpFbFfwNf25@cluster0.iqhjf59.mongodb.net/test',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
