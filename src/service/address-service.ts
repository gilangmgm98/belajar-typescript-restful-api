import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, toAddressResponse, UpdateAddressRequest } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { logger } from "../application/logging";
import { add } from "winston";



export class AddressService {

    static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const createRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExist(user.username, request.contactId);

        const address = await prismaClient.address.create({
            data: createRequest
        });

        return toAddressResponse(address);
    }

    static async checkAddressMustExist(contactId: number, addressId: number): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                id: addressId,
                contactId: contactId
            }
        })

        if (!address) {
            throw new ResponseError(404, "Address not found")
        }

        return address;
    }


    static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExist(user.username, request.contactId);

        const address = await this.checkAddressMustExist(getRequest.contactId, getRequest.id)

        return toAddressResponse(address);
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExist(user.username, request.contactId);

        await this.checkAddressMustExist(updateRequest.contactId, updateRequest.id)

        const address = await prismaClient.address.update({
            where: {
                id: updateRequest.id,
                contactId: updateRequest.contactId
            },
            data: updateRequest
        })

        return toAddressResponse(address);
    }

    static async remove( user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
        const removeRequest = Validation.validate(AddressValidation.GET, request)
        await ContactService.checkContactMustExist(user.username, request.contactId)
        await this.checkAddressMustExist(removeRequest.contactId, removeRequest.id)

        const address = await prismaClient.address.delete({
            where: {
                id: removeRequest.id
            }
        })

        return toAddressResponse(address)
    }
}