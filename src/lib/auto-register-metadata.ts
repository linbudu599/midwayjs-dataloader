import { Provide, Inject, Scope, ScopeEnum } from '@midwayjs/decorator';

import DataLoader from 'dataloader';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { TypeORMService } from '../service/typeorm.service';
import { Mutable, SampleContext } from '../types';
import { mockService } from '../utils/mock';

// 应当控制作用域
@Provide()
@Scope(ScopeEnum.Singleton)
export class DataLoaderMetadataMiddleware
  implements MiddlewareInterface<SampleContext> {
  @Inject()
  service: TypeORMService;

  async use(
    { root, args, context, info }: ResolverData<SampleContext>,

    next: NextFn
  ) {
    const loaders = context.metadataLoader.loaders;

    // TODO: 应当在应用启动时注册?
    context.connection.entityMetadatas.forEach(entityMetadata => {
      // 所有实体的名称
      // ORMUser Profile Post
      const target = entityMetadata.targetName;
      // console.log('target: ', target);
      if (!target) return;

      if (!loaders[target]) {
        loaders[target] = {};
      }

      entityMetadata.relations.forEach(relation => {
        // 实体中存在的级联关系
        // console.log('relation: ', relation.propertyName);
        if (!loaders[target][relation.propertyName]) {
          // loader.Entity.RelationColumn
          loaders[target][relation.propertyName] = new DataLoader(
            async (entities: Readonly<any[]>) => {
              console.log('entities: ', entities);
              console.log('relation: ', relation.propertyName);
              console.log(
                `=== BatchLoader Apply On ${target}.${relation.propertyName} ===`
              );

              const relationIdLoader = context.connection.relationIdLoader;

              const res = (
                await relationIdLoader.loadManyToManyRelationIdsAndGroup(
                  relation,
                  entities
                )
              ).map(group => group.related);

              // return entities.map(entity => entity.posts);
              return res;
            }
          );
        }
      });
    });

    // console.log('loaders: ', loaders);
    return next();
  }
}
