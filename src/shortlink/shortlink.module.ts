import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkData, LinkDataSchema } from 'src/shortlink/linkdata.schema';
import { LinkDataModelService } from './linkdata.model.service';
import { SharedModule } from './shared.module';

import { ShortLinkBusiness } from './shortlink.business';
import { ShortLinkController } from './shortlink.controller';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: LinkData.name, schema: LinkDataSchema },
    ]),
  ],
  exports: [LinkDataModelService],
  controllers: [ShortLinkController],
  providers: [LinkDataModelService, ShortLinkBusiness],
})
export class ShortLinkModule {}
