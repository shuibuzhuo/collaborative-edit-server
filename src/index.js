const Koa = require("koa");
const Router = require("koa-router");
const websocket = require("koa-easy-ws");
const { connect } = require("./db/client");
const { hocuspocusServer } = require("./hocuspocus");
require("dotenv").config();

const app = new Koa();

// setup your koa instance using the koa-easy-ws extension
app.use(websocket());

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "huashuiAI collab server";
});

router.get("/collaborate", async (ctx) => {
  const ws = await ctx.ws(); // retrieve socket

  hocuspocusServer.handleConnection(ws, ctx.request);
});

app.use(router.routes()).use(router.allowedMethods());

const port = parseInt(process.env.PORT) || 3000;
app.listen(port);

// connect to database
connect();
