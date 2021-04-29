import { SampleContext } from './lib/batchload-manually';
import { mockService } from './utils/mock';

export type BaseContext = {
  service: typeof mockService;
};

export type ApolloContext = BaseContext & SampleContext;
