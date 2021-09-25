import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { AuthPayload } from "./models/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
            secretOrKey: process.env.SECRET,
        })
    }
    async validate(payload: AuthPayload) {
        const { email } = payload;
        const user = this.userRepo.find( { where: { email }});
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}