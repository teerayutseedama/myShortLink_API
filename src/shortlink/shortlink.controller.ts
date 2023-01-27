import { Body, Controller, Get, Post } from '@nestjs/common';

import { ShortLinkBusiness } from './shortlink.business';
import { ISaveLinkReq, IUpdateVisitorGetLinkReq } from './shortlink.interface';

@Controller('shortlink')
export class ShortLinkController {
  constructor(private _shortlinkBusiness: ShortLinkBusiness) {}
  @Get('Test')
  testGet() {
    return 'API Running';
  }
  @Post('saveLink')
  async saveLink(@Body() request: ISaveLinkReq) {
    return await this._shortlinkBusiness.saveLink(request);
  }
  @Post('updateVisitor')
  async updateVisitor(@Body() request: IUpdateVisitorGetLinkReq) {
    return await this._shortlinkBusiness.updateVisitor(request);
  }
}
