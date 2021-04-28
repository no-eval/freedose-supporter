import { Head } from "components/head";
import { Fragment, useEffect } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

export default function Home(params) {
  return (
    <Fragment>
      <Head title="Supporter / Freedose" />
      <div className="bg-white">
        <div className="flex-row md:grid md:grid-cols-5">
          {/* Action messages */}
          <Toaster />
          {/* Main App */}
          <div className="w-full h-screen bg-primary-20 md:col-start-2 md:col-span-3">
            <div className="flex items-center justify-center p-8">
              <img src="freedose.svg" className="p-2" />
              <p className="text-4xl font-bold">Freedose</p>
            </div>
            <img src="images/signup-one.svg" className="object-cover w-full" />
          </div>
          {/* Infobar @ Desktop Only */}
          <div className="relative hidden md:container sm:block md:bg-white md:col-start-5 md:col-span-1"></div>
        </div>
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

    if (userExists) {
      return { props: {} };
    }

    if (!userExists) {
      return {
        redirect: {
          destination: "/setup",
          permanent: false,
        },
      };
    }
  }
}
