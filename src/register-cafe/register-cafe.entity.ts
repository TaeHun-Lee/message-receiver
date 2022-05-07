import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Cafe {
  @PrimaryColumn()
  cafeName: string;

  @Column()
  menu: string;

  @Column()
  lastUpdated: Date;
}