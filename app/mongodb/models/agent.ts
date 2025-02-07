import { StoredMessage } from "@langchain/core/messages";
import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public creator: {
      id: string;
    },
    public createdDate: Date,
    public name: string,
    public description: string,
    public emoji: string,
    public chainId: number,
    public messages: StoredMessage[],
    public user: {
      name: string;
      email: string;
      description: string;
    },
    public privyServerWallet: {
      id: string;
      address: string;
      chainType: string;
    },
    public twitterAccount?: {
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    },
    public _id?: ObjectId
  ) {}
}
