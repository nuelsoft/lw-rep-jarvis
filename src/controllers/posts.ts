import Post from "src/models/post";
import Like from "src/models/like";
import Reply from "src/models/reply";
import Media from "src/models/media";
import { Authorized } from "src/@decorators/authorized.decorator";
import { Middleware } from "src/@decorators/middleware.decorator";
import { DELETE, GET, POST, PUT } from "src/@decorators/http.decorator";
import { Response, ResponseError } from "src/controllers";
import { ControllerData, SortDirection } from "src/@types"
import { Paginated, Route } from "src/@decorators/utils.decorator";
import multer from "multer";

var upload = multer({dest: "uploads/media"});

@Route("api/v1/posts")
export default class PostController {

    @Middleware(upload.single("media"))
    @Authorized
    @POST()
    async createPost({ body, claims, file }: ControllerData): Promise<Response> {
        let media = null;
        if(file){
            media = new Media({
                location: file.filename,
                mimetype: file.mimetype,
            });
            await media.save();
        }
        const post = new Post({
            body: body.body,
            author: claims.id,
            media: media ? media.id : undefined,
        })
        await post.save().catch(e => {
            throw new ResponseError(400, e.message);
        });
        return new Response(201, {
            error: false,
            message: "Post was created successfully",
            data: post.toJSON()
        })
    }

    @Paginated({
        page: 1,
        limit: 20,
        sort: "createdAt",
        direction: SortDirection.DESC
    })
    @Authorized
    @GET()
    async getPosts({ claims, page }: ControllerData) {
        const posts = await Post.find({}, '', {
            sort: { [page.sort]: page.direction },
            skip: (page.page - 1) * page.limit,
            limit: page.limit
        });
        return new Response(200, {
            error: false,
            message: "Posts retrieved successfully",
            data: posts
        })
    }

    @Authorized
    @GET(":id")
    async getPost({ params }: ControllerData) {
        const post = await Post.findById(params.id);

        const repliesPromise = Reply.find({post: post.id});
        const likesPromise = Like.countDocuments({post: post.id});

        const [replies, likes] = await Promise.all([repliesPromise, likesPromise]);

        return new Response(200, {
            error: false,
            message: "Post retrieved successfully",
            data: {
                ...post.toJSON(),
                replies,
                likes,
            },
        })
    }

    @Authorized
    @PUT(":id")
    async updatePost({ body, params, claims }: ControllerData) {
        const updateOp = await Post.updateOne({ author: claims.id, _id: params.id }, { body: body.body, edited: true });
        if(updateOp.nModified < 1){
            throw new ResponseError(400, "You are not authorized to update this post");
        }
        return new Response(200, {
            error: false,
            message: "Post updated successfully",
            data: null,
        })
    }

    @Authorized
    @DELETE(":id")
    async deletePost({ params, claims }: ControllerData) {
        await Post.remove({ author: claims.id, _id: params.id });
        return new Response(200, {
            error: false,
            message: "Post removed successfully",
            data: null,
        })
    }

    @Authorized
    @POST(":id/like")
    async likePost({ params, claims }: ControllerData) {
        const like = await Like.findOne({ author: claims.id, post: params.id });

        if (like) {
            await Like.deleteOne({ author: claims.id, post: params.id })
            return new Response(200, {
                error: false,
                message: "Post unliked successfully",
                data: null,
            })
        } else {
            await Like.create({ author: claims.id, post: params.id })
            return new Response(200, {
                error: false,
                message: "Post liked successfully",
                data: null,
            })
        }
    }

    @Authorized
    @POST(":id/replies")
    async replyPost({ body, params, claims }: ControllerData) {
        const reply = new Reply({
            body: body.body,
            author: claims.id,
            post: params.id
        })
        await reply.save().catch(e => {
            throw new ResponseError(400, e.message);
        });
        return new Response(201, {
            error: false,
            message: "Reply has been added successfully",
            data: reply.toJSON()
        });
    }
}