import fastify from "fastify";
import scalarAPIReference from "@scalar/fastify-api-reference";
import {
    validatorCompiler,
    serializerCompiler,
    type ZodTypeProvider,
    jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import { createCourseRoute } from "./src/routes/create-course.ts";
import { getCoursesRoute } from "./src/routes/get-courses.ts";
import { getCoursesByIdRoute } from "./src/routes/get-course-by-id.ts";

const server = fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === "development") {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Desafio Node.js",
                version: "1.0.0",
            },
        },
        transform: jsonSchemaTransform, // Integrando o Swagger com o Zod
    });

    server.register(scalarAPIReference, {
        routePrefix: "/docs",
        configuration: {
            theme: "deepSpace",
        },
    });
}

// Diferença entre Serialização e Validação:
// Validação é uma checagem nos dados de entrada
// Serialização é uma forma de converter os dados de saída (transformar os dados de saída de uma rota em outro formato)

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(createCourseRoute);
server.register(getCoursesRoute);
server.register(getCoursesByIdRoute);

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!");
});
