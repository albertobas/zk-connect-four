// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

export const config = {
  api: {
    externalResolver: true
  }
};

const { PROJECT_ID } = process.env;

export default async function handler(
  { body, method }: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // 1. ensure only POST requests are processed
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: 'Internal server configuration error' });
  }
  // 2. ensure API keys exist in environment
  else if (!PROJECT_ID) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server configuration error' });
  }
  // 3. if checks pass, proceed to forward the request
  else {
    try {
      const { data, status, statusText } = await axios.post(
        `https://sepolia.infura.io:443/v3/${process.env.PROJECT_ID}`,
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      res.status(StatusCodes.OK).json(data);
      // eslint-disable-next-line -- allow logs in server
      console.log(
        `Status: ${status}, ${statusText}. Method: ${body.method}. Network: Sepolia. Provider: Infura.`
      );
    } catch (error) {
      // 4. error handling
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json(error.response.data);
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal error' });
    }
  }
}
