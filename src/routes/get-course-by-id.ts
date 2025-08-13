import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client";
import { courses } from "../database/schema";
import z from "zod";
import { eq } from "drizzle-orm";

export const getCoursesByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/courses/:id",
        {
            schema: {
                params: z.object({
                    id: z.uuid(),
                }),
                tags: ["courses"],
                summary: "Get course by id",
                response: {
                    200: z.object({
                        courses: z.object({
                            id: z.uuid(),
                            title: z.string(),
                            description: z.string().nullable(),
                        }),
                    }),
                    404: z.null().describe("Course not found"),
                },
            },
        },
        async (request, reply) => {
            type Params = {
                id: string;
            };

            const params = request.params as Params;
            const courseId = params.id;

            const result = await db
                .select()
                .from(courses)
                .where(eq(courses.id, courseId));

            if (result.length) {
                return { courses: result[0] };
            }

            return reply.status(404).send();
        }
    );
};
