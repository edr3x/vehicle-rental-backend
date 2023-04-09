import express from "express";
import cors from "cors";

import config from "./config/env";

import { router } from "./routes";
import {
    notFound,
    customErrorHandler,
} from "./middlewares/error_handlers.middleware";

const app = express();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", router);
app.use(customErrorHandler);
app.use(notFound);

app.listen(config.PORT, () => console.log(`listening in port:${config.PORT}`));
