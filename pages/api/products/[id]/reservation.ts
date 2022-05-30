import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body,
  } = req;
  if (req.method === "POST") {
    const reservation = await client.reservation.create({
      data: {
        Rseller: {
          connect: {
            id: +id.toString(),
          },
        },
        Rbuyer: {
          connect: {
            id: user?.id,
          },
        },
        date: body.date + " " + body.time,
      },
    });

    if (reservation !== null) {
      await client.reservation.update({
        where: {
          id: +id.toString(),
        },
        data: {
          date: body.date + " " + body.time,
        },
      });
    }
    res.json({ ok: true, reservation });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
