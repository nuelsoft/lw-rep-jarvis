import { POST } from "src/@decorators/http.decorator";
import { Response } from "src/controllers";
import { ControllerData } from "src/@types"
import { Route } from "src/@decorators/utils.decorator";
import Callback from "src/models/callback";
import Axios from "axios";

@Route("events")
export default class EventsController {
    @POST()
    async processEvent({ body }: ControllerData): Promise<Response> {
        if (body.event.type === "invoice:paid"){
            const cb = await Callback.findByInvoiceId(body.event.data.id);
            const eventResponse = await Axios.post(cb.callback, {...body});
            return new Response(eventResponse.status, null)
        }
        return new Response(200, null)
    }
}