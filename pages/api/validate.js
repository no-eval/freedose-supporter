import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import Error from "next/error";
import connect from "next-connect";
import sessionValidator from "middleware/session-validator";

const handler = connect();

handler.use(sessionValidator).get(async (req, res, next) => {
  const session = getSession({ req });
  return res.status(200).json({ session: await session });
});

export default handler;
