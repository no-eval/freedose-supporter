import { Head } from "components/head";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "next-auth/client";
import { useForm, Controller } from "react-hook-form";
import Webcam from "react-webcam";
import { PrismaClient } from "@prisma/client";
import {
  Slider,
  SliderInput,
  SliderTrack,
  SliderRange,
  SliderHandle,
  SliderMarker,
} from "@reach/slider";
import "@reach/slider/styles.css";
import { useTooltip, TooltipPopup } from "@reach/tooltip";
import "@reach/tooltip/styles.css";
import { wrapEvent } from "@reach/utils";

export default function Setup(params) {
  const [session] = useSession();
  const [step, setStep] = useState(1);
  const [imgSrc, setImgSrc] = useState();
  const [hasPledged, setHasPledged] = useState(false);
  const [totalPledges, setTotalPledges] = useState(1);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, data },
  } = useForm();

  const webcamRef = useRef(null);

  let imageSrc;

  const capture = () => {
    imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const onSubmit = (data) => console.log(data);

  //Code from Reach UI example
  const handleRef = React.useRef();
  const [trigger, tooltip] = useTooltip();
  const centered = (triggerRect, tooltipRect) => {
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const left = triggerCenter - tooltipRect.width / 2;
    const maxLeft = window.innerWidth - tooltipRect.width - 2;
    return {
      left: Math.min(Math.max(2, left), maxLeft) + window.pageXOffset,
      top: triggerRect.bottom + 8 + window.pageYOffset,
    };
  };

  return (
    <Fragment>
      <Head title="Supporter / Freedose" />
      <div className="bg-white">
        <div className="flex-row md:grid md:grid-cols-5">
          {/* Action messages */}
          <Toaster />
          {/* Main App */}
          <div className="w-full h-screen bg-white md:col-start-2 md:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex-grow h-3/4">
                {step === 1 ? (
                  <Fragment>
                    <div className="flex items-center justify-center p-8">
                      <p className="text-2xl font-bold">New account</p>
                    </div>
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
                              className="block w-full p-4 border-gray-300 rounded-md shadow-sm focus:ring-primary-100 focus:border-primary-100 sm:text-md"
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
                    <div className="flex items-center justify-center p-4">
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
                              className="block w-full p-4 border-gray-300 rounded-md shadow-sm focus:ring-primary-100 focus:border-primary-100 sm:text-md"
                              placeholder="kailash@gmail.com"
                              {...register("email", {
                                required: true,
                                maxLength: 50,
                              })}
                            />
                            {errors.email &&
                              errors.email.type === "required" && (
                                <span className="text-xs text-yellow-500">
                                  Email is required
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setStep(2);
                      }}
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
                  </Fragment>
                ) : null}
                {step === 2 ? (
                  <Fragment>
                    <div className="flex items-center justify-center p-8">
                      <p className="text-2xl font-bold">Selfie</p>
                    </div>
                    <img
                      className="flex items-center justify-center w-1/2 p-4 m-auto"
                      src="/images/selfie.svg"
                    />
                    <div className="w-full p-8 m-2">
                      <h1 className="text-base font-semibold">
                        Let’s take a quick selfie!
                      </h1>
                      <p>
                        Let’s put a face behind your kind action; your face,
                        right now without any filters. Only your vaccination
                        drive participants will be able to see this, but don’t
                        forget to smile for them (even if it’s underneath your
                        mask)!
                      </p>
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => {
                          setStep(5);
                        }}
                        className="items-center justify-center w-1/2 bg-transparent border-transparent"
                      >
                        Skip for now
                      </button>
                      <button
                        onClick={() => {
                          setStep(3);
                          onSubmit();
                        }}
                        className="flex items-center justify-center w-1/2 max-w-xs p-4 py-3 mx-4 text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
                      >
                        <p className="px-2">Take selfie</p>
                        <svg
                          className="flex"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  </Fragment>
                ) : null}
                {step === 3 ? (
                  <Fragment>
                    <Webcam
                      videoConstraints={{
                        height: 1280,
                        width: 720,
                        facingMode: "user",
                      }}
                      screenshotFormat="image/jpeg"
                      ref={webcamRef}
                      mirrored={true}
                      screenshotQuality={1}
                      height={360}
                      width={640}
                      className="rounded-md"
                    />
                    <input
                      type="hidden"
                      name="selfie"
                      id="selfie"
                      {...register("selfie")}
                    />
                    <button
                      onClick={() => {
                        Promise.all([
                          capture(),
                          setValue("selfie", imageSrc),
                          onSubmit(),
                        ]).then(setStep(4));
                      }}
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
                  </Fragment>
                ) : null}
                {step === 4 ? (
                  <Fragment>
                    <div className="flex items-center justify-center p-8">
                      <p className="text-2xl font-bold">Selfie</p>
                    </div>
                    <div className="flex items-center justify-center p-8">
                      <img
                        src={imgSrc}
                        className="border-8 rounded-full w-60 h-60 border-primary-60"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setStep(5);
                      }}
                      className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
                    >
                      Save
                    </button>
                  </Fragment>
                ) : null}
                {step === 5 ? (
                  <Fragment>
                    <div className="h-screen">
                      <div className="h-auto pb-8 bg-primary-20">
                        <div className="flex items-center justify-center p-8 ">
                          <p className="text-2xl font-bold">Pledge support</p>
                        </div>
                        <div className="mx-8">
                          <p>Pledge amount</p>
                          <div className="flex flex-wrap items-center justify-between pt-2 text-center">
                            <h1 className="text-4xl font-bold">
                              {totalPledges}{" "}
                              {totalPledges === 1 ? "dose" : "doses"}
                            </h1>
                            <p className="p-2 text-xl text-white rounded-md bg-primary-100">
                              ~ ₹{totalPledges ? totalPledges * 600 : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex flex-col mx-8 h-3/4">
                        <div className="min-w-full pt-8">
                          <p className="text-base">
                            Number of doses you want to fund
                          </p>
                          <p className="pt-2 text-sm">
                            You can always add more later
                          </p>
                          <div className="pt-8">
                            <Slider
                              name="Pledge"
                              min={1}
                              max={10}
                              step={1}
                              value={totalPledges}
                              onChange={(value) => {
                                setTotalPledges(value);
                              }}
                            >
                              <SliderTrack>
                                <SliderRange />
                                <SliderMarker value={totalPledges} />
                                <SliderHandle ref={handleRef} {...trigger} />
                                <TooltipPopup
                                  {...tooltip}
                                  position={centered}
                                  label={
                                    <p className="text-lg">{totalPledges} 💉</p>
                                  }
                                />
                              </SliderTrack>
                            </Slider>
                            <div className="flex flex-wrap justify-between">
                              <div>1 dose</div>
                              <div>10 doses</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="pt-12 pb-4 text-sm text-gray-700">
                            The cost of vaccines is dependent on brand, location
                            and hospital. The pledge is calculate based on
                            average costs and final value may differ slightly.
                          </p>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 pb-8">
                          <button
                            onClick={() => {
                              setStep(6);
                            }}
                            className="flex items-center justify-center w-full h-10 p-4 py-3 mx-auto text-base font-medium bg-white border-2 rounded-md text-primary-100 border-primary-100 hover:bg-primary-20 md:py-4 md:text-lg md:px-10"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : null}
                {step === 6 ? (
                  <Fragment>
                    <div className="h-screen">
                      <div className="pb-8 bg-primary-20">
                        <div className="flex items-center justify-center p-8 ">
                          <p className="text-2xl font-bold">Pledge support</p>
                        </div>
                        <div className="mx-4">
                          <div className="flex flex-col items-center justify-between text-center">
                            <p>Pledge amount</p>
                            <h1 className="p-4 text-4xl font-bold">
                              {totalPledges}{" "}
                              {totalPledges === 1 ? "dose" : "doses"}
                            </h1>
                            <p className="p-2 text-xl text-white rounded-md bg-primary-100">
                              ~ ₹{totalPledges ? totalPledges * 600 : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative mx-8 h-2/3">
                        <div>
                          <p className="pt-12 pb-4 text-base text-gray-700">
                            It is important your pledge amount is true to your
                            intentions. You will immediately be assigned
                            participants, so kindly ensure you intend on
                            fulfilling it.
                          </p>
                        </div>
                        <div className="grid w-full place-items-center">
                          <label
                            htmlFor="accept"
                            className="text-base text-gray-700 "
                          >
                            <input
                              type="checkbox"
                              id="accept"
                              onClick={(value) => {
                                setHasPledged(!hasPledged);
                              }}
                              className="m-4"
                            />
                            I pledge to fund {totalPledges} doses of vaccines
                          </label>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 pb-8">
                          <button
                            disabled={hasPledged ? false : true}
                            className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md disabled:opacity-40 bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
                          >
                            Confirm Pledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        {/* Infobar @ Desktop Only */}
        <div className="relative hidden md:container sm:block md:bg-white md:col-start-5 md:col-span-1"></div>
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
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }

    if (!userExists) {
      return { props: {} };
    }
  }
}
