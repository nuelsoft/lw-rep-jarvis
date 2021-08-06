import {Route} from "../@decorators/utils.decorator";
import {POST} from "../@decorators/http.decorator";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import {ControllerData, Response, ResponseError} from "../@types";
import UserService from "../models/user";
import OrgService, {IOrg} from "../models/org";
import OfficeService from "../models/office";
import {Middleware} from "../@decorators/middleware.decorator";
import {Authorizer, IsAdmin} from "../middlewares/authorizer";

@Route("org")
export class OrgController {

    @Middleware(IsAdmin)
    @Middleware(Authorizer)
    @POST("create")
    @Is({validator: ValidationOption.isString, accessor: 'name'})
    @Is({validator: ValidationOption.email, accessor: 'admin_email'})
    @Is({validator: ValidationOption.isString, accessor: 'office'})
    async start({body, claims}: ControllerData): Promise<Response<IOrg>> {

        const {name, admin_email, office} = body;

        const admin = await UserService.findByEmail(admin_email);
        if (!admin) throw ResponseError.notFound("couldn't user with specified email")

        const officeData = await OfficeService.findBySlug(office);
        if (!officeData) throw ResponseError.notFound("couldn't find office for org")

        const org = await OrgService.save({
            admin: admin.id,
            org_directory: [claims.org.id, ...claims.org.org_directory],
            office,
            name
        })

        admin.organization = org.id;
        await admin.save()

        return Response.created({
            message: "organization created",
            data: org
        });


    }

}