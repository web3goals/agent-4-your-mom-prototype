import { StoredMessage } from "@langchain/core/messages";
import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public name: string,
    public description: string,
    public emoji: string,
    public messages: StoredMessage[],
    public privyServerWallet: {
      id: string;
      address: string;
      chainType: string;
    },
    public createdDate: Date,
    public twitterAccount?: {
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    },
    public _id?: ObjectId
  ) {}
}
