// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: {
    externalResolver: true
  }
};

export default function handler(
  { body }: NextApiRequest,
  res: NextApiResponse
): void {
  const { jsonrpc, method, id, params } = body;

  const options = {
    url: `https://sepolia.infura.io:443/v3/${process.env.PROJECT_ID}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: { jsonrpc, method, id, params }
  };

  axios(options)
    .then(({ status, statusText, data }) => {
      // eslint-disable-next-line -- allow logs in server
      console.log(
        `Status: ${status}, ${statusText}. Method: ${method}. Network: Sepolia. Provider: Infura.`
      );
      res.status(status).send(data);
    })
    .catch((error) => {
      console.error(error);
      if (error.response) {
        const { status, data } = error.response;
        // eslint-disable-next-line -- allow assigning argument of type any
        res.status(status).send(data);
      } else {
        res.status(500).send({});
      }
    });
}
