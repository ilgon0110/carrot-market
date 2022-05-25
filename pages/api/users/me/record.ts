import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { Kind } from "@prisma/client";

interface reqKind {
  kind: Kind;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  const { kind } = req.query as unknown as reqKind;
  console.log(kind);
  const records = await client.record.findMany({
    where: {
      userId: user?.id,
      kind: kind,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    records,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
