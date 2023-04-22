import express from "express";
import cors from "cors";
import cron from "node-cron";
import { join } from "path";

import config from "./config/env";

import { router } from "./routes";
import {
    notFound,
    customErrorHandler,
} from "./middlewares/error_handlers.middleware";

import { deleteOtp } from "./services/auth.service";

const app = express();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", router);
app.use("/image", express.static(join(__dirname, "Storage")));

cron.schedule("* * * * *", async () => {
    await deleteOtp();
});

app.use(customErrorHandler);
app.use(notFound);

app.listen(config.PORT, () => console.log(`listening in port:${config.PORT}`));
