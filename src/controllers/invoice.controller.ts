import { POST } from "src/@decorators/http.decorator";
import { Response, ResponseError } from "src/controllers";
import { ControllerData } from "src/@types"
import { Route } from "src/@decorators/utils.decorator";
import Axios from "axios";
import props from "src/properties";
import Callback from "src/models/callback";

@Route("invoice")
export default class InvoiceController {
    @POST()
    async createInvoice({ body, query }: ControllerData): Promise<Response> {
        if (!query.cb) throw new ResponseError(400, "You must provide callback url as a query parameter 'cb'")
        const invoiceResponse = await Axios.post(props.mongo.uri, {
            ...body,
            business_name: "Varscon",
        });
        if (invoiceResponse.status !== 201){
            return new Response(invoiceResponse.status, invoiceResponse.data);
        }

        const cb = new Callback({
            invoiceId: invoiceResponse.data.data.id,
            callback: query.cb,
        });
        await cb.save();
        return new Response(201, invoiceResponse.data);
    }
}