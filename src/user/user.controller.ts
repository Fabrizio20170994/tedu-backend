import { Body, Controller, Delete, Get, Param, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/entities/user.entity';
import { UpdateUserDTO } from '../auth/models/user.model';
import { User } from '../auth/user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}
    
    @Get()
    @UseGuards(AuthGuard())
    findCurrentUser(@User() { email } : UserEntity) {
        return this.userService.findByEmail(email);
    }

    @Put()
    @UseGuards(AuthGuard())
    update(@User() { email } : UserEntity, 
    @Body(new ValidationPipe({transform: true, whitelist: true})) data: UpdateUserDTO) {
        return this.userService.updateUser(email, data);
    }

    @Delete()
    @UseGuards(AuthGuard())
    delete(@User() { email } : UserEntity) {
        return this.userService.deleteUser(email);
    }

    @Get("/:id")
    findById(@Param('id') id: number) {
        return this.userService.findById(id);
    }
}
