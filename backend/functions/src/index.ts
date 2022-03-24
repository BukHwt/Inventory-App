import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import inventoryRouter from "./routes/inventoryRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/inventory", inventoryRouter);
export const api = functions.https.onRequest(app);
