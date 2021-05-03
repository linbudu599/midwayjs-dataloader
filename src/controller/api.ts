import { Inject, Controller, Post, Provide, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;
}
