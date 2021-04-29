import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import connect from "next-connect";
import sessionValidator from "middleware/session-validator";
import { v4 as uuidv4 } from "uuid";

const handler = connect();

handler.use(sessionValidator).post(async (req, res, next) => {
  const prisma = new PrismaClient();
  const session = await getSession({ req });

  const supporter = await prisma.supporter.create({
    data: {
      id: uuidv4(),
      email: req.body.email,
      name: req.body.name,
      joinedAt: new Date(Date.now()).toISOString(),
      dosesPledged: 0,
      dosesFulfilled: 0,
    },
  });

  return res.status(200).json({ data: "ok" });
});

export default handler;
