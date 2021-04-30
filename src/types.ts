import DataLoader from 'dataloader';
import { IMidwayContainer } from '@midwayjs/core';
import { Connection } from 'typeorm';
import { mockService } from './utils/mock';

export type BaseContext = {
  service: typeof mockService;
};

export type ApolloContext = BaseContext & SampleContext;

export interface SampleContext {
  dataLoader: {
    initialized: boolean;
    loaders: Record<string, DataLoader<any, any, any>>;
  };
  metadataLoader: {
    loaders: Record<string, Record<string, DataLoader<any, any, any>>>;
  };
  connection: Connection;
  container: IMidwayContainer;
}

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export type RegisteredPlainDataLoader = Record<string, DataLoader<number, any>>;
