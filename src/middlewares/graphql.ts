import * as path from 'path';
import { Provide, App } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayKoaApplication } from '@midwayjs/koa';
import { Middleware } from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';

import { mockService } from '../utils/mock';

import { DataLoaderMiddleware } from '../lib/batchload-manually';

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
        globalMiddlewares: [DataLoaderMiddleware],
      }),
      context: {
        service: mockService,
        dataLoader: {
          initialized: false,
          loaders: {},
        },
      } as ApolloContext,
    });
    console.log('Apollo-GraphQL Invoke');

    return server.getMiddleware({ path: '/graphql' });
  }
}
