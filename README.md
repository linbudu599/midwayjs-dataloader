# MidwayJS & DataLoader

Guidance on [DataLoader](https://github.com/graphql/dataloader) integration with [MidwayJS](https://github.com/midwayjs/midway).

> **Note: All examples are created upon [TypeGraphQL](https://typegraphql.com/), for information about TypeGraphQL + MidwayJS, see [midway-examples: graphql](https://github.com/midwayjs/midway-examples/tree/master/v2/demo-graphql).**
>
> **Note: If you're also using Prisma2 in your application, no extra DataLoader setup is needed because since Prisma2, a [built-in DataLoader implemention](https://github.com/prisma/prisma/blob/2.24.x/src/packages/client/src/runtime/Dataloader.ts) was included.**

## Implementions

- [x] Register DataLoader instances with **Batch Loader Functions** by TypeGraphQL middleware, manually.
- [x] Register DataLoader instances with **Service(like TypeORM findByIds)** by TypeGraphQL middleware, manually.
  - Check [register-batchloader-manually](./src/lib/register-batchloader-manually.ts) for more details.

- [x] Register DataLoader instances with **TypeORM Relation Metadata** by TypeGraphQL middleware, automatically.
- [x] Register DataLoader instances with **TypeORM Relation Metadata** by TypeGraphQL middleware, automatically. ([type-graphql-dataloader](type-graphql-dataloader) under the hood.)
