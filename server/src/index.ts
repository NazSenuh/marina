import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
const MemoryStore = require('memorystore')(session)

import { setStrategy } from "./config/passport";
import { AppRouter } from "./api/api.router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

const dbUrl = process.env.MONGO_DB_URL || "";
const prodDbUrl = process.env.CUSTOMER_MONGO_URL || "";

const router = new AppRouter(app);

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET || "",
    store: new MemoryStore({
      checkPeriod: 86400000 
    }),
      cookie:{
          secure: true,
          maxAge:60000
      },
      saveUninitialized: true,
      resave: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
setStrategy(passport);

router.init();



async function bootstrap() {
  try {
    await mongoose.connect(prodDbUrl);
    app.listen(port, () => {
      console.log(`[server]: Server start in port:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

bootstrap();
