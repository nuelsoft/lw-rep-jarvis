import Media from "src/models/media";
import { GET } from "src/@decorators/http.decorator";
import { MediaResponse } from "src/controllers";
import { ControllerData } from "src/@types"
import { Route } from "src/@decorators/utils.decorator";
import {readFileSync} from "fs";


@Route("media")
export default class MediaController {

    @GET(":id")
    async getMedia({ params }: ControllerData): Promise<MediaResponse> {
        const media = await Media.findById(params.id);
        
        const data = readFileSync(`uploads/media/${media.location}`);
        return new MediaResponse(media.mimetype, data);
    }
}