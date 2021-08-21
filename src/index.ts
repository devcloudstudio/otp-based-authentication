import express, { Application, Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import { config as dotenv } from "dotenv";

dotenv();

const app: Application = express();
const PORT = 5000;

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.get('/', (_, res) => {
  res.status(200).json({
    type: 'success',
    message: 'server is up running',
    data: null
  })
})

app.use("/api/auth", authRoutes);

// page not found error
app.use("*", (_, __, next) => {
  const error = {
    status: 404,
    message: "API_END_POINT_NOT_FOUND",
  };
  next(error);
});

// global error handling middleware
app.use((err: any, _: Request, res: Response, next: NextFunction) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "SERVER_ERR";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log("DB connected");
    app.listen(PORT, () => console.log("server started"));
  } catch (err) {
    console.error.bind(console, "Error");
    process.exit(1);
  }
}

main();
