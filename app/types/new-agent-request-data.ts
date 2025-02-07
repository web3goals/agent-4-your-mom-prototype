export type NewAgentRequestData = {
  creator?: {
    id: string;
  };
  agent?: {
    name: string;
    description: string;
    emoji: string;
  };

  user?: {
    name: string;
    email: string;
    description: string;
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
