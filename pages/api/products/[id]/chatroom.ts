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
  } = req;
  if (req.method === "GET") {
    const chatroom = await client.chatroom.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
        buyer: {
          select: {
            name: true,
            avatar: true,
          },
        },
        chat: {
          select: {
            id: true,
            chat: true,
            user: {
              select: {
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    res.json({ ok: true, chatroom });
  }
  if (req.method === "POST") {
    if (
      (await client.chatroom.findUnique({
        where: {
          id: +id.toString(),
        },
      })) !== null
    )
      return;
    const chatroom = await client.chatroom.create({
      data: {
        seller: {
          connect: {
            id: +id.toString(),
          },
        },
        buyer: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, chatroom });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
