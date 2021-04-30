import DataLoader from 'dataloader';
import { UseMiddleware } from 'type-graphql';
import { IMidwayContainer } from '@midwayjs/core';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { keyBy, groupBy, Dictionary } from 'lodash';

import type { ObjectType, Connection } from 'typeorm';

import { ApolloContext } from '../types';

// @IntegrationLoader((type)=>User, (User)=>User.xxx)
export type ReturnTypeFunc<T> = (type?: void) => ObjectType<T>;
export type RelationKeyFunc<T> = (relationOwner: ObjectType<T>) => any;

export const IntegrationLoader = <T>(
  returnTypeFunc: ReturnTypeFunc<T>,
  relationKeyFunc: RelationKeyFunc<T>
): PropertyDecorator => {
  return (target: unknown, propertyKey: string) => {
    UseMiddleware(async ({ root, context }, next) => {
      const connection = (context as ApolloContext).connection;
      const relationMetadata = connection
        .getMetadata(target.constructor)
        .findRelationWithPropertyPath(String(propertyKey));

      if (relationMetadata === null) {
        return await next();
      }
    });
  };
};
const handler = <EntityType>(
  connection: Connection,
  relationMetadata: RelationMetadata,
  columns: ColumnMetadata[],
  dataLoaderInstance: (connection: Connection) => DataLoader<any, EntityType>,
  callback: (
    dataloader: DataLoader<any, EntityType>,
    columns: ColumnMetadata[]
  ) => Promise<any>,
  container: IMidwayContainer
) => {
  const identifier = `DataLoader_${relationMetadata.entityMetadata.tableName}_${relationMetadata.propertyName}`;
  if (!container.get<{ loader: DataLoader<any, EntityType> }>(identifier)) {
    container.registerObject(identifier, {
      loader: dataLoaderInstance(connection),
    });
  }

  return callback(
    container.get<{ loader: DataLoader<any, EntityType> }>(identifier).loader,
    columns
  );
};

const toOneRelationHandler = async <T>(
  relationKeyFunc: RelationKeyFunc<T>,
  root: any,
  connection: Connection,
  relation: RelationMetadata,
  container: IMidwayContainer
) => {
  return handler(
    connection,
    relation,
    relation.inverseEntityMetadata.primaryColumns,
    connection => new ToOneDataloader<T>(relation, connection),
    async dataloader => {
      const fk = relationKeyFunc(root);
      return fk != null ? await dataloader.load(fk) : null;
    },
    container
  );
};

class ToOneDataloader<EntityType> extends DataLoader<any, EntityType> {
  constructor(relation: RelationMetadata, connection: Connection) {
    super(
      directLoader(
        relation,
        connection,
        relation.inverseEntityMetadata.primaryColumns[0].propertyName
      )
    );
  }
}

function directLoader<EntityType>(
  relation: RelationMetadata,
  connection: Connection,
  grouper: string | ((entity: EntityType) => any)
) {
  return async (ids: readonly any[]) => {
    const entities = keyBy(
      await connection
        .createQueryBuilder<EntityType>(relation.type, relation.propertyName)
        .whereInIds(ids)
        .getMany(),
      grouper
    ) as Dictionary<EntityType>;
    return ids.map(id => entities[id]);
  };
}
