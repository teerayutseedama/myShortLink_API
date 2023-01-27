import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { CustomException, IHttpResponse } from 'src/shortlink/http.interface';
import { LinkDataModelService } from './linkdata.model.service';
import {
  ISaveLinkReq,
  ISaveLinkRes,
  IUpdateVisitorGetLinkReq,
  IUpdateVisitorGetLinkRes,
} from './shortlink.interface';

@Injectable()
export class ShortLinkBusiness {
  private response: IHttpResponse;
  constructor(
    private _linkDataModelService: LinkDataModelService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {
    this.response = {
      data: null,
      error: null,
      message: {
        title: 'เสร็จสิ้น',
        type: 'success',
        desc: '',
      },
    };
  }
  async saveLink(reqData: ISaveLinkReq): Promise<IHttpResponse> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.setAction('save');
      const countLink = await this._linkDataModelService.findAll();

      const short =
        this.randomShort(4 - countLink.length.toString().length) +
        countLink.length;
      const newUrl = reqData.newUrl + short;
      await this._linkDataModelService.create(
        {
          oldUrl: reqData.url,
          newUrl: newUrl,
          short: short,
          status: 'active',
          visitors: 0,
          lastDatevisitor: new Date(),
          createDate: new Date(),
        },
        session,
      );
      const reslut: ISaveLinkRes = { short: short, newUrl: newUrl };
      this.response.data = reslut;
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      console.log('error', error);
      this.setError(error);
      session.abortTransaction();
    }
    return this.response;
  }

  async updateVisitor(
    reqData: IUpdateVisitorGetLinkReq,
  ): Promise<IHttpResponse> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.setAction('find');
      const link = await this._linkDataModelService.findOne({
        short: reqData.short,
        status: 'active',
      });
      if (link) {
        link.visitors += 1;
        await this._linkDataModelService.update(
          {
            short: reqData.short,
            status: 'active',
          },
          link,
          session,
        );
        const result: IUpdateVisitorGetLinkRes = { url: link.oldUrl };
        this.response.data = result;
      }
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      //session.abortTransaction();
      this.setError(error);
    }
    return this.response;
  }

  async getLink() {
    try {
    } catch (error) {}
    return this.response;
  }

  randomShort(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  setError(error: any, option?: CustomException) {
    if (error.status == 403) {
      this.response = error.response;

      throw new HttpException(this.response, error.status);
    }

    const _status = option?.httpStatus ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.response.data = null;
    this.response.error = error;
    this.response.message.type = 'danger';
    this.response.message.title = 'เกิดข้อผิดพลาด';
    this.response.message.desc = option?.desc ?? 'ระบบทำงานไม่สำเร็จ';

    throw new HttpException(this.response, _status);
  }
  setAction(action: 'save' | 'find' | 'other') {
    let title = '';
    switch (action) {
      case 'save':
        title = 'บันทึกข้อมูลสำเร็จ';
        break;
      case 'find':
        title = 'พบข้อมูล';
        break;
      case 'other':
        title = 'ดำเนินการสำเร็จ';
        break;
      default:
        title = 'เสร็จสิ้น';
        break;
    }
    this.response = {
      data: null,
      error: null,
      message: {
        title: title,
        type: 'success',
        desc: '',
      },
    };
  }
}
