import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { useApi } from "../http/api";
import Spinner from "./Spinner";
import { toast } from "sonner";
import { PressRelease } from "../models/core";

interface DeleteModalProps {
  pr: PressRelease | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (deletedClientId: string) => void;
}

export default function DeleteClientModal({
  pr,
  isOpen,
  onClose,
  onSuccess,
}: DeleteModalProps) {
  const [processing, setProcessing] = useState(false);
  const { deletePressRelease } = useApi();

  const handleDelete = async () => {
    if (!pr) return;

    setProcessing(true);
    try {
      await deletePressRelease(pr.id);
      setProcessing(false);
      onClose();
      if (onSuccess) {
        onSuccess(pr.id);
      }
      toast.success("Item deleted successfully!");
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to delete item.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 bg-black/10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full text-slate-500 text-sm max-w-md rounded-lg bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-medium text-slate-700">Delete Item</p>
              <button
                onClick={onClose}
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

            <div className="mb-6">
              <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8 text-red-500 mx-auto mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-center font-medium text-red-700">
                  Are you sure you want to delete this item?
                </p>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                All data associated with this item will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={processing}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center"
              >
                {processing ? (
                  <>
                    <Spinner className="mr-2" /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
