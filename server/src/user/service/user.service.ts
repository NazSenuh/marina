import bcrypt from 'bcrypt'

import { CreateUserDto } from "../dto/create-user.dto";
import {  UserModel } from "../model/user.model";
import { IUser } from '../types';
import { CustomError } from '../../common/error';

class UserService {

    public async createUser(dto: CreateUserDto) {
        const candidate = await UserModel.findOne({ email: dto.email })
        if(candidate){
            throw new CustomError('this name is already taken', 400)
        }
        const hashedPassword = await bcrypt.hash(dto.password, 7)
        const user = await UserModel.create({ ...dto, password: hashedPassword})
        return user
    }

    public async getAll() {
        return UserModel.find()
    }

    public async getUser(data: Partial<IUser>) {
         const user = UserModel.findOne(data)
         return user
    }
    public async getUserById(id: string) {
        return UserModel.findById(id)
    }

    public async upadateUser(id: string,  data: Partial<IUser>) {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    }
}
export default new UserService()
