import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
import connect from "next-connect";
import sessionValidator from "middleware/session-validator";
const cloudinary = require("cloudinary").v2;

const handler = connect();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

handler.use(sessionValidator).post(async (req, res, next) => {
  const prisma = new PrismaClient();
  const session = await getSession({ req });
  const email = session.user.email;
  const selfie = req.body.selfie;
  const supporter = await prisma.supporter.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  const publicId = `supporter/${supporter.id}/selfie/${supporter.id}`;
  const selfieUrl = await cloudinary.uploader.upload(
    selfie,
    {
      public_id: publicId,
      unique_filename: false,
    },
    (error, result) => {
      console.log(result.secure_url);
    }
  );

  const updateSupporter = await prisma.supporter.update({
    where: {
      email: email,
    },
    data: {
      selfie: selfieUrl.secure_url,
    },
  });
  // const rawSql = await prisma.$executeRaw`UPDATE "Supporter" SET "selfie" = decode(${selfie}, 'string') WHERE email = ${email}`;
  return res.status(200).json(supporter);
});

export default handler;
