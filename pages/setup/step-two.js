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
import Webcam from "react-webcam";

export default function SetupStepTwo(params) {
  const webcamRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);
  const [imageData, setImageData] = useState(null);
  const router = useRouter();

  const imageDataRef = useRef(imageData);

  function updateImageState(newState) {
    imageDataRef.current = newState;
    setImageData(newState);
  }

  const capture = () => {
    const imageSource = webcamRef.current.getScreenshot();
    updateImageState(imageSource);
  };

  function onSubmit() {
    toast.promise(
      axios
        .post("/api/setup/step-two", { selfie: imageDataRef.current })
        .then((v) => console.log(v))
        .catch((e) => console.log(e)),
      {
        loading: "Saving...",
        success: "Yay! saved successfully",
        error: "This didn't work",
      }
    );
    router.push("/setup/step-three");
  }

  return (
    <Fragment>
      <Head title="Supporter Setup / Step Two / Freedose" />
      <Toaster />
      <div>
        {!useCamera ? (
          <div className="flex-grow w-auto h-auto">
            <Fragment>
              <StepHead title="Selfie" />
            </Fragment>

            <img
              className="flex items-center justify-center w-1/2 m-auto"
              src="/images/selfie.svg"
            />
            <div className="w-full p-4 m-2">
              <h1 className="text-base font-semibold">
                Let’s take a quick selfie!
              </h1>
              <p>
                Let’s put a face behind your kind action; your face, right now
                without any filters. Only your vaccination drive participants
                will be able to see this, but don’t forget to smile for them
                (even if it’s underneath your mask)!
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap px-8 pb-8">
              <button
                onClick={() => router.push("/setup/step-three")}
                className="flex items-center justify-center w-1/2 max-w-xs py-3 mx-auto text-base font-medium text-gray-700 md:py-4 md:text-lg md:px-10"
              >
                <p className="px-2">Skip for now</p>
              </button>
              <button
                onClick={() => setUseCamera(true)}
                className="flex items-center justify-center w-1/2 max-w-xs py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
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
          </div>
        ) : useCamera && !imageData ? (
          <div className="flex-grow w-auto h-auto">
            <Webcam
              videoConstraints={{
                facingMode: "user",
              }}
              screenshotFormat="image/jpeg"
              ref={webcamRef}
              mirrored={true}
              screenshotQuality={1}
            />
            <button
              onClick={() => capture()}
              className="absolute items-center justify-center p-4 transform -translate-x-1/2 -translate-y-1/2 border-transparent rounded-full top-3/4 left-1/2 bg-primary-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex-grow h-screen">
            <Fragment>
              <StepHead title="Selfie" />
            </Fragment>
            <div className="flex items-center justify-center">
              <img
                src={imageData}
                className="border-8 rounded-full w-60 h-60 border-primary-60"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 pb-8">
              <button
                onClick={() => onSubmit()}
                className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
