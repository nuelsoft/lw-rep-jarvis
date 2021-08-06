import e from 'express';
import 'reflect-metadata';
import { HttpMethod } from '../@types';

export default class Loader {
    server: e.Express;

    constructor(server: e.Express) {
        this.server = server;
    }

    register(o: any) {
        const base = Reflect.getMetadata("path", o);
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(o));

        for (const prop of methods) {
            if (prop === 'constructor') continue;
            const path: string = Reflect.getMetadata("path", o, prop);
            const method: HttpMethod = Reflect.getMetadata("method", o, prop);
            const handler = Reflect.getMetadata("handler", o, prop);
            let mws = Reflect.getMetadata("middleware", o, prop);
            mws = mws || [];
            this.server[method](`/${base}${path ? `/${path}`: ""}`, ...mws, handler);
        }
    }
}
