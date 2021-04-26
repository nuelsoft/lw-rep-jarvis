import User from "src/models/user";
import { POST } from "src/@decorators/http.decorator";
import { Response, ResponseError } from "src/controllers";
import { AuthClaim, ControllerData } from "src/@types"
import * as Token from "src/utils/tokeniser"
import * as mailUtils from "src/utils/mail";
import * as randomUtils from "src/utils/random";
import client from "src/utils/redis";
import { Route } from "src/@decorators/utils.decorator";

@Route("api/v1")
export default class {
    @POST("login")
    async createUser({ body }: ControllerData): Promise<Response> {
        if (!body.email) {
            throw new ResponseError(400, "email must be provided");
        }

        if (!body.password) {
            throw new ResponseError(400, "password must be provided");
        }

        const user = await User.findByEmail(body.email);
        if (!user || !user.authenticate(body.password)) {
            throw new ResponseError(400, "email or password is incorrect");
        }
        const data = user.toJSON();

        const tok = Token.create<AuthClaim>({
            id: user._id,
            purpose: "authentication",
        })
        delete data.password;
        return new Response(200, {
            error: false,
            message: "User was created successfully",
            data,
            token: tok,
        })
    }

    @POST("auth/send-password-reset")
    async sendPasswordReset({ body }: ControllerData): Promise<Response> {
        if (!body.email) {
            throw new ResponseError(400, "email must be provided");
        }

        const user = await User.findByEmail(body.email);
        if (user) {
            let token = randomUtils.random6Digits();
            await client.setex(body.email, 300, token);
            mailUtils.sendMail({
                to: [user.email],
                subject: "Your 6-digit token is here",
                text: `If you requested a password reset then here is your 6-digit token: ${token}. If you don't recognize this activity then ignore this email`,
                html: `If you requested a password reset then here is your 6-digit token: ${token}. If you don't recognize this activity then ignore this email`,
            });
        }


        return new Response(200, {
            error: false,
            message: "A 6-digit token has been sent to the email associated with this account",
            data: null,
        })
    }

    @POST("auth/reset-password")
    async resetPassword({ body }: ControllerData): Promise<Response> {
        if (!body.email) {
            throw new ResponseError(400, "username must be provided");
        }

        if (!body.token) {
            throw new ResponseError(400, "token must be provided");
        }

        if (!body.password) {
            throw new ResponseError(400, "password must be provided");
        }

        const token = await client.get(body.email);

        if (token !== body.token) {
            throw new ResponseError(400, "Invalid password reset token");
        }

        const user = await User.findByEmail(body.email);
        user.password = body.password;

        await user.save().catch(e => {
            throw new ResponseError(400, e.message);
        });
        
        return new Response(200, {
            error: false,
            message: "User password was changed successfully",
            data: null
        })
    }
}