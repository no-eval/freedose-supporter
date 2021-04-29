import { Head } from "components/head";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { useForm, Controller } from "react-hook-form";
import { PrismaClient } from "@prisma/client";
import StepHead from "components/step-head";
import axios from "axios";
import { useRouter } from "next/router";

export default function SetupStepOne(params) {
  const [session] = useSession();
  const [totalPledges, setTotalPledges] = useState(1);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, data },
  } = useForm();

  const router = useRouter();

  function onSubmit(data) {
    toast.promise(
      axios
        .post("/api/setup/step-one", data)
        .then((v) => console.log(v))
        .catch((e) => console.log(e)),
      {
        loading: "Saving...",
        success: "Yay! saved successfully",
        error: "This didn't work",
      }
    );
    router.push("/setup/step-two");
  }

  return (
    <Fragment>
      <Head title="Supporter Setup / Step One / Freedose" />
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-grow h-screen">
          <Fragment>
            <StepHead title="New account" />
            <div className="flex items-center justify-center p-4">
              <div className="w-full max-w-xs mx-auto">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-medium text-gray-700 text-md"
                  >
                    Full name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-primary-100 focus:border-primary-100 sm:text-md"
                      defaultValue={session?.user?.name}
                      placeholder="Kailash Satyarthi"
                      {...register("name", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                    {errors.name && errors.name.type === "required" && (
                      <span className="text-xs text-yellow-500">
                        Name is required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-2">
              <div className="w-full max-w-xs mx-auto">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-medium text-gray-700 text-md"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="email"
                      className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-primary-100 focus:border-primary-100 sm:text-md"
                      defaultValue={session?.user?.email}
                      placeholder="kailash@gmail.com"
                      {...register("email", {
                        required: true,
                        maxLength: 50,
                        pattern: /^\S+@\S+$/i,
                      })}
                    />
                    {errors.email && errors.email.type === "required" && (
                      <span className="text-xs text-yellow-500">
                        Email is required
                      </span>
                    )}
                    {errors.email && errors.email.type === "pattern" && (
                      <span className="text-xs text-yellow-500">
                        Valid email is required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 pb-8">
              <button
                type="submit"
                className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
              >
                <p className="px-2">Next</p>
                <svg
                  className="flex"
                  width="9"
                  height="16"
                  viewBox="0 0 9 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.10784 16.41L0.589844 15.108L6.68284 8.00003L0.589844 0.892027L2.10784 -0.409973L8.75884 7.35003C9.07984 7.72403 9.07984 8.27703 8.75884 8.65103L2.10784 16.41Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </Fragment>
        </div>
      </form>
    </Fragment>
  );
}

// <div className="w-full h-screen bg-white md:col-start-2 md:col-span-3">
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

    console.log(userExists, supporter);

    if (userExists && supporter.name && supporter.dosesPledged) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    } else if (userExists && !supporter.selfie) {
      return {
        redirect: {
          destination: "/setup/step-two",
          permanent: false,
        },
      };
    } else if (userExists && !supporter.dosesPledged) {
      return {
        redirect: {
          destination: "/setup/step-three",
          permanent: false,
        },
      };
    }

    if (!userExists) {
      return { props: {} };
    }
  }
}
