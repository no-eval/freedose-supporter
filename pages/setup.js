import { Head } from "components/head";
import React, { Fragment, useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

export default function Setup(params) {
  return <Fragment></Fragment>;
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
      return {
        redirect: {
          destination: "/setup/step-one",
          permanent: false,
        },
      };
    }
  }
}
