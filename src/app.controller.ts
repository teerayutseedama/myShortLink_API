import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('')
  testGetApi() {
    return 'Api Running';
  }
}
