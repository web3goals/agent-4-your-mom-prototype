import { mongoDBConfig } from "@/config/mongodb";
import { StoredMessage } from "@langchain/core/messages";
import { Collection, ObjectId } from "mongodb";
import clientPromise from "../client";
import { Agent } from "../models/agent";

export async function findAgent(id: ObjectId): Promise<Agent | null> {
  const collection = await getCollectionAgents();
  const tokenIdea = await collection.findOne({ _id: id });
  return tokenIdea;
}

export async function insertAgent(agent: Agent): Promise<ObjectId> {
  const collection = await getCollectionAgents();
  const insertOneResult = await collection.insertOne(agent);
  return insertOneResult.insertedId;
}

export async function updateAgent(params: {
  id: ObjectId;
  newMessages?: StoredMessage[];
}) {
  const collection = await getCollectionAgents();
  await collection.updateOne(
    { _id: params.id },
    {
      $set: {
        ...(params.newMessages && { messages: params.newMessages }),
      },
    }
  );
}

async function getCollectionAgents(): Promise<Collection<Agent>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Agent>(mongoDBConfig.collectionAgents);
}
