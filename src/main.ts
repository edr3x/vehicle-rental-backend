import express from "express";
import cors from "cors";
import { join } from "path";

import config from "./config/env";

import { router } from "./routes";
import {
    notFound,
    customErrorHandler,
} from "./middlewares/error_handlers.middleware";
import { isLoggedIn } from "./middlewares/auth.middleware";

const app = express();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", router);
app.use("/image", isLoggedIn, express.static(join(__dirname, "Storage")));
app.use(customErrorHandler);
app.use(notFound);

app.listen(config.PORT, () => console.log(`listening in port:${config.PORT}`));
