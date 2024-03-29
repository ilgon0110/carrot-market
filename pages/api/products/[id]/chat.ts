import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { RKind } from "@prisma/client";

interface reqKind {
  kind: RKind;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  const { kind } = req.query as unknown as reqKind;
  const chat = await client.chat.create({
    data: {
      chat: body.chat,
      product: {
        connect: {
          id: +id.toString(),
        },
      },
      chatroom: {
        connect: {
          id: +id.toString(),
        },
      },
      kind,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.json({ ok: true, chat });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
