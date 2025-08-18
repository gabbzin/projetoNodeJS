import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client";
import { courses, enrollments } from "../database/schema";
import { ilike, asc, and, SQL, eq, count } from "drizzle-orm"; // case-insensitive
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/courses",
        {
            schema: {
                tags: ["courses"],
                summary: "Get all courses",
                querystring: z.object({
                    search: z.string().optional(), // Filtração
                    orderBy: z.enum(["title"]).optional().default("title"), // Ordenação
                    page: z.coerce.number().optional().default(1),
                }),
                response: {
                    // Retorno da requisição
                    200: z.object({
                        courses: z.array(
                            z.object({
                                id: z.uuid(),
                                title: z.string(),
                                enrollments: z.number(),
                            })
                        ),
                        total: z.number(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { search, orderBy, page } = request.query;

            const conditions: SQL[] = [];

            if (search) {
                conditions.push(ilike(courses.title, `%${search}%`));
            }

            const limitPage = 10

            const [result, total] = await Promise.all([
                // Executa as duas juntas
                db
                    .select({
                        id: courses.id,
                        title: courses.title,
                        enrollments: count(enrollments.courseId),
                    })
                    .from(courses)
                    .leftJoin(
                        enrollments,
                        eq(enrollments.courseId, courses.id)
                    )
                    .orderBy(asc(courses[orderBy]))
                    .offset((page - 1) * limitPage)
                    .limit(limitPage)
                    .where(and(...conditions))
                    .groupBy(courses.id),

                db.$count(
                    courses,
                    and(...conditions) // Passa todo o array de condições (validando todas)
                ),
            ]);

            return reply.send({ courses: result, total });
        }
    );
};
