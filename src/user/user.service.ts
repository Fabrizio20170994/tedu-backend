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

    async findByEmail(email: string) {
        return this.userRepo.findOne( {where: {email}} );
    }

    async updateUser(email: string, data: UpdateUserDTO) {
        await this.userRepo.update({email}, data);
        return this.findByEmail(email);
    }

    async deleteUser(email: string) {
        await this.userRepo.delete({email});
        return { message : `Usuario ${email} eliminado` }
    }

    async findById(id: number) {
        const user = await this.userRepo.findOne( {where: {id}} );
        if (!user) {
            throw new NotFoundException(`No se concontró al usuario con ID ${id}`)
        }
        return user;
    }
}
