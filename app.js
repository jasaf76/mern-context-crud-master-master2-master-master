import express from "express";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import AppError from './server/utils/appError.js';
import cors from 'cors';
import globalErrorHandler from "./server/controllers/errorController.js";
import nftsRouter from "./server/routes/nftsRoute.js";
import usersRouter from "./server/routes/usersRoute.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS
app.use(xss());
//PREVENT PARAMETER POLLUTION


app.use(
  hpp({
    whitelist: [
      "duration",
      "difficulty",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "price",
    ],
  })
);

//SET SECURITY HTTP HEADERS
app.use(helmet());
//File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);

//GLOBAL MIDDLEWARES
//LIMIT REQUEST FROM SAME API
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan("dev"));
// }

const limiter = rateLimit({
  max: 1000000000000000000000000000000000000000000000000000000000000000000000000000000,
  windowMs: 60 * 60 * 1000,
  message:
    "Zu viele Anfragen von dieser IP, bitte versuchen Sie es in einer Stunde erneut!",
});

app.use("/api", limiter);


//SERVING TEMPLATE DEMO


//app.use(express.static(`${__basedir}/nft-data/img`));
app.get('/analyze/:imageUrl', function (req, res) {
 console.log('printing image url:' + req.params.imageUrl);
})
//Custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("salio bien la cosa 🐶");
  //console.log(req.headers);
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//ROUTER NFTs

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);
///--ERROR SECTION
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Es kann nicht  ${req.originalUrl} gefunden werden von dieser Server`,
  // });
  next(
    new AppError(
      `Es kann nicht  ${req.originalUrl} gefunden werden von dieser Server`,
      404
    )
  );
});
///--Global error handel
app.use(globalErrorHandler);
export default app;
