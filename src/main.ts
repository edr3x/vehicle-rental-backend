import express from "express";
import cors from "cors";

import config from "./config/env";

import { router } from "./routes";
import {
    notFound,
    customErrorHandler,
} from "./middlewares/error_handlers.middleware";

import { logger } from "./utils/logger";

const app = express();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", router);
app.use(customErrorHandler);
app.use(notFound);

const port = config.PORT;
app.listen(port, () => logger.info(`listening in port:${port}`));
