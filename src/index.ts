import express from "express";
import cors from "cors";

import { ENV } from "./config/env";

import adminRoute from "./routes/adminRoutes";
import resourcesRoutes from "./routes/resourcesRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import submissionRoutes from "./routes/submissionRoutes";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
// `credentials: true` allows the frontend to send cookies to the backend so that we can authenticate the user
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); // parses form data (like HTML forms)

app.use("/api/admin", adminRoute);
app.use("/api/resources", resourcesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/submission", submissionRoutes);

app.listen(ENV.PORT, () => {
  console.log("Server is running at port:", ENV.PORT);
});