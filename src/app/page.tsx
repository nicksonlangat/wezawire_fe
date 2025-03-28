"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PressRelease } from "./models/core";
import { useApi } from "./http/api";
import { eventEmitter } from "./utils/eventEmitter";
import PRGenerationModal from "./components/GeneratePR";
import Aside from "./components/Aside";
import DeletePRModal from "./components/DeletePRModal";

export default function Home() {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const { createPressRelease, fetchPressReleases } = useApi();

  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const [selectedItem, setSelectedItem] = useState<PressRelease | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  

  const handleDeleteClick = (pr: PressRelease) => {
    setSelectedItem(pr);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    // Remove the deleted client from the list
    setPressReleases(pressReleases.filter((item) => item.id !== deletedId));
  };

  const openPressRelease = (press_release: PressRelease) => {
    eventEmitter.emit("openAIModal", press_release);
  };

  const viewPR = (id: string) => {
    const queryParams = new URLSearchParams({
      id: id || "",
    }).toString();
    const url = `/editor?${queryParams}`;
    router.push(url);
  };

  const addPressRelease = async () => {
    setProcessing(true);
    try {
      const response = await createPressRelease({});
      setProcessing(false);
      toast.success("Press release created successfully");
      openPressRelease(response);
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to create press release");
    }
  };

  
  

  useEffect(() => {


    // Check if authentication data exists in localStorage
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    setUserData(userData);
    if (!accessToken || !userData) {
      // If either token or user data is missing, redirect to login
      router.push("/login");
      return;
    }

    // Optional: You could also verify if the token is valid or expired
    // by making a request to your backend

    setIsLoading(false);

    
    const getData = async () => {
      const data = await fetchPressReleases(currentPage, searchQuery);
      if (data) {
        setPressReleases(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      }
    };
    getData();
  }, [currentPage, searchQuery]);

  return (
    <div className="h-screen bg-[#F6F7F9]">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
          <Aside />
        </div>
        <PRGenerationModal />
        <div className="w-4/5 h-full p-2">
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
              <span className="text-gray-800">Welcome back</span>
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
                    <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 6V10H11V6H7ZM7 12V14H17V12H7ZM7 16V18H17V16H7ZM13 7V9H17V7H13Z"></path>
                  </svg>
                </span>
                Press Releases
              </p>
              <div className="flex gap-2 items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search by title"
                  className="py-2  placeholder:text-gray-400
                    
                    text-sm w-64 pl-4 focus:ring-0
                     focus:outline-none text-gray-600 rounded-lg border border-gray-200"
                />

                <button
                  onClick={addPressRelease}
                  className="px-4 bg-violet-500 flex items-center justify-center text-white text-sm py-2 hover:bg-violet-600 transition-all duration-700 ease-in-out rounded-lg"
                >
                  New Press Release
                </button>
              </div>
            </div>

            <div className="mt-5 bg-gray-100 p-1 rounded-lg">
              <div>
                <div className="relative overflow-x-auto rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-gray-400 border-b border-gray-100 uppercase bg-white">
                      <tr>
                        <th scope="col" className="px-6 font-normal py-3">
                          name
                        </th>
                        <th scope="col" className="px-6 font-normal py-3">
                          email
                        </th>

                        <th scope="col" className="px-6 font-normal py-3">
                          action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pressReleases.map((item) => (
                        <tr
                          className="bg-white last:border-0
                         text-gray-500 text-sm border-b
                          border-slate-100"
                        >
                          <th
                            scope="row"
                            className="px-6 py-3 flex items-center gap-2  font-normal"
                          >
                            {item.title}
                          </th>
                          <td className="px-6 py-4">
                            <div>
                              <p className="">{item.client}</p>
                            </div>
                          </td>

                          <td className="px-6 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => viewPR(item.id)}
                                className="text-xs border border-slate-100 py-1 px-3 rounded-md flex gap-1 items-center "
                              >
                                Edit
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-3.5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                                </svg>
                              </button>

                              <DeletePRModal
                                pr={selectedItem}
                                isOpen={isDeleteModalOpen}
                                onClose={() => setIsDeleteModalOpen(false)}
                                onSuccess={handleDeleteSuccess}
                              />
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="text-xs border border-slate-100 py-1 px-3 rounded-md flex gap-1 items-center "
                              >
                                Delete
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-3.5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M20 7V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V7H2V5H22V7H20ZM6 7V20H18V7H6ZM7 2H17V4H7V2ZM11 10H13V17H11V10Z"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex text-gray-500 text-sm gap-2">
                <button
                  className="border border-violet-500 text-violet-500 px-3 py-1 rounded-lg 
                    hover:bg-violet-500 transition-all duration-500 ease-out hover:text-white
                    "
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <button
                  className="border border-violet-500 text-violet-500 px-3 py-1 rounded-lg 
                    hover:bg-violet-500 transition-all duration-500 ease-out hover:text-white
                    "
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
