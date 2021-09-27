import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { UpdateUserDTO } from '../auth/models/user.model';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}

    async findByEmail(id: number) {
        return this.userRepo.findOneOrFail( {where: {id}} );
    }

    async updateUser(id: number, data: UpdateUserDTO) {
        await this.userRepo.update({id}, data);
        return this.findByEmail(id);
    }

    async deleteUser(id: number) {
        await this.userRepo.delete({id});
        return { message : `Usuario con ID ${id} eliminado` }
    }

    async findById(id: number) {
        return this.userRepo.findOneOrFail( {where: {id}} );
    }
}
