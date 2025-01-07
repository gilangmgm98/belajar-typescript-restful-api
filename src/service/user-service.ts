import { v4 as uuid } from "uuid";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse, UpdateUserRequest, UpdateUserResponse, LogOutUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";


export class UserService {

    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        })

        if (totalUserWithSameUsername != 0) {
            throw new ResponseError(400, "username already registered")
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest
        });

        return toUserResponse(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if (!user) {
            throw new ResponseError(401, "wrong username or password")
        }

        const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordMatch) {
            throw new ResponseError(401, "wrong username or password")
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(user);
        response.token = user.token!;
        return response
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user)
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UpdateUserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        if (result) {
            return {
                success: true,
                message: "Update User Successfully"
            }
        }

        return {
            success: false,
            message: "Update User Unsuccessful"
        };
    }

    static async logOut(user: User): Promise<LogOutUserResponse> {
        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        if (result) {
            return {
                success: true,
                message: "User Logged Out Successfully"
            }
        }
        
        return {
            success: false,
            message: "User Log Out Unsuccessful"
        };
    }
}