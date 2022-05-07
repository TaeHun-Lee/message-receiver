import { EntityRepository, Repository } from "typeorm";
import { Cafe } from "./register-cafe.entity";

@EntityRepository(Cafe)
export class RegisterCafeRepositry extends Repository<Cafe> {

}