import { StoredMessage } from "@langchain/core/messages";
import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public name: string,
    public messages: StoredMessage[],
    public privyServerWallet: {
      id: string;
      address: string;
      chainType: string;
    },
    public createdDate: Date,
    public _id?: ObjectId
  ) {}
}
