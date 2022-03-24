import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Item from "../models/item";

const inventoryRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

inventoryRouter.get("/", async (req, res) => {
  try {
    const { maxPrice, prefix, limit } = req.query;
    const query: any = {
      ...(maxPrice ? { price: { $lte: parseInt(maxPrice as string) } } : {}),
      ...(prefix ? { product: new RegExp(`^${prefix}`, "i") } : {}),
    };
    const client = await getClient();
    const cursor = client.db().collection<Item>("inventory").find(query);
    if (limit) {
      cursor.limit(parseInt(limit as string));
    }
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

inventoryRouter.get("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>("inventory")
      .findOne({ _id: new ObjectId(id) });
    res.status(200);
    res.json(result);
  } catch (err) {
    errorResponse(err, res);
  }
});

inventoryRouter.post("/", async (req, res) => {
  try {
    const newItem: Item = req.body;
    const client = await getClient();
    client.db().collection<Item>(`inventory`).insertOne(newItem);
    res.status(201);
    res.json(newItem);
  } catch (err) {
    errorResponse(err, res);
  }
});

inventoryRouter.put("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const updatedItem: Item = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>("inventory")
      .replaceOne({ _id: new ObjectId(id) }, updatedItem);
    if (result.modifiedCount) {
      res.status(200);
      res.json(updatedItem);
    } else {
      res.status(404);
      res.send(`ID of ${id} not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

inventoryRouter.delete("/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Item>(`inventory`)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send(`ID of ${id} not found`);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default inventoryRouter;
