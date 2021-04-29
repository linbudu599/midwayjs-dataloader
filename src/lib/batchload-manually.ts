// 手动注册的方式
import { Provide, Inject, Scope, ScopeEnum } from '@midwayjs/decorator';

import DataLoader from 'dataloader';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { TypeORMService } from '../service/typeorm.service';
import { Mutable, SampleContext } from '../types';
import { mockService } from '../utils/mock';

// 应当控制作用域
@Provide()
@Scope(ScopeEnum.Singleton)
export class DataLoaderMiddleware
  implements MiddlewareInterface<SampleContext> {
  @Inject()
  service: TypeORMService;

  async use(
    { root, args, context, info }: ResolverData<SampleContext>,
    next: NextFn
  ) {
    if (!context?.dataLoader?.initialized) {
      context.dataLoader = {
        initialized: true,
        loaders: {},
      };

      const loaders = context.dataLoader.loaders;

      loaders.userLoader = new DataLoader((ids: Readonly<number[]>) => {
        console.log(`userLoader invoke with ${ids}`);
        return mockService.getUsersByIds(ids as Mutable<number[]>);
      });

      loaders.petLoader = new DataLoader((ids: Readonly<number[]>) => {
        console.log(`petLoader invoke with ${ids}`);
        return mockService.getPetsByIds(ids as Mutable<number[]>);
      });

      loaders.userORMLoader = new DataLoader((ids: Readonly<number[]>) => {
        console.log(`userORMLoader invoke with ${ids}`);
        return this.service.getUsersByIds(ids as Mutable<number[]>);
      });

      loaders.postORMLoader = new DataLoader((ids: Readonly<number[]>) => {
        console.log(`postORMLoader invoke with ${ids}`);
        return this.service.getPostsByIds(ids as Mutable<number[]>);
      });

      loaders.profileORMLoader = new DataLoader((ids: Readonly<number[]>) => {
        console.log(`profileORMLoader invoke with ${ids}`);
        return this.service.getProfilesByIds(ids as Mutable<number[]>);
      });
    }

    return next();
  }
}
