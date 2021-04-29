import { Head } from "components/head";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { getProviders, signIn, useSession, signOut } from "next-auth/client";
import toast, { Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
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
import StepHead from "components/step-head";
import axios from "axios";
import { useRouter } from "next/router";

export default function SetupStepThree(params) {
  const [hasPledged, setHasPledged] = useState(false);
  const [totalPledges, setTotalPledges] = useState(1);
  const [confirmScreen, setConfirmScreen] = useState(false);
  const router = useRouter();

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

  function onSubmit() {
    toast.promise(
      axios
        .post("/api/setup/step-three", { dosesPledged: totalPledges })
        .then((v) => console.log(v))
        .catch((e) => console.log(e)),
      {
        loading: "Saving...",
        success: "Setup is now complete!",
        error: "This didn't work",
      }
    );
    router.push("/home");
  }

  return (
    <Fragment>
      {!confirmScreen ? (
        <Fragment>
          <div className="h-screen">
            <div className="h-auto pb-8 bg-primary-20">
              <StepHead title="Pledge support" />
              <div className="mx-8">
                <p>Pledge amount</p>
                <div className="flex flex-wrap items-center justify-between pt-2 text-center">
                  <h1 className="text-4xl font-bold">
                    {totalPledges} {totalPledges === 1 ? "dose" : "doses"}
                  </h1>
                  <p className="p-2 text-xl text-white rounded-md bg-primary-100">
                    ~ ₹{totalPledges ? totalPledges * 600 : "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col mx-8 h-3/4">
              <div className="min-w-full pt-8">
                <p className="text-base">Number of doses you want to fund</p>
                <p className="pt-2 text-sm">You can always add more later</p>
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
                        label={<p className="text-lg">{totalPledges} 💉</p>}
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
                  The cost of vaccines is dependent on brand, location and
                  hospital. The pledge is calculate based on average costs and
                  final value may differ slightly.
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 pb-8">
                <button
                  onClick={() => {
                    setConfirmScreen(true);
                  }}
                  className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="h-screen">
            <div className="pb-8 bg-primary-20">
              <StepHead title="Pledge support" />
              <div className="mx-4">
                <div className="flex flex-col items-center justify-between text-center">
                  <p>Pledge amount</p>
                  <h1 className="p-4 text-4xl font-bold">
                    {totalPledges} {totalPledges === 1 ? "dose" : "doses"}
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
                  It is important your pledge amount is true to your intentions.
                  You will immediately be assigned participants, so kindly
                  ensure you intend on fulfilling it.
                </p>
              </div>
              <div className="grid w-full place-items-center">
                <label htmlFor="accept" className="text-base text-gray-700 ">
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
                  onClick={() => onSubmit()}
                  disabled={hasPledged ? false : true}
                  className="flex items-center justify-center w-full max-w-xs p-4 py-3 mx-auto text-base font-medium text-white border border-transparent rounded-md bg-primary-100 hover:bg-primary-80 md:py-4 md:text-lg md:px-10 disabled:opacity-40"
                >
                  Confirm Pledge
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
