import {Route} from "../@decorators/utils.decorator";
import {GET, POST} from "../@decorators/http.decorator";
import {Middleware} from "../@decorators/middleware.decorator";
import {Authorizer, IsAdmin} from "../middlewares/authorizer";
import {Is, ValidationOption} from "../@decorators/validator.decorators";
import {ControllerData, Response, ResponseError} from "../@types";
import EventService, {IEvent} from "../models/event";
import properties from "../utils/properties";
import ProjectService from "../models/project";
import {IEventForm} from "../models/event.form";

@Route("event")
export class EventController {

    @Middleware(IsAdmin)
    @Middleware(Authorizer)
    @POST("create")
    @Is({validator: ValidationOption.isNumber, accessor: "date"})
    @Is({validator: ValidationOption.isString, accessor: "title"})
    @Is({validator: ValidationOption.isString, accessor: "details"})
    async create({body, claims}: ControllerData): Promise<Response<IEvent>> {
        const {date, title, details, banner} = body;
        if (Date.now() > date) throw ResponseError.badRequest("date can't be in the past");

        const e = await EventService.save({
            date, title: (title as string).trim(), details: (details as string).trim(),
            banner: banner ?? properties.banner.default,
            organization: claims.org.id
        });

        return Response.created({
            message: "Event created",
            data: e
        })
    }

    @Middleware(Authorizer)
    @GET("current")
    async listing({claims}: ControllerData): Promise<Response<IEvent[]>> {

        return Response.created({
            message: "Events retrieved",
            data: await EventService.findForOrganizations([claims.org.id, ...claims.org.org_directory])
        })
    }

    @Middleware(IsAdmin)
    @Middleware(Authorizer)
    @POST(":id/attach-project")
    @Is({validator: ValidationOption.isObjectId, accessor: "project"})
    async attachProject({body, params}: ControllerData): Promise<Response<IEvent>> {
        const {id} = params
        const event = await EventService.findById(id);
        if (!event) throw ResponseError.notFound("event not found");

        const {project} = body;
        const projectData = await ProjectService.findById(project);
        if (!projectData) throw ResponseError.notFound("project not found");

        event.project = projectData.id;
        projectData.event = event.id;

        await event.save();
        await projectData.save();

        return Response.ok({message: "Project attached", data: await EventService.findById(id)})
    }

    @Middleware(IsAdmin)
    @Middleware(Authorizer)
    @POST(":id/create-form")
    async createForm({body}: ControllerData) {

    }

    @GET("")
    async retrieveFormEntries() {

    }

}