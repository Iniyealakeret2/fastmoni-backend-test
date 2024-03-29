import cors from "cors";
import express from "express";
import flow from "lodash/fp/flow";
import { createServer } from "http";
import helmet from "helmet";
import compress from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import methodOverride from "method-override";
import httpContext from "express-http-context";
import expressFormData from "express-form-data";
import EmailService from "./services/email.service";

import config from "./config";
import routes from "./routes";
import * as database from "./config/database";
import ErrorService from "./services/error.service";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 2 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//express application
const app = express();

const server = createServer(app);

flow([
  database.connect, // connect to database
  EmailService.init, // initialize email service
])();

// secure apps by setting various HTTP headers
app.use(helmet({ dnsPrefetchControl: false, frameguard: false, ieNoOpen: false }));

// Apply the rate limiting middleware to all requests
app.use(limiter);

// compress request data for easy transport
app.use(compress());
app.use(cookieParser());
app.use(methodOverride());

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(
  cors({
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);

// parse body params and attach them to res.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse form-data params and attach them to res.files && [req.fields]
app.use(expressFormData.parse());

app.set("trust proxy", 1);

// express context middleware
//@ts-ignore
app.use(httpContext.middleware);

// all API versions are mounted here within the app
app.use("/api/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(ErrorService.converter);

// catch 404 and forward to error handler
app.use(ErrorService.notFound);

// error handler, send stacktrace only during development
app.use(ErrorService.handler);

server.listen(config.PORT, () =>
  console.info(`local server started on port http://localhost:${config.PORT} (${config.NODE_ENV})`)
);
