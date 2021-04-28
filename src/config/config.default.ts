import { ConnectionOptions } from 'typeorm';

export default () => {
  const config: Record<string, any> = {};

  config.orm = {
    type: 'sqlite',
    name: 'default',
    database: 'db.sqlite',
    synchronize: true,
    dropSchema: true,
    logger: 'advanced-console',
    entities: ['../entities/*'],
  } as ConnectionOptions;

  config.security = {
    csrf: false,
  };

  return config;
};
