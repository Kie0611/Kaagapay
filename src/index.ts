import express from "express";
import { ENV } from "./config/env";

const app = express();

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});