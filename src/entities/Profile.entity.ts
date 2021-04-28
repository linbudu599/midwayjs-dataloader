import { EntityModel } from '@midwayjs/orm';
import { ObjectType, Field, ID } from 'type-graphql';

import { PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

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
}
