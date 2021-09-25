import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginDTO, RegisterDTO } from './models/user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    async register(credentials: RegisterDTO) {
        try {
            const user = this.userRepo.create(credentials);
            await user.save();
            const payload = {email: user.email};
            const token = this.jwtService.sign(payload);
            return { user: {...user.toJson(), token} };
        }
        catch(err) {
            if (err.code === '23505') {
                throw new ConflictException('El correo ingresado ya ha sido registrado anteriormente')
            }
            throw new InternalServerErrorException();
        }
    }

    async login({email, password} : LoginDTO) {
            const user = await this.userRepo.findOneOrFail({ where: { email } })
            if (!user.comparePassword(password)) {
                throw new UnauthorizedException('Credenciales inválidas')
            }
            const payload = {email: user.email};
            const token = this.jwtService.sign(payload);
            return { user: {...user.toJson(), token} };        
    }
}
