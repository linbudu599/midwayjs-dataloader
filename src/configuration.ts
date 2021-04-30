import { Configuration, App } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { getConnection } from 'typeorm';
import { IMidwayKoaApplication } from '@midwayjs/koa';
import { mockService } from './utils/mock';
import { TypeORMService } from './service/typeorm.service';
import DataLoader from 'dataloader';
import { RegisteredPlainDataLoader } from './types';

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
    // TODO: extract to methods alone
    const mockUser1 = new User();
    const mockUser2 = new User();

    const mockProfile1 = new Profile();
    mockProfile1.description = 'A Coder';

    const mockProfile2 = new Profile();
    mockProfile2.description = 'A Dreamer';

    const mockPost1 = new Post();
    mockPost1.title = 'The Power of MidwayJS';

    const mockPost2 = new Post();
    mockPost2.title = 'The Power of GraphQL';

    const mockPost3 = new Post();
    mockPost3.title = 'The Power of LOL';

    mockUser1.name = '张三';
    mockUser1.profile = mockProfile1;
    mockUser1.posts = [mockPost1, mockPost2];

    mockUser2.name = '王五';
    mockUser2.profile = mockProfile2;
    mockUser2.posts = [mockPost3];

    await mockUser1.save();
    await mockUser2.save();

    console.log(await connection.getRepository(User).find());

    console.log('[ TypeORM ] Mock Data Inserted');

    // 这种方式只适用于这种没有外部依赖的batchLoadFn
    // 假设你想要在这里注入一个service（如TypeORMService）
    // 并且service内部存在@Inject()的属性注入，那么这一属性不会被注入
    // 但是，你可以直接调用ORM，如ormUserLoader
    this.app.getApplicationContext().registerObject('LOADER', {
      userLoader: new DataLoader((ids: number[]) =>
        mockService.getUsersByIds(ids)
      ),
      petLoader: new DataLoader((ids: number[]) =>
        mockService.getPetsByIds(ids)
      ),
      ormUserLoader: new DataLoader(
        async (ids: number[]) =>
          await connection.getRepository(User).findByIds(ids)
      ),
    } as RegisteredPlainDataLoader);
  }
}
