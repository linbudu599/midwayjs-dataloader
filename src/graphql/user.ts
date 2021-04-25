import { Field, ID, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class User {
  @Field(type => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(type => ID)
  partnerId?: number;

  @Field(type => User)
  partner?: User;

  @Field(type => [ID])
  petIds?: number[];

  @Field(types => [Pet])
  pets?: Pet[];
}

@ObjectType()
export class Pet {
  @Field(type => ID)
  id!: number;

  @Field()
  kind!: string;
}
