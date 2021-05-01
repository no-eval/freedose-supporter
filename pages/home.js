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
        <ParticipantLookout />
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
