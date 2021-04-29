import { EntityModel } from '@midwayjs/orm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

import { PrimaryGeneratedColumn, Column, OneToOne, RelationId } from 'typeorm';

import User from './User.entity';

@ObjectType()
@EntityModel()
export default class Profile {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  profileId: number;

  @Column()
  @Field()
  description: string;

  @OneToOne(type => User, user => user.profile, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(type => User, { nullable: true })
  user: User;

  @RelationId((profile: Profile) => profile.user)
  @Field(() => Int)
  userId?: number;
}
