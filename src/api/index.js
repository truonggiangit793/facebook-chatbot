import express from "express";
const Router = express.Router();

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

Router.get("/test/:message", async (req, res, next) => {});

export default Router;
