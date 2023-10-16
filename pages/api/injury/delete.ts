import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const reportId = req.body.reportId;

      const injury = await prisma.injuryDetail.deleteMany({
        where: {
          reportId: reportId,
        },
      });

      if (injury && injury.count > 0) {
        res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
