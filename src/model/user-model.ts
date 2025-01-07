import { User } from "@prisma/client";

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    password: string;
    name: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    name?: string;
    password?: string;
}
export type UpdateUserResponse = {
    success: boolean;
    message: string;
}

export type LogOutUserResponse = {
    success: boolean;
    message: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        username: user.username,
    }
}

