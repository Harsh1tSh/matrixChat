import * as sdk from 'matrix-js-sdk';

let client: sdk.MatrixClient | null = null;

export async function getMatrixClient(): Promise<sdk.MatrixClient> {
  if (typeof window !== 'undefined') {
    throw new Error('Matrix client should not be initialized on the client side');
  }

  if (!client) {
    try {
      console.log("Creating Matrix client...");
      console.log("User ID:", process.env.MATRIX_USER_ID);
      console.log("Access Token:", process.env.MATRIX_ACCESS_TOKEN ? "***" : "undefined");

      if (!process.env.MATRIX_USER_ID || !process.env.MATRIX_ACCESS_TOKEN) {
        throw new Error('Matrix credentials are not properly set in environment variables');
      }

      client = sdk.createClient({
        baseUrl: "https://matrix.org",
        userId: process.env.MATRIX_USER_ID,
        accessToken: process.env.MATRIX_ACCESS_TOKEN,
        timelineSupport: true,
      });
      console.log("Matrix client created successfully");
      
      console.log("Starting Matrix client...");
      await client.startClient({ initialSyncLimit: 10 });
      console.log("Matrix client started successfully");
    } catch (error) {
      console.error("Error creating or starting Matrix client:", error);
      throw error;
    }
  }

  if (!client) {
    throw new Error('Failed to initialize Matrix client');
  }

  return client;
}