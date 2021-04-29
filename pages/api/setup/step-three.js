import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import connect from "next-connect";
import sessionValidator from "middleware/session-validator";

const handler = connect();

handler.use(sessionValidator).post(async (req, res, next) => {
  const prisma = new PrismaClient();
  const session = await getSession({ req });
  const email = session.user.email;

  const updatePledges = await prisma.supporter.update({
    where: {
      email: email,
    },
    data: {
      dosesPledged: req.body.dosesPledged,
    },
  });
  // const rawSql = await prisma.$executeRaw`UPDATE "Supporter" SET "selfie" = decode(${selfie}, 'string') WHERE email = ${email}`;
  return res.status(200).json(supporter);
});

export default handler;
