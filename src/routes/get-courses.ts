import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client";
import { courses } from "../database/schema";
import { ilike } from "drizzle-orm";
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/courses",
        {
            schema: {
                tags: ["courses"],
                summary: "Get all courses",
                queryString: z.object({
                    search: z.string().optional(),
                }),
                response: {
                    200: z.object({
                        courses: z.array(
                            z.object({
                                id: z.uuid(),
                                title: z.string(),
                            })
                        ),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { search } = request.query

            const result = await db
                .select({
                    id: courses.id,
                    title: courses.title,
                })
                .from(courses)
                .where(
                    search? ilike(courses.title, search) : undefined
                );

            return reply.send({ courses: result });
        }
    );
};
