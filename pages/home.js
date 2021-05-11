import { Head } from "components/head";
import { Fragment, useEffect, useState } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import NavBar from "components/nav-bar";
import ProgressBar from "@ramonak/react-progress-bar";
import ReactRoundedImage from "react-rounded-image";
import { useRouter } from "next/router";

function ParticipantLookout(params) {
  return (
    <Fragment>
      <div className="p-8 bg-white rounded-md">
        <img src="images/participant-lookout.svg" className="block mx-auto" />
        <h1 className="py-2 text-base font-bold text-center">
          Looking for participants
        </h1>
        <p className="pb-8 text-base text-center">
          You’re all set up! We will pair you with a participant as soon as they
          sign up.
        </p>
        <button className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium border border-transparent rounded-md text-primary-100 border-primary-100 hover:bg-primary-20 md:py-4 md:text-lg md:px-10">
          <p className="px-2">Share app</p>
        </button>
      </div>
    </Fragment>
  );
}

function ParticipantComponent(item) {
  const { match } = item;
  const router = useRouter();

  const AWAITING_ACKNOWLEDGEMENT = match.acknowledgedAt === null ? true : false;
  const AWAITING_VACCINATION =
    match.status === "PENDING_VACCINATION" &&
    match.participant.Vaccination[0].progress === "REGISTERED"
      ? true
      : false;
  const AWAITING_FUNDS =
    match.participant.Vaccination[0].progress === "VACCINATED" ? true : false;
  const FUNDS_RECEIVED =
    match.paymentProof !== null && match.thankyouNote === null ? true : false;
  const THANKYOU_RECEIVED =
    match.paymentProof !== null && match.thankyouNote !== null ? true : false;

  return (
    <div
      onClick={() => router.push(`/participant/${match.participantId}`)}
      className="grid border-b border-gray-200 cursor-pointer hover:bg-gray-50 grid-cols-auto-two"
    >
      <div className="py-2">
        <ReactRoundedImage
          image={match.participant.selfie}
          imageWidth="64"
          imageHeight="64"
          roundedSize="4"
          roundedColor="#FFF"
        />
      </div>
      <div className="w-full px-4 pt-2">
        <div className="flex justify-between">
          <h1 className="text-lg font-medium truncate">
            {match.participant.name}
          </h1>
          <div className="flex">
            {match.participant.Vaccination[0].dose === "FIRST" ? (
              <Fragment>
                <img src="/images/vaccine-ongoing-done.svg" />
                <img src="/images/vaccine-pending.svg" />
              </Fragment>
            ) : (
              <Fragment>
                <img src="/images/vaccine-ongoing-done.svg" />
                <img src="/images/vaccine-ongoing-done.svg" />
              </Fragment>
            )}
          </div>
        </div>
        <h2 className="text-sm text-gray-600">
          {AWAITING_ACKNOWLEDGEMENT ? (
            <div className="flex">
              <img
                src="/images/awaiting-acknowledgement.svg"
                className="pr-1"
              />
              Awaiting acknowledgement
            </div>
          ) : AWAITING_VACCINATION ? (
            <div className="flex">
              <img src="/images/awaiting-vaccination.svg" className="pr-1" />
              Awaiting participant's vaccination
            </div>
          ) : AWAITING_FUNDS ? (
            <div className="flex">
              <img src="/images/send-funds.svg" className="pr-1" />
              Send funds
            </div>
          ) : FUNDS_RECEIVED ? (
            <div className="flex">
              <img src="/images/send-funds.svg" className="pr-1" />
              Funds sent successfully
            </div>
          ) : THANKYOU_RECEIVED ? (
            <div className="flex">
              <img src="/images/loop-complete.svg" className="pr-1" />
              Received message
            </div>
          ) : (
            "Status unknown"
          )}
        </h2>
        <div className="flex pt-2">
          <Fragment>
            <div className="w-1/3 pr-2">
              <ProgressBar
                completed={AWAITING_ACKNOWLEDGEMENT ? 0 : 100}
                bgColor="#6666FF"
                baseBgColor="#E7E7E9"
                height="4px"
                isLabelVisible={false}
              />
            </div>
            <div className="w-1/3 pr-2">
              <ProgressBar
                completed={AWAITING_VACCINATION ? 0 : 100}
                bgColor="#6666FF"
                baseBgColor="#E7E7E9"
                height="4px"
                isLabelVisible={false}
              />
            </div>
            <div className="w-1/3">
              <ProgressBar
                completed={FUNDS_RECEIVED && THANKYOU_RECEIVED ? 100 : 0}
                bgColor="#6666FF"
                baseBgColor="#E7E7E9"
                height="4px"
                isLabelVisible={false}
              />
            </div>
          </Fragment>
        </div>
      </div>
    </div>
  );
}

function ActiveParticipants({ match }) {
  const activeParticipantList = [];
  const revokedParticipantList = [];
  const completedParticipantList = [];

  const matchThis = match?.forEach((item, index) => {
    !item.matchRevoked
      ? activeParticipantList.push(
          <ParticipantComponent match={item} key={index} />
        )
      : item.thankyouNote
      ? completedParticipantList.push(
          <ParticipantComponent match={item} key={index} />
        )
      : revokedParticipantList.push(
          <ParticipantComponent match={item} key={index} />
        );
  });

  return (
    <Fragment>
      {activeParticipantList.length !== 0 ? (
        <Fragment>
          <div className="p-4 pt-0 font-medium text-gray-700">
            Active Participants
          </div>
          <div className="px-4 bg-white rounded-md">
            {activeParticipantList}
          </div>
        </Fragment>
      ) : null}
      {completedParticipantList.length !== 0 ? (
        <Fragment>
          <div className="p-4 font-medium text-gray-700">Archive</div>
          <div className="px-4 bg-white rounded-md">
            {completedParticipantList}
          </div>
        </Fragment>
      ) : null}
      {revokedParticipantList.length !== 0 ? (
        <Fragment>
          <div className="p-4 font-medium text-gray-700">Revoked</div>
          <div className="px-4 bg-white rounded-md">
            {revokedParticipantList}
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
}

export default function Home(params) {
  const [session] = useSession();
  const [supporter, setSupporter] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const supporterDetails = axios
      .get("/api/supporter-details")
      .then((response) => setSupporter(response.data));
  }, []);

  useEffect(() => {
    setProgress((supporter?.dosesFulfilled / supporter?.dosesPledged) * 100);
  });

  return (
    <Fragment>
      <Head title="Supporter / Freedose" />
      <div className="min-h-screen pb-20 text-gray-800 bg-primary-20">
        <div className="px-8 py-8">
          <div className="flex justify-center">
            <ReactRoundedImage
              image={supporter?.selfie || session?.user?.image}
              roundedColor="#B8B8FF"
              hoverColor="#6666FF"
              imageWidth="96"
              imageHeight="96"
              roundedSize="13"
              borderRadius="70"
            />
          </div>
          <div className="py-4">
            <h1 className="text-2xl font-medium text-center">
              Hey {supporter?.name}!
            </h1>
            <h3 className="py-2 text-base text-center">No action pending</h3>
          </div>
          <div className="p-4 bg-white rounded-md">
            <p className="pb-2 text-xs text-gray-800">Pledge progress</p>
            <ProgressBar
              completed={progress}
              bgColor="#6666FF"
              baseBgColor="#E7E7E9"
              height="8px"
              isLabelVisible={false}
            />
            <div>
              <p className="pt-2 text-xs text-primary-100">
                {supporter?.dosesFulfilled} of {supporter?.dosesPledged} doses
              </p>
            </div>
          </div>
        </div>
        {/* empty state */}
        {supporter?.Match.length != 0 ? (
          <ActiveParticipants match={supporter?.Match} />
        ) : (
          <ParticipantLookout />
        )}
        <NavBar currentTab="home" />
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ req, res }, context) {
  /* Redirect unauthenticated user back to sign in page */
  const prisma = new PrismaClient();
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  /* Toggle between home & set-up section */
  const email = session?.user?.email;

  if (email != null || undefined) {
    const supporter = await prisma.supporter.findUnique({
      where: {
        email: email,
      },
    });

    const userExists = supporter != null || undefined ? true : false;

    if (userExists && supporter.dosesPledged > 0) {
      return { props: {} };
    } else {
      return {
        redirect: {
          destination: "/setup",
          permanent: false,
        },
      };
    }
  }
}
