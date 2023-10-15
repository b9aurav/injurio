import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const reportId = req.body.reportId;
      
      const report = await prisma.injuryReport.delete({
        where: {
          id: reportId
        }
      })

      if (report) {
        res.status(200).json({id: report.id});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
