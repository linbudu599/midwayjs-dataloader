import * as path from 'path';
import { Provide, App } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayKoaApplication } from '@midwayjs/koa';
import { Middleware } from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';
import { getConnection } from 'typeorm';

import { mockService } from '../utils/mock';

import { DataLoaderMiddleware } from '../lib/batchload-manually';
import { DataLoaderMetadataMiddleware } from '../lib/auto-register-metadata';

import { ApolloContext } from '../types';

@Provide('GraphQLMiddleware')
export class GraphqlMiddleware implements IWebMiddleware {
  @App()
  app: IMidwayKoaApplication;

  resolve(): Middleware {
    const server = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [path.resolve(this.app.getBaseDir(), 'resolver/*')],
        container: this.app.getApplicationContext(),
        authMode: 'error',
        emitSchemaFile: true,
        globalMiddlewares: [DataLoaderMiddleware, DataLoaderMetadataMiddleware],
      }),
      context: {
        service: mockService,
        dataLoader: {
          initialized: false,
          loaders: {},
        },
        metadataLoader: {
          loaders: {},
        },
        container: this.app.getApplicationContext(),
        connection: getConnection(),
      } as ApolloContext,
    });
    console.log('Apollo-GraphQL Invoke');

    return server.getMiddleware({ path: '/graphql' });
  }
}
