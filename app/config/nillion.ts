export const nillionConfig = {
  orgSecretKey: process.env.NILLION_ORG_SECRET_KEY as string,
  orgDid: process.env.NILLION_ORG_DID as string,
  nodes: [
    {
      name: process.env.NILLION_NODE_A_NAME as string,
      url: process.env.NILLION_NODE_A_URL as string,
      did: process.env.NILLION_NODE_A_DID as string,
      jwt: process.env.NILLION_NODE_A_JWT as string,
    },
    {
      name: process.env.NILLION_NODE_B_NAME as string,
      url: process.env.NILLION_NODE_B_URL as string,
      did: process.env.NILLION_NODE_B_DID as string,
      jwt: process.env.NILLION_NODE_B_JWT as string,
    },
    {
      name: process.env.NILLION_NODE_C_NAME as string,
      url: process.env.NILLION_NODE_C_URL as string,
      did: process.env.NILLION_NODE_C_DID as string,
      jwt: process.env.NILLION_NODE_C_JWT as string,
    },
  ],
  schemaCredentialsId: process.env.NILLION_SCHEMA_CREDENTIALS_ID as string,
};
