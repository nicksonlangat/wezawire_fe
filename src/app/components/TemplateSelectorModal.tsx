"use client";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";
import Spinner from "./Spinner";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  content: string;
  type: 'standard' | 'partnership' | 'product-launch' | 'award' | 'event';
}

export default function TemplateSelectorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const { createPressRelease } = useApi();

  function close() {
    setIsOpen(false);
    setSelectedTemplate(null);
  }

  // Sample templates - in a real app these would come from your API
  useEffect(() => {
    const loadTemplates = () => {
      setIsLoading(true);
      // Simulating API fetch
      setTimeout(() => {
        const sampleTemplates: Template[] = [
        //   {
        //     id: "template-1",
        //     title: "Standard Press Release",
        //     description: "A traditional press release template suitable for general announcements",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] Announces [News]\n\n[City, Country] - [Date] - [Company Name], [brief company description], today announced [news]...",
        //     type: 'standard'
        //   },
        //   {
        //     id: "template-2",
        //     title: "Partnership Announcement",
        //     description: "Perfect for announcing new partnerships or collaborations",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] Partners with [Partner Name] to [Objective]\n\n[City, Country] - [Date] - [Company Name] and [Partner Name] today announced a strategic partnership to [partnership details]...",
        //     type: 'partnership'
        //   },
        //   {
        //     id: "template-3",
        //     title: "Product Launch",
        //     description: "Announce a new product or service launch",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] Launches [Product/Service Name]\n\n[City, Country] - [Date] - [Company Name] today announced the launch of [Product/Service Name], [product description]...",
        //     type: 'product-launch'
        //   },
        //   {
        //     id: "template-4",
        //     title: "Award or Recognition",
        //     description: "Announce an award or industry recognition",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] Receives [Award Name]\n\n[City, Country] - [Date] - [Company Name] today announced it has been recognized with [Award Name] for [achievement]...",
        //     type: 'award'
        //   },
        //   {
        //     id: "template-5",
        //     title: "Event Announcement",
        //     description: "Announce an upcoming event or conference",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] to Host [Event Name]\n\n[City, Country] - [Date] - [Company Name] today announced it will host [Event Name], [event description]...",
        //     type: 'event'
        //   },
        //   {
        //     id: "template-6",
        //     title: "Market Expansion",
        //     description: "Announce expansion into new markets or regions",
        //     previewImage: "/api/placeholder/300/200",
        //     content: "# [Company Name] Expands Operations to [New Region/Market]\n\n[City, Country] - [Date] - [Company Name] today announced its expansion into [New Region/Market]...",
        //     type: 'standard'
        //   }

        {
            id: "template-1",
            title: "Standard Press Release",
            description: "A traditional press release template suitable for general announcements",
            previewImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] Announces [News]\n\n[City, Country] - [Date] - [Company Name], [brief company description], today announced [news]...",
            type: 'standard'
          },
          {
            id: "template-2",
            title: "Partnership Announcement",
            description: "Perfect for announcing new partnerships or collaborations",
            previewImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] Partners with [Partner Name] to [Objective]\n\n[City, Country] - [Date] - [Company Name] and [Partner Name] today announced a strategic partnership to [partnership details]...",
            type: 'partnership'
          },
          {
            id: "template-3",
            title: "Product Launch",
            description: "Announce a new product or service launch",
            previewImage: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] Launches [Product/Service Name]\n\n[City, Country] - [Date] - [Company Name] today announced the launch of [Product/Service Name], [product description]...",
            type: 'product-launch'
          },
          {
            id: "template-4",
            title: "Award or Recognition",
            description: "Announce an award or industry recognition",
            previewImage: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=3019&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] Receives [Award Name]\n\n[City, Country] - [Date] - [Company Name] today announced it has been recognized with [Award Name] for [achievement]...",
            type: 'award'
          },
          {
            id: "template-5",
            title: "Event Announcement",
            description: "Announce an upcoming event or conference",
            previewImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] to Host [Event Name]\n\n[City, Country] - [Date] - [Company Name] today announced it will host [Event Name], [event description]...",
            type: 'event'
          },
          {
            id: "template-6",
            title: "Market Expansion",
            description: "Announce expansion into new markets or regions",
            previewImage: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            content: "# [Company Name] Expands Operations to [New Region/Market]\n\n[City, Country] - [Date] - [Company Name] today announced its expansion into [New Region/Market]...",
            type: 'standard'
          },
        ];
        
        setTemplates(sampleTemplates);
        setIsLoading(false);
      }, 800);
    };

    // Only load templates when modal is open
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    const openModalListener = () => {
      setIsOpen(true);
    };

    eventEmitter.on("openTemplateSelector", openModalListener);

    return () => {
      eventEmitter.off("openTemplateSelector", openModalListener);
    };
  }, []);

  const filteredTemplates = filterType === 'all' 
    ? templates 
    : templates.filter(template => template.type === filterType);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    setProcessing(true);
    try {
      // Find the selected template
      const template = templates.find(t => t.id === selectedTemplate);
      
      // In a real implementation, pass the template content to your API
      const response = await createPressRelease({
        content: template?.content || "",
        templateId: selectedTemplate
      });
      
      setProcessing(false);
      toast.success("Press release created from template");
      
      // Close template selector
      close();
      
      // Open the press release in your AI modal
      eventEmitter.emit("openAIModal", response);
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to create press release from template");
    }
  };

  return (
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
            className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-xl text-gray-700 flex items-center gap-2">
                <span className="bg-violet-500 rounded-md flex items-center justify-center size-7 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 2V22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H8ZM20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H10V2H20.0049Z"></path>
                  </svg>
                </span>
                Select a Template
              </h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-500">
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

            <div className="mt-4 flex justify-end">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2 px-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-0 text-gray-600"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="partnership">Partnership</option>
                <option value="product-launch">Product Launch</option>
                <option value="award">Award</option>
                <option value="event">Event</option>
              </select>
            </div>

            {isLoading ? (
              <div className="my-20 flex justify-center">
                <Spinner className="text-violet-600 size-10" />
              </div>
            ) : (
              <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
                        selectedTemplate === template.id
                          ? "border-violet-500 ring-2 ring-violet-200"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <div className="relative h-40 bg-gray-100">
                        <img
                          src={template.previewImage}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-white py-1 px-2 rounded-full text-xs text-gray-600 capitalize">
                            {template.type.replace('-', ' ')}
                          </span>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="absolute top-0 left-0 w-full h-full bg-violet-500 bg-opacity-20 flex items-center justify-center">
                            <span className="bg-white rounded-full p-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5"></path>
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800">{template.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={close}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFromTemplate}
                  disabled={!selectedTemplate || processing}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    !selectedTemplate
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-violet-500 text-white hover:bg-violet-600 transition-all duration-700 ease-in-out"
                  }`}
                >
                  {processing ? (
                    <>
                      <Spinner className="text-white" /> Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                      </svg>
                      Create from Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}