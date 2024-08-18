import "module-alias/register";
import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import express, { Application } from "express";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { errorHandler } from "./middleware";
import routes from "./routes";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
