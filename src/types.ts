import { SampleContext } from './lib/sample';
import { mockService } from './utils/mock';

export type BaseContext = {
  service: typeof mockService;
};

export type ApolloContext = BaseContext & SampleContext;
