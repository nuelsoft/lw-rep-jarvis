import e from "express";

export enum HttpMethod {
    GET = "get",
    POST = "post",
    DELETE = "delete",
    PUT = "put",
}

export interface AuthClaim {
    id: string;
    purpose: string;
}

export interface ControllerData {
    body: {[key: string]: any};
    params: {[key: string]: any};
    query: {[key: string]: any};
    headers: {[key: string]: any};
    claims?: AuthClaim;
    response?: e.Response;
    page?: PageParams;
    file?: any;
    files?: Array<any>;
}

export enum SortDirection {
    ASC = 1,
    DESC = -1
}

export interface PageParams {
    page?: number,
    limit?: number,
    sort?: string,
    direction?: SortDirection,
}
