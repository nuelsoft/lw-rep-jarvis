import {Route} from "../@decorators/utils.decorator";
import {GET, POST} from "../@decorators/http.decorator";
import {ControllerData, Response, ResponseError} from "../@types";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import UserService, {IUser} from "../models/user";
import Hash from "../utils/hasher";
import Tokenizer from "../utils/tokenizer";
import {Middleware} from "../@decorators/middleware.decorator";
import {Authorizer} from "../middlewares/authorizer";
import OrgService from "../models/org";

@Route("auth")
export class AuthController {

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
                access_token: Tokenizer.create({id: user.id})
            }
        })

    }

    @POST("register")
    @Is({accessor: "full_name", validator: ValidationOption.isString})
    @Is({validator: ValidationOption.email})
    @Is({validator: ValidationOption.password})
    @Is({validator: ValidationOption.isObjectId, accessor: "organization"})
    async register({body}: ControllerData): Promise<Response<AuthResponse>> {
        const {full_name, organization, email, password} = body;
        const user = await UserService.findByEmail(email);

        if (user) throw ResponseError.badRequest("User already exists. Choose another email");

        const org = await OrgService.findById(organization);
        if (!org || org.office != "church")
            throw ResponseError.badRequest("Church wasn't found")

        const creation = await UserService.save({
            email: (email as string).trim(),
            password: Hash.create(password),
            full_name: (full_name as string).trim(),
            organization
        });

        return Response.created({
            message: "User successfully registered",
            data: {
                user: creation,
                access_token: Tokenizer.create({id: creation.id})
            }
        });

    }

    @Middleware(Authorizer)
    @GET("account")
    async account({claims}: ControllerData): Promise<Response<AuthResponse>> {
        return Response.ok({
            message: "Account retrieved",
            data: {
                user: <IUser>{...claims.user.toJSON(), password: undefined},
                access_token: undefined
            }
        })
    }

}

interface AuthResponse {
    user: IUser;
    access_token: string | undefined | null;
}