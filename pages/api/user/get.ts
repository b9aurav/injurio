import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const userSub = req.body.id;

      // Check if the user exists in the database
      const user = await prisma.user.findUnique({
        where: { id: userSub },
      });

      if (user) {
        res.status(200).json({'found': true});
      } else {
        res.status(200).json({'found': false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
