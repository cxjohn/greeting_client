import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Head from "next/head";
import CardPDF from "../components/CardPDF";

export default function Home() {
  const outsideRef = useRef();
  const insideRef = useRef();
  const [data, setData] = useState({ text: "" });
  const [query, setQuery] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imagePrediction, setImagePrediction] = useState(null);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editedText, setEditedText] = useState("");

  const createCard = () => {
    fetchImageData();
    fetchTextData();
  };
  const fetchImageData = async () => {
    if (query) {
      setIsImageLoading(true);

      const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
      const response = await fetch("/api/replicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: query,
        }),
      });
      let prediction = await response.json();
      if (response.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setImagePrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch("/api/replicate/" + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        console.log({ prediction });
        setImagePrediction(prediction);
      }
      if (prediction.status === "succeeded" || prediction.status === "failed") {
        setIsImageLoading(false);
      }
    }
  };
  const fetchTextData = async () => {
    if (query) {
      setIsTextLoading(true);
      const res = await fetch(`/api/dalle/text`, {
        body: JSON.stringify({
          name: query,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await res.json();
      setData(data);
      setEditedText(data.text);
      setIsTextLoading(false);
    }
  };

  const downloadCard = async (face: string) => {
    const element = face === "inside" ? insideRef.current : outsideRef.current;

    // @ts-ignore
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
    });

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "cover.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const handleTextChange = (event: any) => {
    setEditedText(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Greetly | Greeting Card Generator</title>
        <meta
          name="description"
          content="Make a totally unique, beautiful greeting card"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="relative">
        <div
          className="hidden 2xl:block absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="1360"
            height="578"
            viewBox="0 0 1360 578"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                id="illustration-01"
              >
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#EAEAEA" offset="77.402%" />
                <stop stopColor="#DFDFDF" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="url(#illustration-01)" fillRule="evenodd">
              <circle cx="1232" cy="128" r="128" />
              <circle cx="155" cy="443" r="64" />
            </g>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-16 pb-12 md:py-20">
            <div className="text-center pb-12 md:pb-16">
              <h1 className="text-5xl md:text-9xl font-extrabold leading-tighter tracking-tighter mb-4">
                Make your own{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  greeting card
                </span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-600 my-4">
                  Enter a category or theme and let our AI write a unique
                  greeting just for you!
                </p>
                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <input
                    className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out  px-8 py-3 shadow-lg text-gray-900 bg-blue-100 hover:bg-blue-200 w-full mb-4 sm:w-auto sm:mb-0"
                    placeholder="Try 'birthday' or 'congratulations'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <button
                    className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out  px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                    onClick={() => createCard()}
                    disabled={isTextLoading || isImageLoading}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>

            <div className="relative max-w-[900px] mx-auto">
              <div className="overflow-auto lg:overflow-visible">
                <div className="sm:hidden mb-8">
                  Scroll left and right to see the full card!
                </div>
                <div className="w-[900px] flex justify-around text-sm text-gray-600 italic">
                  <span>Outer Rear</span>
                  <span>Outer Front</span>
                </div>
                <div className="lg:shadow-lg mb-2">
                  <div
                    //@ts-ignore
                    ref={outsideRef}
                  >
                    <div className="w-[900px] h-[450px] flex border lg:border-none">
                      <p className="flex w-1/2 text-center h-full justify-center items-center">
                        Made with ♥
                      </p>{" "}
                      <div className="w-1/2 leading-none">
                        {isImageLoading ? (
                          <SkeletonTheme
                            baseColor="#3b82f6"
                            highlightColor="#2dd4bf"
                          >
                            <Skeleton
                              height="450px"
                              width="450px"
                              borderRadius={0}
                            />
                          </SkeletonTheme>
                        ) : //@ts-ignore

                        imagePrediction && imagePrediction.output ? (
                          <div>
                            <img
                              className="pointer-events-none"
                              src={
                                //@ts-ignore

                                imagePrediction.output[
                                  //@ts-ignore

                                  imagePrediction.output.length - 1
                                ]
                              }
                            />
                          </div>
                        ) : (
                          <img
                            className="pointer-events-none"
                            src="https://replicate.delivery/pbxt/LpvJ0TuN6CKOBFpMGnEvQiCqrJfspjdvLjfHqTMwMl0mnPRQA/out-0.png"
                            alt="AI generated Monet-style painting of lillies"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between">
                <button
                  className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-6"
                  type="button"
                  onClick={() => downloadCard("outside")}
                >
                  Download
                </button>
                <button
                  className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-2 sm:mb-6"
                  type="button"
                  onClick={() => fetchImageData()}
                >
                  Regenerate Image
                </button>
              </div>
              <div className="overflow-auto lg:overflow-visible">
                <div className="w-[900px] flex justify-around text-sm text-gray-600 italic">
                  <span>Inside Front</span>
                  <span>Inside Back</span>
                </div>
                <div className="lg:shadow-lg mb-2">
                  <div
                    //@ts-ignore
                    ref={insideRef}
                  >
                    <div className="w-[900px] h-[450px] bg-white flex border lg:border-none">
                      <div className="w-1/2 border border-y-0 border-l-0 border-dashed"></div>
                      <div className="w-1/2 flex flex-col text-center h-full justify-around items-center px-12 border border-y-0 border-r-0 border-dashed ">
                        <div>
                          {isTextLoading ? (
                            <SkeletonTheme
                              baseColor="#3b82f6"
                              highlightColor="#2dd4bf"
                            >
                              <Skeleton height="96px" width="402px" />
                            </SkeletonTheme>
                          ) : editedText ? (
                            edit ? (
                              <textarea
                                value={editedText}
                                onChange={handleTextChange}
                              ></textarea>
                            ) : (
                              <p>{editedText}</p>
                            )
                          ) : edit ? (
                            <textarea>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud
                            </textarea>
                          ) : (
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud
                            </p>
                          )}
                        </div>
                        <p></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between">
                <button
                  className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-6"
                  type="button"
                  onClick={() => downloadCard("inside")}
                >
                  Download
                </button>
                <div>
                  <button
                    className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-gray-900 bg-white hover:bg-gray-100 w-full sm:w-auto mb-2 sm:mb-6 sm:mr-2"
                    type="button"
                    onClick={() => setEdit((prev) => !prev)}
                  >
                    {edit ? "Set Text" : "Edit Text"}
                  </button>
                  <button
                    className="font-medium inline-flex items-center justify-center border-2 border-gray-900 rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-2 sm:mb-6"
                    type="button"
                    onClick={() => fetchTextData()}
                  >
                    Regenerate Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
