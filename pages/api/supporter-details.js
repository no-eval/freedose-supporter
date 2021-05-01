import { PrismaClient } from "@prisma/client";
import sessionValidator from "middleware/session-validator";
import connect from "next-connect";
import { getSession } from "next-auth/client";

const handler = connect();

handler.use(sessionValidator).get(async (req, res, next) => {
  const prisma = new PrismaClient();
  const session = await getSession({ req });

  const details = await prisma.supporter.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      Match: {
        include: {
          participant: {
            select: {
              id: true,
              name: true,
              selfie: true,
              dosesRecieved: true,
              Vaccination: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json(details);
});

export default handler;
