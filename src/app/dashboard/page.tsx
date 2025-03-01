"use client";

import { Suspense, useState } from "react";

import { useEffect } from "react";
import { eventEmitter } from "../utils/eventEmitter";
import PRGenerationModal from "../components/GeneratePR";
import { PressRelease } from "../models/core";
import { useApi } from "../http/api";
import { toast } from "sonner";
import Spinner from "../components/Spinner";
import Aside from "../components/Aside";
import TipTapRenderer from "../components/TipTapRenderer";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function DashboardWithSuspense() {
  return (
    <Suspense fallback={<div></div>}>
      <Dashboard />
    </Suspense>
  );
}

const Dashboard = () => {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const { createPressRelease, fetchPressReleases } = useApi();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter()

  const openPressRelease = (press_release: PressRelease) => {
    eventEmitter.emit("openAIModal", press_release);
  };

  const fetchData = async () => {
    try {
      const response = await fetchPressReleases();
      setPressReleases(response);
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  const formattedDate = (value: string) => {
    return value ? moment(value).format("DD MMM, YYYY") : "-";
  };

  const viewPR = (id: string) => {
    const queryParams = new URLSearchParams({
      id: id || "",
    }).toString();
    const url = `/editor?${queryParams}`;
    router.push(url);
  };

  const addPressRelease = async () => {
    setProcessing(true);
    try {
      const response = await createPressRelease({});
      setProcessing(false);
      toast.success("Press release created successfully");
      openPressRelease(response);
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to create press release");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen text-slate-950 bg-light-400 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* <Aside/> */}
       
        <div className="flex-1  flex flex-col">
          <div className=" bg-white">
            <div className="p-5 mx-auto container  border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex gap-1 text-slate-700 text-2xl items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.7134 7.12811L4.46682 7.69379C4.28637 8.10792 3.71357 8.10792 3.53312 7.69379L3.28656 7.12811C2.84706 6.11947 2.05545 5.31641 1.06767 4.87708L0.308047 4.53922C-0.102682 4.35653 -0.102682 3.75881 0.308047 3.57612L1.0252 3.25714C2.03838 2.80651 2.84417 1.97373 3.27612 0.930828L3.52932 0.319534C3.70578 -0.106511 4.29417 -0.106511 4.47063 0.319534L4.72382 0.930828C5.15577 1.97373 5.96158 2.80651 6.9748 3.25714L7.69188 3.57612C8.10271 3.75881 8.10271 4.35653 7.69188 4.53922L6.93228 4.87708C5.94451 5.31641 5.15288 6.11947 4.7134 7.12811ZM3.06361 21.6132C4.08854 15.422 6.31105 1.99658 21 1.99658C19.5042 4.99658 18.5 6.49658 17.5 7.49658L16.5 8.49658L18 9.49658C17 12.4966 14 15.9966 10 16.4966C7.33146 16.8301 5.66421 18.6635 4.99824 21.9966H3C3.02074 21.8722 3.0419 21.7443 3.06361 21.6132Z"></path>
                </svg>
                <p>Wezawire</p>
              </div>
              <div className="text-sm flex gap-3 items-center text-slate-500">
                <a href="" className="py-1 px-4 rounded-md bg-light-300">
                  Dashboard
                </a>
                <a
                  href=""
                  className="py-1 px-4 rounded-md transition-all duration-500 ease-in-out hover:bg-light-300"
                >
                  Clients
                </a>
                <a
                  href=""
                  className="py-1 px-4 rounded-md transition-all duration-500 ease-in-out hover:bg-light-300"
                >
                  Journalists
                </a>
              </div>
              <div className="flex gap-5 text-sm text-slate-400 items-center">
                <div className="flex gap-2 items-center">
                  <span className="bg-light-300 text-slate-700 size-10 rounded-full flex items-center justify-center uppercase text-sm">
                    NI
                  </span>
                  <div className="text-sm text-slate-600">
                    <p>Nick Langat</p>
                    <p className="text-xs text-slate-400 truncate">
                      nick@prosoft.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 container mx-auto py-2 flex-1 overflow-y-auto">
            <div className="flex bg-white p-5 rounded-lg mt-5 justify-between items-center">
              <div>
                <p className="text-lg text-slate-600">Press Releases</p>
                <p className="text-sm text-slate-400">
                  Create and manage press releases from here.
                </p>
              </div>

              <div className="flex text-sm text-slate-500 gap-3 items-center">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 absolute top-2 left-3 text-slate-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search press releases by title or clients"
                    className="py-2 focus:ring-0 bg-light-300 focus:outline-none  placeholder:text-slate-400 border-0 pl-10 w-80 placeholder:font-light rounded-lg border-slate-100"
                  />
                </div>

                <button
                  onClick={addPressRelease}
                  className="px-4 bg-weza-600 flex items-center justify-center text-white text-sm py-2 hover:bg-weza-500
                   transition-all duration-700 ease-in-out w-full rounded-lg"
                >
                  {processing ? (
                    <>
                      <Spinner className="text-blue-600" /> Generating
                    </>
                  ) : (
                    <> New Press Release</>
                  )}
                </button>
              </div>
            </div>
            <div className="grid mt-10 grid-cols-3 gap-2">
              {pressReleases.map((item) => (
                <div onClick={()=>{viewPR(item.id)}} key={item.id} className="bg-light-300 cursor-pointer p-0.5 rounded-xl">
                  <div className="border bg-white rounded-xl border-slate-50">
                    <div className="h-56 ">
                      <div className="bg-light-200 rounded-t-xl relative mx-6 mt-7  h-56">
                        <span
                          className={`absolute py-1 px-4 rounded-full text-xs -top-5 -left-5 border
    ${
      item.is_published
        ? "bg-green-100 text-green-500 border-green-200"
        : "bg-blue-100 text-blue-500 border-blue-200"
    }`}
                        >
                          {item.is_published ? "Published" : "Draft"}
                        </span>

                        <div className="p-5">
                          <TipTapRenderer
                            content={item.json_content!}
                            threshold={80}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5 bg-white rounded-b-xl border-t border-slate-100">
                      <p className="text-slate-600 inline-flex gap-1 items-center mt-2 text-xs font-semibold">
                        {item.title}
                      </p>
                      <p className="text-slate-600 inline-flex gap-1 items-center mt-2 text-xs">
                        Nextflix
                      </p>
                      <div className="flex mt-1 text-xs text-slate-400 justify-between items-center">
                        <p>Created {formattedDate(item.created_at)}</p>
                        <p>Last edited {formattedDate(item.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
