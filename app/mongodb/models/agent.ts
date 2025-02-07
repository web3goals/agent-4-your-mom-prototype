import { StoredMessage } from "@langchain/core/messages";
import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public creatorId: string,
    public createdDate: Date,
    public messages: StoredMessage[],
    public user: {
      name: string;
      email: string;
    },
    public personality: {
      name: string;
      emoji: string;
      features: string;
    },
    public chainId: number,
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
