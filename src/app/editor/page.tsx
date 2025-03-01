"use client";

import { Suspense, useState } from "react";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { PressRelease } from "../models/core";
import { useApi } from "../http/api";
import { toast } from "sonner";
import Tiptap from "../components/TipTap";
import { eventEmitter } from "../utils/eventEmitter";
import moment from "moment";
import Spinner from "../components/Spinner";
import { API_URL } from "../config";
import ShareModal from "../components/ShareModal";
import Aside from "../components/Aside";
import DeletePRModal from "../components/DeletePRModal";

export default function EditWithSuspense() {
  return (
    <Suspense fallback={<div></div>}>
      <Edit />
    </Suspense>
  );
}

const Edit = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pressId = searchParams.get("id");
  const [pressData, setPressData] = useState<PressRelease | null>(null);
  const {
    fetchPressRelease,
    previewPressRelease,
    downloadPressRelease,
    distributePressRelease,
  } = useApi();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    router.push("/");
  };
  const fetchData = async () => {
    try {
      const response = await fetchPressRelease(pressId!);
      setPressData(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching press release.");
    }
  };

  const fetchPreview = async () => {
    setPreview(true);
    try {
      const response = await previewPressRelease({ id: pressId });

      setPreview(false);
      const path = `${API_URL}${response.url}`;
      window.open(path, "_blank");
    } catch (error) {
      setPreview(false);
      toast.error("Failed to load preview. Try again.");
    }
  };

  const formattedDate = (value: string) => {
    return value ? moment(value).format("DD MMM, YYYY") : "-";
  };

  const handleShare = () => {
    eventEmitter.emit("openShareModal", pressId);
  };

  useEffect(() => {
    fetchData();

    eventEmitter.on("reloadData", fetchData);

    return () => {
      eventEmitter.off("reloadData", fetchData);
    };
  }, [pressId]);

  return (
    <div className="h-screen bg-[#F6F7F9]">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
          <Aside />
        </div>
<ShareModal />
        <div className="w-3/5 h-full p-2">
          <div className="bg-white h-full overflow-auto p-10 border border-gray-100 rounded-xl">
            <div className="  overflow-auto">
              <Tiptap
                content={pressData?.json_content!}
                editable={true}
                id={pressData?.id!}
              />
            </div>
          </div>
        </div>

        <div className="w-2/5 h-full p-2">
          <div className="bg-white h-full overflow-auto p-10 border border-gray-100 rounded-xl">
            <div className="grid grid-cols-3 gap-2  gap-y-3 rounded-md text-sm text-gray-500 ">
              <div className="flex flex-col gap-1">
                <p className="inline-flex text-gray-400 text-xs gap-1 items-center">
                  Created By
                </p>
                <p>Nick Langat</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="inline-flex text-xs text-gray-400 gap-1 items-center">
                  Created
                </p>
                <p>{formattedDate(pressData?.created_at!)}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="inline-flex text-xs text-gray-400 gap-1 items-center">
                  Updated
                </p>
                <p>{formattedDate(pressData?.updated_at!)}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="inline-flex text-xs text-gray-400 gap-1 items-center">
                  Client
                </p>
                <p>{pressData?.client}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="inline-flex text-xs text-gray-400  gap-1 items-center">
                  Country
                </p>
                <p>{pressData?.country}</p>
              </div>
              <div></div>

              <div className="flex col-span-3 gap-2">
                <button
                  onClick={fetchPreview}
                  className="bg-violet-500 hover:bg-violet-700 flex gap-2 items-center justify-center py-2 rounded-md text-sm w-full text-white"
                >
                  {preview ? (
                    <>
                      <Spinner className="text-violet-600" /> Loading...
                    </>
                  ) : (
                    <>Preview</>
                  )}
                </button>
                <DeletePRModal
                  pr={pressData}
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onSuccess={handleDeleteSuccess}
                />
                <button
                   onClick={() => handleDeleteClick()}
                  className="bg-rose-500 hover:bg-rose-600  text-white py-2 w-full rounded-md text-sm transition-all duration-500 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Shared with</p>
                <button
                  onClick={handleShare}
                  className="bg-sky-500 hover:bg-sky-600 transition-all duration-500 ease-in-out
                         text-white text-xs py-1 px-3 rounded-md"
                >
                  Share{" "}
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-5">
                {pressData?.shared_with.map((item) => (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="bg-teal-700 text-xs size-9 text-white rounded-full flex items-center justify-center">
                        {item.name[0]}
                      </span>
                      <div className="text-xs text-slate-500">
                        <p className="text-sm text-slate-600">{item.name}</p>
                        <p>{item.email} </p>
                      </div>
                    </div>
                    <span
                      className="py-1 px-3 rounded-md text-xs
                text-gray-500 bg-light-300 border border-gray-200"
                    >
                      Journalist
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
