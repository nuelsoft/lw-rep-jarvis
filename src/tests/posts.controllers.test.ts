import request from "supertest";

import "src/loader";

import server, { connection } from "src/server";

describe("Posts", () => {
    it("should create post", async () => {
        const authToken = await request(server)
            .post("/api/v1/login")
            .send({
                email: "benjamincath@gmail.com",
                password: "mmmmmmmm"
            }).then(response => response.body.token);

        const createPostResponse = await request(server)
            .post("/api/v1/posts")
            .send({
                body: "This is a fresh new post",
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(createPostResponse.status).toBe(201);
    })
    it("should get posts", async () => {
        const authToken = await request(server)
            .post("/api/v1/login")
            .send({
                email: "benjamincath@gmail.com",
                password: "mmmmmmmm"
            }).then(response => response.body.token);

        const getPostsResponse = await request(server)
            .get("/api/v1/posts")
            .set("Authorization", `Bearer ${authToken}`);

        expect(getPostsResponse.status).toBe(200);
    })
    it("should get post by id", async () => {
        const authToken = await request(server)
            .post("/api/v1/login")
            .send({
                email: "benjamincath@gmail.com",
                password: "mmmmmmmm"
            }).then(response => response.body.token);

        const createPostResponse = await request(server)
            .post("/api/v1/posts")
            .send({
                body: "Test lorem ipsum post",
            })
            .set("Authorization", `Bearer ${authToken}`);
        const getPostResponse = await request(server)
            .get(`/api/v1/posts/${createPostResponse.body.data._id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(getPostResponse.status).toBe(200);
    })
    it("should reply to post", async () => {
        const authToken = await request(server)
            .post("/api/v1/login")
            .send({
                email: "benjamincath@gmail.com",
                password: "mmmmmmmm"
            }).then(response => response.body.token);

        const ticketResponse = await request(server)
            .post("/api/v1/posts")
            .send({
                body: "Test lorem ipsum post #2",
            })
            .set("Authorization", `Bearer ${authToken}`);

        const createReplyResponse = await request(server)
            .post(`/api/v1/posts/${ticketResponse.body.data._id}/replies`)
            .send({
                body: "Is that Latin?"
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(createReplyResponse.status).toBe(201);
    })

    it("should like post and unlike post", async () => {
        const authToken = await request(server)
            .post("/api/v1/login")
            .send({
                email: "benjamincath@gmail.com",
                password: "mmmmmmmm"
            }).then(response => response.body.token);

        const createPostResponse = await request(server)
            .post("/api/v1/posts")
            .send({
                body: "Test lorem ipsum post #2",
            })
            .set("Authorization", `Bearer ${authToken}`);

        const likePostResponse = await request(server)
            .post(`/api/v1/posts/${createPostResponse.body.data._id}/like`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(likePostResponse.status).toBe(200);

        let getPostResponse = await request(server)
            .get(`/api/v1/posts/${createPostResponse.body.data._id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(getPostResponse.status).toBe(200);
        expect(getPostResponse.body.data.likes).toBe(1);

        const unlikePostResponse = await request(server)
            .post(`/api/v1/posts/${createPostResponse.body.data._id}/like`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(unlikePostResponse.status).toBe(200);

        getPostResponse = await request(server)
            .get(`/api/v1/posts/${createPostResponse.body.data._id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(getPostResponse.status).toBe(200);
        expect(getPostResponse.body.data.likes).toBe(0);
    })
})

afterAll(async (done) => {
    connection.close();
    done();
});