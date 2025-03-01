import { Dialog, DialogPanel } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useApi } from "../http/api";
import Spinner from "./Spinner";
import { toast } from "sonner";
import { Journalist } from "../models/core";


// Define the props interface
interface EditModalProps {
  journalist: Journalist | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedJournalist: Journalist) => void;
}

export default function EditJournalistModal({
  journalist,
  isOpen,
  onClose,
  onSuccess,
}: EditModalProps) {
  const [processing, setProcessing] = useState(false);
  const { updateJournalist } = useApi();

  // Form state
  const [journalistData, setJournalistData] = useState<Omit<Journalist, "id">>({
    name: "",
    email: "",
    phone: "",
    country: "",
    media_house: "",
    title: ""
  });

  // Countries list
  const countries: string[] = [
    "Kenya",
    "Nigeria",
    "Zambia",
    "Ghana",
    "South Africa",
    "Burundi",
    "Rwanda",
    "Uganda",
    "Tanzania",
  ];

  
  useEffect(() => {
    if (journalist && isOpen) {
      setJournalistData({
        name: journalist.name || "",
        email: journalist.email || "",
        phone: journalist.phone || "",
        country: journalist.country || "",
       title: journalist.title || "",
        media_house: journalist.media_house || "",
      });
    }
  }, [journalist, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJournalistData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!journalist) return;

    setProcessing(true);
    try {
      const response = await updateJournalist(journalist.id, journalistData);
      setProcessing(false);
      onClose();
      if (onSuccess) {
        onSuccess(response);
      }
      toast.success("Journalist updated successfully!");
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to update journalist.");
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
              <p className="text-lg font-medium text-slate-700">Edit Journalist</p>
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

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={journalistData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Enter name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="edit-email"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={journalistData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="edit-phone"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="edit-phone"
                  name="phone"
                  value={journalistData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Country Field */}
              <div>
                <label
                  htmlFor="edit-country"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Country
                </label>
                <select
                  id="edit-country"
                  name="country"
                  value={journalistData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={journalistData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-media-house"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Media House
                </label>
                <input
                  type="text"
                  id="edit-media-house"
                  name="media_house"
                  value={journalistData.media_house}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Enter media house"
                />
              </div>

             
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all duration-300 flex items-center"
              >
                {processing ? (
                  <>
                    <Spinner className="mr-2" /> Updating...
                  </>
                ) : (
                  "Update Client"
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
