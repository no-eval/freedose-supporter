const { Fragment, useEffect, useState, useRef } = require("react");
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

export default function Participant(params) {
  const router = useRouter();
  const { participantId } = router.query;
  const [participant, setParticipant] = useState();

  useEffect(() => {
    const res = axios
      .get(`/api/participant/${participantId}`)
      .then((v) => console.log(v));
    console.log(res);
  }, []);

  return (
    <Fragment>
      <div>{participantId}</div>
    </Fragment>
  );
}
