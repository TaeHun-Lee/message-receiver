import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class CafeMenu {
  @Generated('increment')
  id: number;

  @PrimaryColumn()
  cafeName: string;

  @Column()
  menu: string;

  @Column()
  lastVisited: Date;
}