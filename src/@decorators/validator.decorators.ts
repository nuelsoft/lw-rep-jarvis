import {ControllerData, ResponseError} from "../@types";
import {isValidObjectId} from "mongoose";

export enum ValidationOption {
    email = "email",
    password = "password",
    isString = "string",
    isNumber = "number",
    isArrayOfString = "array.string",
    isArrayOfNumber = "array.number",
    isObjectId = "object.id"
}

export function Is({validator, accessor}: {
    validator: ValidationOption,
    accessor?: string | number
}) {

    accessor = accessor ?? validator.valueOf();

    return function (target: Object, propertyKey: string | symbol, descriptor: any) {
        let o = descriptor.value;
        descriptor.value = function (...args: any[]) {

            const cd: ControllerData = args[0]
            if (!cd) throw Error("Controller data not found. Place controller data as first argument")
            Validator.validate(accessor.toString(), cd.body[accessor], validator)
            return o.apply(this, args);
        }
    }

}

class Validator {

    private static functions(key: string, operand: any, option: ValidationOption): void {
        switch (option) {
            case ValidationOption.email:
                return this.emailValidator(operand);
            case ValidationOption.password:
                return this.passwordValidator(operand);
            case ValidationOption.isString:
                return this.is(key, operand, 'string');
            case ValidationOption.isNumber:
                return this.is(key, operand, 'number');
            case ValidationOption.isArrayOfString:
                return this.isArrayOf(key, operand, 'string')
            case ValidationOption.isObjectId:
                return this.isObjectId(key, operand)

        }
    }

    static validate(key: string, data: any, option: ValidationOption) {
        this.functions(key, data, option);
    }

    private static emailValidator(email: string) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            throw ResponseError.badRequest("email is poorly formatted or not provided")
    }

    private static passwordValidator(password: string) {
        if (!password || password.length < 6 && password.length > 100)
            throw ResponseError.badRequest("password exist and be must be 6 - 100 characters")
    }

    private static is(key: string, value: any, type: string) {
        if (!value || typeof value != type)
            throw ResponseError.badRequest(`${key} must be a ${type}`);
    }

    private static isArrayOf(key: string, value: any, type: string) {
        if (!value || !Array.isArray(value) || (type && !value.every((e) => typeof type)))
            throw ResponseError.badRequest(`${key} must be provided and of type ${type}`);
    }

    private static isObjectId(key: string, value: any) {
        if (!value || !isValidObjectId(value))
            throw ResponseError.badRequest(`${key} must be provided and a valid object id`);
    }

}

