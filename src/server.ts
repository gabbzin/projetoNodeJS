import server from "./app";

server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!");
});
