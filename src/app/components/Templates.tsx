"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";
import Spinner from "./Spinner";

// Define the template interface
interface Template {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  content: string;
  type: 'standard' | 'partnership' | 'product-launch' | 'award' | 'event';
}

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('all');
  const { createPressRelease } = useApi();

  // Sample templates - in a real app these would come from your API
  useEffect(() => {
    // Simulating API fetch
    setIsLoading(true);
    setTimeout(() => {
      const sampleTemplates: Template[] = [
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
        {
          id: "template-7",
          title: "Executive Appointment",
          description: "Announce new executive leadership appointment",
          previewImage: "https://images.unsplash.com/photo-1541844053589-346841d0b34c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: "# [Company Name] Appoints [Executive Name] as [Position]\n\n[City, Country] - [Date] - [Company Name] today announced the appointment of [Executive Name] as [Position]...",
          type: 'standard'
        },
        {
          id: "template-8",
          title: "Joint Venture",
          description: "Announce a new joint venture between multiple organizations",
          previewImage: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: "# [Company Name] and [Partner Company] Launch Joint Venture for [Purpose]\n\n[City, Country] - [Date] - [Company Name] and [Partner Company] today announced a new joint venture to [purpose]...",
          type: 'partnership'
        }
      ];
      
      setTemplates(sampleTemplates);
      setIsLoading(false);
      setTotalPages(Math.ceil(sampleTemplates.length / 6));
    }, 800);
  }, []);

  const filteredTemplates = filterType === 'all' 
    ? templates 
    : templates.filter(template => template.type === filterType);

  // Templates for current page
  const currentTemplates = filteredTemplates.slice((currentPage - 1) * 6, currentPage * 6);

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
      
      // Open the press release in your AI modal
      eventEmitter.emit("openAIModal", response);
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to create press release from template");
    }
  };

  return (
    <div className="bg-white h-full overflow-auto p-10 border border-gray-100 rounded-xl">
      <p className="text-lg text-gray-500">
        {(() => {
          const hour = new Date().getHours();
          if (hour < 12) {
            return "Good morning,";
          } else if (hour < 18) {
            return "Good afternoon,";
          } else {
            return "Good evening,";
          }
        })()}{" "}
        <span className="text-gray-800">Choose a template</span>
      </p>

      <div className="flex mt-5 justify-between items-center">
        <p className="flex gap-2 items-center text-xl text-gray-700">
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
          Press Release Templates
        </p>
        <div className="flex gap-2 items-center">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-0 text-gray-600"
          >
            <option value="all">All Templates</option>
            <option value="standard">Standard</option>
            <option value="partnership">Partnership</option>
            <option value="product-launch">Product Launch</option>
            <option value="award">Award</option>
            <option value="event">Event</option>
          </select>

          <div className=" flex justify-end">
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
      </div>

      {isLoading ? (
        <div className="mt-20 flex justify-center">
          <Spinner className="text-violet-600 size-10" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {currentTemplates.map((template) => (
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

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Page {currentPage} of {Math.max(1, Math.ceil(filteredTemplates.length / 6))}
              </p>
            </div>
            <div className="flex text-gray-500 text-sm gap-2">
              <button
                className="border border-violet-500 text-violet-500 px-3 py-1 rounded-lg 
                  hover:bg-violet-500 transition-all duration-500 ease-out hover:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <button
                className="border border-violet-500 text-violet-500 px-3 py-1 rounded-lg 
                  hover:bg-violet-500 transition-all duration-500 ease-out hover:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredTemplates.length / 6)))}
                disabled={currentPage === Math.ceil(filteredTemplates.length / 6)}
              >
                Next
              </button>
            </div>
          </div>

         
        </>
      )}
    </div>
  );
}