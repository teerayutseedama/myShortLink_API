import { ClientSession, FilterQuery, Model } from 'mongoose';
import { Observable } from 'rxjs';

export abstract class MongoRepo<M> {
  private _mgModel: Model<M>;

  constructor(model: any) {
    this._mgModel = model;
  }
  public findAll(session?: ClientSession): Promise<M[]> {
    return this._mgModel.find({}, null, { session }).exec();
  }
  public findList(
    condition: FilterQuery<any>,
    session?: ClientSession,
  ): Promise<M[]> {
    return this._mgModel.find(condition, null, { session }).exec();
  }

  public findOne(
    condition: FilterQuery<any>,
    session?: ClientSession,
  ): Promise<M> {
    return this._mgModel.findOne(condition, null, { session }).exec();
  }

  public findById(id: any, session?: ClientSession): Promise<M> {
    return this._mgModel.findById(id, null, { session }).exec();
  }

  public create(model: any, session?: ClientSession): Promise<any> {
    const createdData = new this._mgModel(model);
    return createdData.save({ session });
  }
  public createMany(model: any[], session?: ClientSession): Promise<any> {
    const createdData = new this._mgModel(model);
    return createdData.collection.insertMany(model);
  }
  public update(
    condition: Record<string, any>,
    data: any,
    session?: ClientSession,
  ): Promise<any> {
    return this._mgModel.updateOne(condition, data, { session }).exec();
  }
  public watch(): Observable<any> {
    return new Observable((obs) => {
      this._mgModel.watch().on('change', (next) => {
        obs.next(next);
      });
    });
  }
}
