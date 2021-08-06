import * as e from "express"
import Tokenizer from "../utils/tokenizer";
import UserService from "../models/user";
import {IOrg} from "../models/org";

function reject(response: e.Response, message: string = "couldn't authorize request") {
    response.status(401).send({message})

}

export function IsAdmin(request: e.Request, response: e.Response, next: e.NextFunction) {
    if (!request.claims.is_admin)
        return response.status(401).send({message: "this route is restricted to only admins of organization"})

    return next();
}

export async function Authorizer(request: e.Request, response: e.Response, next: e.NextFunction) {

    const access_token = request.get("Authorization")?.replace("Bearer ", "");

    if (!access_token) return reject(response, "authorization not found in request header")

    const claims = Tokenizer.decode(access_token);

    if (!claims) return reject(response, "couldn't verify authorization token")

    const user = await UserService.findByID(claims.id);

    if (!user) return reject(response);

    request.claims = {
        id: user.id,
        org: user.organization as IOrg,
        user,
        is_admin: (user.organization as IOrg).admin === user.id
    }

    return next();
}