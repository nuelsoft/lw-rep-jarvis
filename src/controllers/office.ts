import {Route} from "../@decorators/utils.decorator";
import {POST} from "../@decorators/http.decorator";
import {ControllerData, Response, ResponseError} from "../@types";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import OfficeService, {IOffice} from "../models/office";

@Route("office")
export class OfficeController {

    @POST("create")
    @Is({validator: ValidationOption.isString, accessor: "slug"})
    @Is({validator: ValidationOption.isString, accessor: "title"})
    @Is({validator: ValidationOption.isArrayOfString, accessor: "invokable_by"})
    async add({body}: ControllerData): Promise<Response<IOffice>> {
        const {slug, title, invokable_by} = body;

        return Response.created({
            data: await OfficeService.save({
                slug: (slug as string).trim(),
                title: (title as string).trim(),
                invokable_by
            })
        })
    }

    @POST("/invokable")
    async invokable(): Promise<Response<Array<IOffice>>> {
        throw ResponseError.unImplemented();
    }

}