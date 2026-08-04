"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const PORT = env_1.ENV.PORT;
app.listen(PORT, () => {
    console.log("Server is running at port:", PORT);
});
