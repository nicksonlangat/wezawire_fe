import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { useApi } from "../http/api";
import Spinner from "./Spinner";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function JournalistUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const { uploadJournalists } = useApi();

  // Sample data display
  const sampleData = [
    { email: "john@example.com", name: "John Smith", phone: "+12345678901", country: "USA", title: "Senior Reporter", media_house: "Daily News" },
    { email: "lisa@example.com", name: "Lisa Johnson", phone: "+44987654321", country: "UK", title: "Editor", media_house: "London Times" }
  ];

  function close() {
    setIsOpen(false);
    setFile(null);
    setFileName("");
  }

  function open() {
    setIsOpen(true);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      // Check if file is Excel
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadJournalists(formData);
      setProcessing(false);
      close();
      
      // Display summary of uploaded data
      toast.success(`${response.created} journalists created, ${response.updated} updated!`);
      
      // Show errors if any
      if (response.failed > 0) {
        toast.error(`${response.failed} entries failed to upload`);
      }
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to upload journalists data.");
    }
  };

  const downloadSampleTemplate = () => {
    // Sample data
    const sampleData = [
      { email: "john@example.com", name: "John Doe", phone: "123456789", country: "USA", title: "Editor", media_house: "NY Times" },
      { email: "jane@example.com", name: "Jane Smith", phone: "987654321", country: "UK", title: "Reporter", media_house: "BBC News" }
    ];
  
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData, { header: ["email", "name", "phone", "country", "title", "media_house"] });
  
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journalists");
  
    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "journalist_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <>
      <button onClick={open} className="px-4 bg-violet-500 flex items-center justify-center text-white text-sm py-2 hover:bg-violet-600 transition-all duration-700 ease-in-out rounded-lg">
        Upload Journalists
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
                <p className="text-lg font-medium text-slate-700">Upload Journalists Data</p>
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
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                  <p className="font-medium text-slate-700 mb-2">File Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Excel file (.xlsx or .xls)</li>
                    <li>Required columns: email (unique)</li>
                    <li>Optional columns: name, phone, country, title, media_house</li>
                  </ul>
                  <button 
                    onClick={downloadSampleTemplate}
                    className="mt-3 text-violet-600 text-xs font-medium hover:text-violet-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
                    </svg>
                    Download Sample Template
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                  {fileName ? (
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-green-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                          <path d="M14 3v5h5M9.9 17.1L9 15h2l-.9 2.1a.42.42 0 0 1-.8 0zM13 15l1.5 3.6a.8.8 0 0 0 1.5 0L17.5 15h-4.1z"></path>
                        </svg>
                        <span className="truncate max-w-[180px]">{fileName}</span>
                      </div>
                      <button 
                        onClick={() => {setFile(null); setFileName("");}}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center text-slate-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mb-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p className="font-medium">Click to upload Excel file</p>
                        <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                      </label>
                    </>
                  )}
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
                  disabled={processing || !file}
                  className={`px-4 py-2 text-sm bg-violet-500 text-white rounded-lg transition-all duration-300 flex items-center ${!file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-600'}`}
                >
                  {processing ? (
                    <>
                      <Spinner className="mr-2" /> Uploading...
                    </>
                  ) : (
                    "Upload Journalists"
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