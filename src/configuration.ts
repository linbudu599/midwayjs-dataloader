import { Configuration, App } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { getConnection } from 'typeorm';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import { mockService } from './utils/mock';

import User from './entities/User.entity';
import Post from './entities/Post.entity';
import Profile from './entities/Profile.entity';

@Configuration({
  imports: ['@midwayjs/orm'],
  importConfigs: ['./config'],
})
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: IMidwayKoaApplication;

  async onReady(container: IMidwayContainer) {
    this.app.use(await this.app.generateMiddleware('GraphQLMiddleware'));

    const connection = getConnection();

    console.log(`[ TypeORM ] connection [${connection.name}] established`);
    const mockUser1 = new User();

    const mockProfile1 = new Profile();
    mockProfile1.description = 'A Coder';

    const mockPost1 = new Post();
    mockPost1.title = 'The Power of MidwayJS';

    const mockPost2 = new Post();
    mockPost2.title = 'The Power of @nrwl/nx';

    mockUser1.name = '张三';
    mockUser1.profile = mockProfile1;
    mockUser1.posts = [mockPost1, mockPost2];

    await mockUser1.save();

    console.log(await connection.getRepository(User).find());

    console.log('[ TypeORM ] Mock Data Inserted');
  }
}
