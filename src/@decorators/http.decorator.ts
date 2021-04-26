import e from "express";
import { MediaResponse, Redirect, ResponseError } from "src/controllers";
import { ControllerData, HttpMethod } from "src/@types";

import "reflect-metadata";


function methodHandler(route: string, method: HttpMethod): MethodDecorator {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ) {
        const handler = async function (req: e.Request, res: e.Response) {
            try {
                const data = await descriptor.value({
                    body: req.body,
                    query: req.query,
                    headers: req.headers,
                    params: req.params,
                    file: req.file,
                    files: req.files,
                    response: res,
                } as ControllerData);
                if (data instanceof Redirect) {
                    return res.redirect(data.route)
                }
                if (data instanceof MediaResponse) {
                    res.set("Content-Type", data.mime);
                    return res.send(data.data);
                }
                res.status(data.status).send(data.message);
            } catch (e) {
                if (e instanceof ResponseError) {
                    return res.status(e.status).send({ message: e.message });
                }
                return res.status(500).send({ message: e.message });
            }
        }
        Reflect.defineMetadata("path", route, target, propertyKey);
        Reflect.defineMetadata("method", method, target, propertyKey);
        Reflect.defineMetadata("handler", handler, target, propertyKey);
    }
}

export const GET = (route: string = "") => methodHandler(route, HttpMethod.GET);
export const POST = (route: string = "") => methodHandler(route, HttpMethod.POST);
export const DELETE = (route: string = "") => methodHandler(route, HttpMethod.DELETE);
export const PUT = (route: string = "") => methodHandler(route, HttpMethod.PUT);