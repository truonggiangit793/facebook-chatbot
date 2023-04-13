import express from "express";
import path from "path";
import webhook from "@/api/webhook";
import index from "@/api/index";

export default function (app) {
    app.use("/", index);
    app.use("/logs", express.static(path.join(__dirname, "../", "logs")));
    app.use("/webhook", webhook);
}
