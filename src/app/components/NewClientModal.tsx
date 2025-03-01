import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { useApi } from "../http/api";
import Spinner from "./Spinner";
import { toast } from "sonner";

export default function NewClientModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { addClient } = useApi();
  
  // Form state
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    website: "",
    description: ""
  });

  // Countries list
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

  function open() {
    setIsOpen(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      const response = await addClient(clientData);
      setProcessing(false);
      resetForm();
      close();
      toast.success("Client added successfully!");
    } catch (error) {
      setProcessing(false);
      close();
      toast.error("Failed to add client.");
    }
  };

  const resetForm = () => {
    setClientData({
      name: "",
      email: "",
      phone: "",
      country: "",
      website: "",
      description: ""
    });
  };

  return (
    <>
      <button onClick={open} className="px-4 bg-violet-500 flex items-center justify-center text-white text-sm py-2 hover:bg-violet-600 transition-all duration-700 ease-in-out rounded-lg">
        Add New Client
      </button>
      
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
              className="w-full text-slate-500 text-sm max-w-md rounded-lg bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-medium text-slate-700">Add New Client</p>
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
              
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={clientData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-50 border
                     border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter client name"
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={clientData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                {/* Country Field */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-600 mb-1">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={clientData.country}
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
                
                {/* Website Field */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-slate-600 mb-1">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={clientData.website}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter website URL"
                  />
                </div>
                
                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={clientData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Enter client description"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={close}
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
                      <Spinner className="mr-2" /> Adding...
                    </>
                  ) : (
                    "Add Client"
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