import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";
import { useRouter } from "next/navigation";

import Spinner from "./Spinner";
import { toast } from "sonner";

export default function DeletionModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [objectID, setObjectID] = useState("");
  const [type, setType] = useState("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const { deletePressRelease } = useApi();

  function close() {
    setIsOpen(false);
  }

  const handleDelete = () => {
    setProcessing(true);
    return type == "press_release" ? removePressRelease() : null;
  };

  const removePressRelease = async () => {
    
    try {
      const response = await deletePressRelease(objectID);
      setProcessing(false);
      close();
      router.push("/dashboard");
      eventEmitter.emit("reloadPressReleases");
    } catch (error) {
      setProcessing(false);
      close();
      toast.error("Failed to delete press release.");
    }
  };

  useEffect(() => {
    const openModalListener = (data: { id: string; type: string }) => {
      setType(data.type);
      setObjectID(data.id);
      setIsOpen(true);
    };

    eventEmitter.on<{ id: string; type: string }>(
      "openDeleteModal",
      openModalListener
    );

    return () => {
      eventEmitter.off("openDeleteModal", openModalListener);
    };
  }, []);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 bg-black/40 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full text-slate-500 text-sm max-w-md rounded-lg bg-white p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex justify-between">
                <p className="text-lg text-slate-700">Are you sure?</p>
                <button
                  onClick={close}
                  className="text-xs size-8 hover:bg-slate-100 rounded-md flex items-center justify-center hover:text-slate-800 transition-all duration-500 ease-in-out text-slate-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                  </svg>
                </button>
              </div>
              <div className="mt-3">
                <p>
                  Are you sure you want to delete this{" "}
                  <span className="font-semibold">{type}</span>
                </p>
                <p>
                  Related data will be removed. This action cannot be undone.
                </p>
              </div>
              <div className="flex mt-3 justify-end items-center">
                <button
                  onClick={handleDelete}
                  className="text-sm bg-rose-500 hover:bg-rose-600 transition-all duration-700 ease-in-out px-4 rounded-md flex items-center justify-center gap-2 py-1.5 text-white"
                >
                  {processing ? (
                    <>
                      {" "}
                      <Spinner /> Deleting...
                    </>
                  ) : (
                    <>Yes, I'm sure</>
                  )}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
