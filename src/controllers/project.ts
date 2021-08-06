import {Route} from "../@decorators/utils.decorator";
import {GET, POST} from "../@decorators/http.decorator";
import {Middleware} from "../@decorators/middleware.decorator";
import {Authorizer, IsAdmin} from "../middlewares/authorizer";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import {ControllerData, Response, ResponseError} from "../@types";
import properties from "../utils/properties";
import ProjectService, {IProject} from "../models/project";

@Route("project")
export class ProjectController {

    @Middleware(IsAdmin)
    @Middleware(Authorizer)
    @POST("create")
    @Is({validator: ValidationOption.isNumber, accessor: "date"})
    @Is({validator: ValidationOption.isString, accessor: "title"})
    @Is({validator: ValidationOption.isString, accessor: "details"})
    async create({body, claims}: ControllerData): Promise<Response<IProject>> {
        const {date, title, details, banner} = body;
        if (Date.now() > date) throw ResponseError.badRequest("date can't be in the past");

        const e = await ProjectService.save({
            date, title: (title as string).trim(), details: (details as string).trim(),
            banner: banner ?? properties.banner.default,
            organization: claims.org.id
        });

        return Response.created({
            message: "Project created",
            data: e
        })
    }

    @Middleware(Authorizer)
    @GET("current")
    async listing({body, claims}: ControllerData): Promise<Response<IProject[]>> {

        return Response.ok({
            message: "Projects retrieved",
            data: await ProjectService.findForOrganizations([claims.org.id, ...claims.org.org_directory])
        })
    }

}