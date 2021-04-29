import { Head } from "components/head";
import { Fragment, useEffect } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

function Infobar(params) {
  return (
    <Fragment>
      <div className="absolute bottom-0 m-4">
        <p className="p-2 text-xs text-gray-500">
          Scan this QR code to get Freedose on your phone!
        </p>
        <img
          src="qrcode.svg"
          className="p-3 bg-white rounded-sm shadow-md drop-shadow-md"
        />
      </div>
      <div className="m-4 text-xs">
        <p className="text-xs font-semibold">Stay updated here:</p>
        <a
          className="hover:text-primary-100"
          href="https://twitter.com/freedoseOrg"
          target="_blank"
        >
          @freedoseOrg
        </a>
      </div>
    </Fragment>
  );
}

export default function Home({ providers }) {
  const [session] = useSession();

  useEffect(() => {
    if (!session) {
      return;
    }
    toast.success(`Welcome, ${session.user.name}`);
  }, [session]);

  const handleSignout = (e) => {
    e.preventDefault();
    toast("See you soon", { icon: "👋" });
    setTimeout(() => {}, 7200);
    signOut();
  };

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
            <div className="px-8 bg-white h-1/2">
              <p className="pt-16 pb-8 text-xl font-medium text-center text-gray-800">
                We’re excited to see you fund vaccinations!
              </p>
              <p className="w-full text-center text-gray-600">
                Freedose will connect you with a person in need of funds for
                their Covid-19 vaccination. You will be able to directly
                transfer funds and view their progress.
              </p>
              <div className="px-8 pt-8 m-auto">
                {!session ? (
                  <div className="items-center rounded-md shadow">
                    {Object.values(providers).map((provider) => (
                      <div key={provider.name}>
                        <button
                          className="flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                          onClick={() => signIn(provider.id)}
                        >
                          <img
                            src="images/google.svg"
                            className="w-6 p-1 bg-white rounded-md"
                          />
                          <p className="px-2">Sign in with {provider.name}</p>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={handleSignout}
                    className="flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Infobar @ Desktop Only */}
          <div className="relative hidden md:container sm:block md:bg-white md:col-start-5 md:col-span-1">
            <Infobar />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ req, res }, context) {
  const session = await getSession({ req });
  const prisma = new PrismaClient();
  const providers = await getProviders();

  const email = session?.user?.email;

  if (email != null || undefined) {
    const supporter = await prisma.supporter.findUnique({
      where: {
        email: email,
      },
    });

    const userExists = supporter != null || undefined ? true : false;

    if (userExists && supporter.dosesPledged) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/setup",
          permanent: false,
        },
      };
    }
  }

  return {
    props: { providers },
  };
}
