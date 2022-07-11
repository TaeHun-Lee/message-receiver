import { EntityRepository, Repository } from 'typeorm';
import { Cafe } from './cafe-menu.entity';

@EntityRepository(Cafe)
export class CafeMenuRepository extends Repository<Cafe> {}
