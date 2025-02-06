import { ActionProvider, CreateAction } from "@coinbase/agentkit";
import { TwitterApi, TwitterApiTokens } from "twitter-api-v2";
import { z } from "zod";
import { TwitterAccountDetailsSchema, TwitterPostTweetSchema } from "./schemas";

/**
 * Configuration options for the TwitterActionProvider.
 */
export interface TwitterActionProviderConfig {
  /**
   * Twitter API Key
   */
  apiKey?: string;

  /**
   * Twitter API Secret
   */
  apiSecret?: string;

  /**
   * Twitter Access Token
   */
  accessToken?: string;

  /**
   * Twitter Access Token Secret
   */
  accessTokenSecret?: string;
}

/**
 * TwitterActionProvider is an action provider for Twitter (X) interactions.
 *
 * @augments ActionProvider
 */
export class TwitterActionProvider extends ActionProvider {
  private readonly client: TwitterApi;

  /**
   * Constructor for the TwitterActionProvider class.
   *
   * @param config - The configuration options for the TwitterActionProvider
   */
  constructor(config: TwitterActionProviderConfig = {}) {
    super("twitter", []);

    if (!config.apiKey) {
      throw new Error("TWITTER_API_KEY is not configured.");
    }
    if (!config.apiSecret) {
      throw new Error("TWITTER_API_SECRET is not configured.");
    }
    if (!config.accessToken) {
      throw new Error("TWITTER_ACCESS_TOKEN is not configured.");
    }
    if (!config.accessTokenSecret) {
      throw new Error("TWITTER_ACCESS_TOKEN_SECRET is not configured.");
    }

    this.client = new TwitterApi({
      appKey: config.apiKey,
      appSecret: config.apiSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessTokenSecret,
    } as TwitterApiTokens);
  }

  /**
   * Get account details for the currently authenticated Twitter (X) user.
   *
   * @param _ - Empty parameter object (not used)
   * @returns A JSON string containing the account details or error message
   */
  @CreateAction({
    name: "account_details",
    description: `
This tool will return account details for the currently authenticated Twitter (X) user context.

A successful response will return a message with the api response as a json payload:
    {"data": {"id": "1853889445319331840", "name": "CDP AgentKit", "username": "CDPAgentKit"}}

A failure response will return a message with a Twitter API request error:
    Error retrieving authenticated user account: 429 Too Many Requests`,
    schema: TwitterAccountDetailsSchema,
  })
  async accountDetails(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: z.infer<typeof TwitterAccountDetailsSchema>
  ): Promise<string> {
    try {
      const response = await this.client.v2.me();
      response.data.url = `https://x.com/${response.data.username}`;
      return `Successfully retrieved authenticated user account details:\n${JSON.stringify(
        response
      )}`;
    } catch (error) {
      return `Error retrieving authenticated user account details: ${error}`;
    }
  }

  /**
   * Post a tweet on Twitter (X).
   *
   * @param args - The arguments containing the tweet text
   * @returns A JSON string containing the posted tweet details or error message
   */
  @CreateAction({
    name: "post_tweet",
    description: `
This tool will post a tweet on Twitter. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.`,
    schema: TwitterPostTweetSchema,
  })
  async postTweet(
    args: z.infer<typeof TwitterPostTweetSchema>
  ): Promise<string> {
    try {
      const response = await this.client.v2.tweet(args.tweet);
      return `Successfully posted to Twitter:\n${JSON.stringify(response)}`;
    } catch (error) {
      return `Error posting to Twitter:\n${error}`;
    }
  }

  /**
   * Checks if the action provider supports the given network.
   *
   * @returns True if the action provider supports the network, false otherwise.
   */
  supportsNetwork = () => {
    return true;
  };
}

/**
 * Factory function to create a new TwitterActionProvider instance.
 *
 * @param config - The configuration options for the TwitterActionProvider
 * @returns A new instance of TwitterActionProvider
 */
export const twitterActionProvider = (
  config: TwitterActionProviderConfig = {}
) => new TwitterActionProvider(config);
