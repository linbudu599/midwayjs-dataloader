# MidwayJS & DataLoader

Guidance on DataLoader integration with MidwayJS.

> Note: All examples are created upon TypeGraphQL, for TypeGraphQL usage in MidwayJS application, see [midway-examples](https://github.com/midwayjs/midway-examples/tree/master/v2/demo-graphql).
>
> Note: If you're also using Prisma2 in your application, then no extra DataLoader setup is needed because since Prisma 2 a [built-in DataLoader implemention](https://github.com/prisma/prisma/blob/2.21.x/src/packages/client/src/runtime/Dataloader.ts) was included.

## Implementions

> TODO: AD/DISAD VANTAGES on each implemen

- [x] Register DataLoader instances with **Plain Functions** by TypeGraphQL middleware, manually.
- [x] Register DataLoader instances with **Service(TypeORM findByIds)** by TypeGraphQL middleware, manually.
- [ ] Register DataLoader instances with **TypeORM Relation Metadata** by TypeGraphQL middleware, automatically.
- [ ] Register DataLoader instances with **Provided batchLoadFn** by MidwayJS interceptors, with custom decorator.
- [ ] Register DataLoader instances with **TypeORM Relation Metadata** by TypeGraphQL middleware, automatically.