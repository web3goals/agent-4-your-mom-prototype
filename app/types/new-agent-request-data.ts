export type NewAgentRequestData = {
  creatorId?: string;
  user?: {
    name: string;
    email: string;
  };
  personality?: {
    name: string;
    emoji: string;
    features: string;
  };
  chain?: {
    id: number;
    usdtAddress: string;
  };
  addressBook?: { name: string; address: string }[];
  twitter?: {
    apiKey: string | undefined;
    apiSecret: string | undefined;
    accessToken: string | undefined;
    accessTokenSecret: string | undefined;
  };
};
