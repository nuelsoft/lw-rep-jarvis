import {Route} from "../@decorators/utils.decorator";
import {POST} from "../@decorators/http.decorator";
import {ControllerData, Response, ResponseError} from "../@types";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import UserService, {IUser} from "../models/user";
import Hash from "../utils/hasher";
import Tokenizer from "../utils/tokenizer";

@Route("auth")
export default class AuthController {

    @POST("login")
    @Is({validator: ValidationOption.email})
    @Is({validator: ValidationOption.password})
    async login({body}: ControllerData): Promise<Response<AuthResponse>> {
        const {email, password} = body;

        const user = await UserService.findByEmail(email);
        if (!user) throw ResponseError.notFound("user with email not found");

        if (!Hash.compare(password, user.password))
            throw ResponseError.unAuthorized("incorrect password provided");

        user.password = undefined;

        return Response.ok({
            message: "Login successful",
            data: {
                user: user,
                access_token: Tokenizer.create(user.toJSON())
            }
        })

    }

    @POST("register")
    @Is({accessor: "full_name", validator: ValidationOption.isString})
    @Is({validator: ValidationOption.email})
    @Is({validator: ValidationOption.password})
    async register({body}: ControllerData): Promise<Response<AuthResponse>> {
        const {full_name, email, password} = body;
        const user = await UserService.findByEmail(email);

        if (user) throw ResponseError.badRequest("user with specified email already exists");

        const creation = await UserService.saveUser({
            email, password: Hash.create(password), full_name
        });

        return Response.created({
            message: "User successfully registered",
            data: {
                user: creation,
                access_token: Tokenizer.create(creation.toJSON())
            }
        });

    }

}

interface AuthResponse {
    user: IUser;
    access_token: string;
}