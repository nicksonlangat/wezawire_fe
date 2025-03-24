import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Client, PressRelease } from "../models/core";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";
import { useRouter } from "next/navigation";
import Tiptap from "./TipTap";
import Spinner from "./Spinner";
import { toast } from "sonner";

// Define a Partner interface
interface Partner {
  id: string;
  name: string;
  image: File | null;
}

export default function PRGenerationModal() {
  let [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [partners, setPartners] = useState<Partner[]>([{ id: crypto.randomUUID(), name: "", image: null }]);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [country, setCountry] = useState("Kenya");
  const [loading, setLoading] = useState(false);
  const [pressData, setPressData] = useState<PressRelease | null>(null);
  const { fetchClients, generatePressRelease } = useApi();
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

  const fetchAllClients = async () => {
    try {
      const response = await fetchClients(currentPage, searchQuery);
      setClients(response.results);
      setClient(response.results[0].name);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.log("Error fetching clients", error);
    }
  };

  // Handle adding a new partner
  const addPartner = () => {
    setPartners([...partners, { id: crypto.randomUUID(), name: "", image: null }]);
  };

  // Handle removing a partner
  const removePartner = (partnerId: string) => {
    if (partners.length > 1) {
      setPartners(partners.filter(partner => partner.id !== partnerId));
    } else {
      toast.error("You need at least one partner");
    }
  };

  // Handle partner name change
  const handlePartnerNameChange = (partnerId: string, newName: string) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? { ...partner, name: newName } : partner
    ));
  };

  // Handle partner image change
  const handlePartnerImageChange = (partnerId: string, newImage: File | null) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? { ...partner, image: newImage } : partner
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    
    if (file) {
      formData.append("file", file);
    }
    
    formData.append("prompt", prompt);
    formData.append("id", pressData?.id || "");
    formData.append("client", client);
    formData.append("country", country);
    
    // Add partners data to formData
    partners.forEach((partner, index) => {
      formData.append(`partners[${index}][name]`, partner.name);
      if (partner.image) {
        formData.append(`partners[${index}][image]`, partner.image);
      }
    });

    try {
      const response = await generatePressRelease(formData);
      setLoading(false);
      setPressData(response);
      eventEmitter.emit("saveContent");
    } catch (error) {
      setLoading(false);
      close();
      toast.error("Error generating press release");
    }
  };

  const viewPR = (id: string) => {
    const queryParams = new URLSearchParams({
      id: id || "",
    }).toString();
    const url = `/editor?${queryParams}`;
    router.push(url);
  };

  useEffect(() => {
    const openModalListener = (press_release: PressRelease) => {
      setPressData(press_release);
      setIsOpen(true);
      fetchAllClients();
    };

    eventEmitter.on<PressRelease>("openAIModal", openModalListener);

    return () => {
      eventEmitter.off("openAIModal", openModalListener);
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
        <div className="fixed inset-0 z-10 bg-black/60 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              transition
              className="w-full text-slate-500 text-sm max-w-5xl rounded-xl bg-transparent backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex gap-2">
                <div className="bg-white rounded-xl w-3/4 p-4">
                  <div className="flex text-xl text-slate-700 justify-between items-center">
                    <p>Press Release</p>

                    <button
                      onClick={() => {
                        viewPR(pressData?.id!);
                      }}
                      className="text-violet-600 text-lg hover:text-violet-700 transition-all duration-500 ease-in-out"
                    >
                      View in editor
                    </button>
                  </div>

                  <div className="overflow-auto h-[40em] mt-5 bg-[#f8f8f8] rounded-lg p-2">
                    <div className="bg-white p-5 rounded-lg">
                      <Tiptap
                        content={pressData?.content!}
                        editable={true}
                        id={pressData?.id!}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-1/2 bg-white rounded-xl p-4 overflow-y-auto max-h-[45em]">
                  <div className="flex justify-between">
                    <h1 className="bg-gradient-to-r text-xl font-semibold flex gap-2 items-center from-blue-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">
                      <svg
                        viewBox="0 0 576 512"
                        fill="currentColor"
                        className="size-5 text-pink-500"
                      >
                        <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM461.4 48L496 82.6 386.2 192.3l-34.6-34.6L461.4 48zM80 429.4L317.7 191.7l34.6 34.6L114.6 464 80 429.4zM427.4 14.1L46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"></path>
                      </svg>
                      AI Assistant
                    </h1>
                    <button onClick={close} className="text-xs text-gray-400">
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
                  <div className="mt-5">
                    <label htmlFor="">What is the press release about?</label>
                    <textarea
                      rows={5}
                      placeholder="Tell AI what to do..."
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="bg-[#f8f8f8] placeholder:text-gray-400
                      text-gray-500 py-2 focus:ring-0 focus:outline-none
                       focus:border-gray-200 mt-2 border border-gray-200 p-3 rounded-lg resize-none w-full"
                    ></textarea>

                    <div className="p-2 text-xs border border-blue-300 text-blue-500 bg-blue-50 rounded-lg mt-2">
                      <span className="font-semibold">Pro tip:</span> <br />{" "}
                      Include key points, your target audience and your desired
                      outcome for this press release.
                    </div>
                  </div>
                  <div className="flex mt-5 flex-col gap-2">
                    <div className="flex flex-col text-gray-400 text-sm items-center gap-2">
                      <div className="flex w-full flex-col">
                        <label htmlFor="" className="text-gray-500">
                          Client
                        </label>

                        <select
                          id="client"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          className="bg-[#f8f8f8] placeholder:text-gray-400
                          text-gray-500 py-2 focus:ring-0 focus:outline-none
                           focus:border-gray-200 mt-2 border border-gray-200 p-3 rounded-lg resize-none w-full"
                        >
                          {clients.map((client) => (
                            <option key={client.id} value={client.name}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Partner Entities Section */}
                      <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between">
                          <label htmlFor="" className="text-gray-500">
                            Partner Entities
                          </label>
                          <button 
                            onClick={addPartner}
                            className="text-violet-600 text-xs hover:text-violet-700 transition-all duration-500 ease-in-out flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            Add Partner
                          </button>
                        </div>
                        
                        {partners.map((partner, index) => (
                          <div key={partner.id} className="mt-2 p-3 border border-gray-200 rounded-lg bg-[#f8f8f8]">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-gray-500">Partner {index + 1}</span>
                              {partners.length > 1 && (
                                <button 
                                  onClick={() => removePartner(partner.id)}
                                  className="text-red-500 text-xs hover:text-red-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                  </svg>
                                </button>
                              )}
                            </div>
                            
                            <input
                              value={partner.name}
                              onChange={(e) => handlePartnerNameChange(partner.id, e.target.value)}
                              placeholder="Partner name"
                              className="bg-white placeholder:text-gray-400
                              text-gray-500 py-2 focus:ring-0 focus:outline-none
                              focus:border-gray-200 border border-gray-200 p-2 rounded-lg w-full mb-2"
                            />
                            
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => 
                                  handlePartnerImageChange(partner.id, e.target.files ? e.target.files[0] : null)
                                }
                                className="
                                border border-gray-200 w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 bg-white
                                file:text-xs file:bg-violet-500 file:text-white
                                hover:file:bg-primary/90 cursor-pointer
                                pl-2 py-1 rounded-lg focus:ring-0 focus:outline-none text-xs"
                              />
                              {partner.image && (
                                <div className="text-xs text-green-500 flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                  </svg>
                                  Uploaded
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex w-full flex-col">
                        <label htmlFor="" className="text-gray-500">
                          Country
                        </label>
                        <select
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="bg-[#f8f8f8] placeholder:text-gray-400
                           text-gray-500 py-2 focus:ring-0 focus:outline-none
                            focus:border-gray-200 mt-2 border border-gray-200 p-3 rounded-lg resize-none w-full"
                        >
                          {countries.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex w-full text-base-100 text-sm flex-col">
                        <label htmlFor="logo" className="text-gray-500 mb-1">
                          Template Sample
                        </label>
                        <input
                          type="file"
                          id="file"
                          onChange={(e) =>
                            setFile(e.target.files ? e.target.files[0] : null)
                          }
                          className="
                          border border-gray-200 w-full file:mr-4 file:py-1.5 file:px-2 file:rounded-full file:border-0 bg-[#f8f8f8]
                          file:text-sm file:bg-violet-500 file:text-white
                          hover:file:bg-primary/90 cursor-pointer
                          pl-4 py-1 rounded-lg focus:ring-0 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <button
                        onClick={handleSubmit}
                        className="text-sm mt-2 w-full flex gap-2 items-center justify-center
                         bg-violet-600 hover:bg-violet-700 transition-all duration-700 ease-in-out px-4 rounded-lg py-2 text-white"
                      >
                        {loading ? (
                          <>
                            <Spinner className="text-violet-600" /> Generating
                            Press Release...
                          </>
                        ) : (
                          <>
                            <svg
                              viewBox="0 0 576 512"
                              fill="currentColor"
                              className="size-4"
                            >
                              <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM461.4 48L496 82.6 386.2 192.3l-34.6-34.6L461.4 48zM80 429.4L317.7 191.7l34.6 34.6L114.6 464 80 429.4zM427.4 14.1L46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"></path>
                            </svg>
                            Generate Press Release
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}