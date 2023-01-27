import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkData, LinkDataDocument } from './linkdata.schema';
import { MongoRepo } from './mongo.repo';

@Injectable()
export class LinkDataModelService extends MongoRepo<LinkDataDocument> {
  constructor(
    @InjectModel(LinkData.name)
    private _model: Model<LinkDataDocument>,
  ) {
    super(_model);
  }
}
