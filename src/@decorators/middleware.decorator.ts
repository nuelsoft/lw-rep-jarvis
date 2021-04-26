import "reflect-metadata";

export function Middleware(mw: Function): MethodDecorator {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        let middlewares = Reflect.getMetadata("middleware", target, propertyKey);
        if (middlewares){
            middlewares.push(mw);
        } else {
            middlewares = [mw];
        }
        Reflect.defineMetadata("middleware", middlewares, target, propertyKey);
    }
}