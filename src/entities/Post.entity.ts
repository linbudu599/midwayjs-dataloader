import { EntityModel } from '@midwayjs/orm';
import { ObjectType, Field, ID } from 'type-graphql';

import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import User from './User.entity';

@ObjectType()
@EntityModel()
export default class Post {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  postId: number;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  content: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(type => User, { nullable: true })
  author: User;
}
