// 手动注册的方式
import { Provide } from '@midwayjs/decorator';

import DataLoader from 'dataloader';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { mockService } from '../utils/mock';

export interface SampleContext {
  dataLoader: {
    initialized: boolean;
    loaders: Record<string, DataLoader<any, any, any>>;
  };
}

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

@Provide()
export class DataLoaderMiddleware
  implements MiddlewareInterface<SampleContext> {
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
    }

    return next();
  }
}
