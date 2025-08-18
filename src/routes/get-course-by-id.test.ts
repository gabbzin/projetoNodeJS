import { test, expect } from "vitest";
import request from "supertest";
import server from "../app.ts";
import { faker } from "@faker-js/faker";
import { makeCourse } from "../tests/factories/make-course.ts";
import { randomUUID } from "node:crypto";

test("Get course by id", async () => {
    await server.ready(); // Espera preparar o servidor

    const course = await makeCourse(); // Cria um curso antes de testar a rota

    const response = await request(server.server).get(`/courses/${course.id}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
        courses: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        },
    });
});

test("return 404 for non existing courses", async () => {
    await server.ready(); // Espera preparar o servidor

    const uuid = randomUUID();

    const response = await request(server.server).get(`/courses/${uuid}`);

    expect(response.status).toEqual(404);
});
