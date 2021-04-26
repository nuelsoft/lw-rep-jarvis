import User from "src/models/user";
import { POST } from "src/@decorators/http.decorator";
import { Response, ResponseError } from "src/controllers";
import { ControllerData } from "src/@types"
import * as mailUtils from "src/utils/mail";
import { Route } from "src/@decorators/utils.decorator";

@Route("api/v1/users")
export default class {
    @POST()
    async createUser({ body }: ControllerData): Promise<Response> {
        if (!body.password || body.password.length < 8) {
            throw new ResponseError(400, "Invalid password: must contain more than 8 characters");
        }
        const user = new User({
            email: body.email,
            password: body.password,
        })
        await user.save().catch(e => {
            throw new ResponseError(400, e.message);
        });
        mailUtils.sendMail({
            to: [user.email],
            subject: "Welcome to Utopia",
            text: "You are welcome to Utopia! We have a great and inspiring user base plus a vast cultural diaspora for you to choose from! Login to start connecting",
            html: "You are welcome to Utopia! We have a great and inspiring user base plus a vast cultural diaspora for you to choose from! Login to start connecting",
        });
        const data = user.toJSON();
        delete data.password;
        return new Response(201, {
            error: false,
            message: "User was created successfully",
            data: user
        })
    }
}