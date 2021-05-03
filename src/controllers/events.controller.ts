import { POST } from "src/@decorators/http.decorator";
import { Response } from "src/controllers";
import { ControllerData } from "src/@types"
import * as mailUtils from "src/utils/mail";
import { Route } from "src/@decorators/utils.decorator";

@Route("events")
export default class EventsController {
    @POST()
    async createUser({ body }: ControllerData): Promise<Response> {
        console.log(body.event.type)
        if (body.event.type === "invoice:paid"){
            const {amount, currency} = body.event.data.local_price;
            mailUtils.sendMail({
                to: ["benjamincath@gmail.com"],
                subject: "New Deposit",
                text: `New Deposit of ${currency} ${amount}`,
                html: `New Deposit of ${currency} ${amount}`,
            });
        }
        return new Response(200, null)
    }
}