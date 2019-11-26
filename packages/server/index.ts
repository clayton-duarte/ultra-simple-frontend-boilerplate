import express from "express";
import next from "next";

import v1 from "./v1/routes";

const { HTTP_PORT = 3000 } = process.env;
// Configurations to tell Next.js to run on development or production mode
const isDevelopment = process.env.NODE_ENV !== "production";
const clientDir = isDevelopment ? "packages/client" : "dist";

const app = next({ dev: isDevelopment, dir: clientDir });
const clientHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Inject any middlewares you need on express
  // server.use(middleware);

  // Define your BFF routes
  server.use("/ping", v1());
  server.use("/v1", v1());

  // Let everything else fallback to client application
  // Next.js takes care of 404s
  server.all("*", (req, res) => {
    return clientHandler(req, res);
  });

  // Start as only a single application
  server.listen(HTTP_PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${HTTP_PORT}`);
  });
});
