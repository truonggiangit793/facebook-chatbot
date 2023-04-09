import express from "express";
const Router = express.Router();

Router.get("/", (req, res, next) => {
    return res.end("Hello world!");
});

export default Router;
