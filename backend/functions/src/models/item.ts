import { ObjectId } from "mongodb";

export default interface Item {
  _id?: ObjectId;
  product: string;
  price: number;
  quantity: number;
}
