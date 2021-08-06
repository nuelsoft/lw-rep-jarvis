interface ResponseData<T> {
    data: T,
    message?: any | undefined
}

export class Response<T> {

    static ok<T>(r: ResponseData<T>) {
        return new Response<T>(200, r.message, r.data);
    }

    static created<T>(r: ResponseData<T>) {
        return new Response<T>(200, r.message, r.data);
    }

    status: number;
    message: any;
    data: T;

    constructor(status: number, message: any, data: T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export class MediaResponse {
    mime: string;
    data: Buffer;

    constructor(mime: string, data: Buffer) {
        this.mime = mime;
        this.data = data;
    }
}

export class Redirect {
    route: string;

    constructor(route: string) {
        this.route = route;
    }
}

export class ResponseError extends Error {

    static unAuthorized(message: string) {
        return new ResponseError(401, message);
    }

    static badRequest(message: string) {
        return new ResponseError(401, message);
    }

    static notFound(message: string) {
        return new ResponseError(404, message);
    }

    static serverError(message: string) {
        return new ResponseError(500, message);
    }

    static unImplemented(message: string) {
        return new ResponseError(501, message);
    }

    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
