import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";

import Spinner from "./Spinner";
import { toast } from "sonner";
import { Journalist } from "../models/core";

export default function ShareModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [objectID, setObjectID] = useState("");
  const [processing, setProcessing] = useState(false);
  const { distributePressRelease, fetchJournalists } = useApi();
  const [item, setItem] = useState("Recipients");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [emailMessage, setEmailMessage] = useState("");

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const items = ["Recipients", "Countries", "Message"];
  const countries = [
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

  function close() {
    setIsOpen(false);
  }

  const fetchRecipients = async () => {
    const data = await fetchJournalists(currentPage, searchQuery);
      if (data) {
        setJournalists(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      }
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(
      (prev) =>
        prev.includes(country)
          ? prev.filter((c) => c !== country) // Remove if already selected
          : [...prev, country] // Add if not selected
    );
  };

  const toggleRecipient = (email: string) => {
    setSelectedRecipients(
      (prev) =>
        prev.includes(email)
          ? prev.filter((recipient) => recipient !== email) // Remove if already selected
          : [...prev, email] // Add if not selected
    );
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      const response = await distributePressRelease({
        journalists: selectedRecipients,
        countries: selectedCountries,
        id: objectID,
        message: emailMessage,
      });
      setProcessing(false);
      setSelectedRecipients([]);
      setSelectedCountries([]);
      setEmailMessage("");
      setObjectID("");
      close();
      eventEmitter.emit("reloadData");
      toast.success("Press release has been sent via email.");
      
    } catch (error) {
      setProcessing(false);
      setSelectedRecipients([]);
      setSelectedCountries([]);
      setEmailMessage("");
      setObjectID("");
      close();
      toast.error("Failed to send press release.");
    }
  };

  useEffect(() => {
    const openModalListener = (id: string) => {
      setObjectID(id);
      setIsOpen(true);
     
    };

    fetchRecipients();

    eventEmitter.on<string>("openShareModal", openModalListener);

    return () => {
      eventEmitter.off("openShareModal", openModalListener);
    };
  }, [currentPage, searchQuery]);

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 bg-black/60 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full text-slate-500 text-sm max-w-md rounded-lg bg-white p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex justify-between">
                <p className="text-lg text-slate-700">Distribute</p>
                <button
                  onClick={close}
                  className="text-xs size-8 hover:bg-light-400 rounded-md flex items-center justify-center hover:text-slate-800 transition-all duration-500 ease-in-out text-slate-400"
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
              <div>
                <div className="mt-2 grid grid-cols-3 gap-2 bg-gray-200 p-0.5 rounded-lg text-gray-500">
                  {items.map((i) => (
                    <button
                      className={`py-1 rounded hover:bg-white hover:text-slate-500 transition-all duration-500 ease-in-out  flex items-center justify-center ${
                        item == i ? "bg-white text-slate-500" : ""
                      }`}
                      onClick={() => {
                        setItem(i);
                      }}
                      key={i}
                    >
                      {i}
                    </button>
                  ))}
                </div>

                {item == items[0] && (
                  <> 
                  <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search by name, email, country"
                  className="py-1.5  w-full mt-2 placeholder:text-gray-400
                
                text-sm  pl-4 focus:ring-1 focus:ring-violet-500 focus:outline-none text-gray-600 rounded-lg border border-gray-200"
                />
                  <div className="grid  grid-cols-2 text-start mt-5 gap-2 gap-y-3 ">
                    {journalists.map((item) => (
                      <button
                        key={item.email}
                        className={`py-1 border text-gray-500 border-gray-200 rounded-lg ${
                          selectedRecipients.includes(item.email)
                            ? "bg-violet-500 text-white"
                            : "bg-white"
                        }`}
                        onClick={() => toggleRecipient(item.email)}
                      >
                        {item.name || item.email}
                      </button>
                    ))}
                  </div>
                  </>
                )}
                {item == items[1] && (
                  <div className="grid grid-cols-4 text-start mt-5 gap-2 gap-y-3 ">
                    {countries.map((item) => (
                      <button
                      key={item}
                        className={`py-1  border border-slate-200 rounded-lg ${
                          selectedCountries.includes(item)
                            ? "bg-light-400"
                            : "bg-white"
                        }`}
                        onClick={() => toggleCountry(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {item == items[2] && (
                  <div className="mt-5">
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Enter email message"
                      className="border border-gray-200 focus:outline-none focus:ring-1 focus:ring-violet-500 w-full resize-none rounded-lg p-3"
                    ></textarea>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="bg-violet-500 text-white hover:bg-violet-600
                   transition-all duration-500 ease-in-out py-2 px-6 text-sm flex gap-2 items-center justify-center rounded-lg"
                  >
                    {processing ? (
                      <>
                        <Spinner className="text-violet-600" /> Sending...
                      </>
                    ) : (
                      <>Send Emails</>
                    )}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
