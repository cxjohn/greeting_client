import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Head from "next/head";
import CardPDF from "../components/CardPDF";
import axios from "axios";

export default function Home() {
  const outsideRef = useRef();
  const insideRef = useRef();
  const [data, setData] = useState({ text: "" });
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imageState, setImageState] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (search) {
  //       setIsLoading(true);
  //       const result = (
  //         await Promise.all([
  //           fetch(`/api/dalle/text`, {
  //             body: JSON.stringify({
  //               name: search,
  //             }),
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             method: "POST",
  //           }),
  //           fetch("/api/dalle/image", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               name: search,
  //             }),
  //           }),
  //         ])
  //       ).map((r) => r.json());
  //       const [result1, result2] = await Promise.all(result);
  //       setData(result1);
  //       setResult(result2.result);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        setIsLoading(true);
        const res = await fetch(`/api/dalle/text`, {
          body: JSON.stringify({
            name: search,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const data = await res.json();
        setData(data);

        const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
        const response = await fetch("/api/replicate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: search,
          }),
        });
        let prediction = await response.json();
        if (response.status !== 201) {
          setError(prediction.detail);
          return;
        }
        setPrediction(prediction);

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
          setPrediction(prediction);
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search]);

  const handleDownloadCardOutside = async () => {
    const element = outsideRef.current;
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

  const handleDownloadCardInside = async () => {
    const element = insideRef.current;
    // @ts-ignore
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "inside.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
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
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none"
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
              <h1
                className="text-5xl md:text-9xl font-extrabold leading-tighter tracking-tighter mb-4"
                data-aos="zoom-y-out"
              >
                Make your own{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  greeting card
                </span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p
                  className="text-xl text-gray-600 my-4"
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  Enter a category or theme and let our AI write a unique
                  greeting just for you!
                </p>
                <div
                  className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <input
                    className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out  px-8 py-3 shadow-lg text-gray-900 bg-blue-100 hover:bg-blue-200 w-full mb-4 sm:w-auto sm:mb-0"
                    placeholder="Try 'birthday' or 'congratulations'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <button
                    className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out  px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                    onClick={() => setSearch(query)}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>

            <div
              className="relative flex justify-center mb-8"
              data-aos="zoom-y-out"
              data-aos-delay="450"
            >
              <div className="flex flex-col justify-center">
                <div className="mx-auto">
                  <>
                    <div className="shadow-lg mb-2">
                      <div
                        //@ts-ignore
                        ref={outsideRef}
                      >
                        <div className="w-[900px] h-[450px] bg-white  ">
                          <div className="flex h-full">
                            {" "}
                            <p className="flex flex-1 text-center h-full justify-center items-center">
                              Made with ♥
                            </p>{" "}
                            <div className="flex-1">
                              {/* <img
                                  src={imageState ? imageState : "/foundry.jpg"}
                                /> */}
                              {/* <img src={result} /> */}

                              {prediction ? (
                                <div>
                                  {/* @ts-ignore */}
                                  {prediction.output && (
                                    <div>
                                      {/* @ts-ignore */}
                                      <img
                                        src={
                                          prediction.output[
                                            prediction.output.length - 1
                                          ]
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <img src="https://replicate.delivery/pbxt/LpvJ0TuN6CKOBFpMGnEvQiCqrJfspjdvLjfHqTMwMl0mnPRQA/out-0.png" />
                              )}
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-6 "
                        type="button"
                        onClick={handleDownloadCardOutside}
                      >
                        Download
                      </button>
                    </div>
                    <div className="shadow-lg mb-2">
                      <div
                        //@ts-ignore
                        ref={insideRef}
                      >
                        <div className="w-[900px] h-[450px] bg-white">
                          <div className="flex h-full">
                            {" "}
                            <div className="flex-1"></div>
                            <p className="flex flex-1 text-center h-full justify-center items-center mx-12">
                              {data.text}
                            </p>{" "}
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        className="font-medium inline-flex items-center justify-center border border-transparent rounded leading-snug transition duration-150 ease-in-out px-8 py-3 shadow-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto mb-6 "
                        type="button"
                        onClick={handleDownloadCardInside}
                      >
                        Download
                      </button>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
