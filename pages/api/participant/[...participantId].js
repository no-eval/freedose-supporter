import { PrismaClient } from "@prisma/client";
import sessionValidator from "middleware/session-validator";
import connect from "next-connect";
import { getSession, session } from "next-auth/client";

const handler = connect();

handler.use(sessionValidator).get(async (req, res, next) => {
  const prisma = new PrismaClient();
  const session = await getSession({ req });

  const participantId = req.query.participantId[0];

  const details = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
    select: {
      name: true,
      pincode: true,
      selfie: true,
      dosesRecieved: true,
      Vaccination: {
        include: {
          Match: true,
        },
      },
    },
  });

  return res.status(200).json(details);
});

export default handler;
