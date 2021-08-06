import {ControllerData, ResponseError} from "../@types";

export enum ValidationOption {email = "email", password = "password", isString = "string"}

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
                return this.isStringValidator(key, operand)

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

    private static isStringValidator(key: string, value: any) {
        if (!value || typeof value != 'string')
            throw ResponseError.badRequest(`${key} must be a string`);
    }

}

