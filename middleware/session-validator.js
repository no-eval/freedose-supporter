import { getSession } from "next-auth/client";

async function sessionValidator(req, res, next) {
  const session = await getSession({ req });
  if (session === null || undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export default sessionValidator;
