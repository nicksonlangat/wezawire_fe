"use client";

import { Suspense, useState } from "react";

import { useEffect } from "react";
import { Journalist } from "../models/core";
import { useApi } from "../http/api";
import Aside from "../components/Aside";
import JournalistUploadModal from "../components/UploadDataModal";
import EditJournalistModal from "../components/EditJournalistModal";
import DeleteJournalistModal from "../components/DeleteJournalist";

export default function PageWithSuspense() {
  return (
    <Suspense fallback={<div></div>}>
      <Journalists />
    </Suspense>
  );
}

const Journalists = () => {
  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const { fetchJournalists } = useApi();


  const [selectedJournalist, setSelectedJournalist] = useState<Journalist | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
    
    const handleEditClick = (journalist: Journalist) => {
      setSelectedJournalist(journalist);
      setIsEditModalOpen(true);
    };
  
    const handleEditSuccess = (updatedJournalist: Journalist) => {
     
      setJournalists(
        journalists.map((journalist) =>
          journalist.id === updatedJournalist.id ? updatedJournalist : journalist
        )
      );
    };
  
    const handleDeleteClick = (journalist: Journalist) => {
      setSelectedJournalist(journalist);
      setIsDeleteModalOpen(true);
    };
  
    const handleDeleteSuccess = (deletedId: string) => {
      
      setJournalists(journalists.filter(journalist => journalist.id !== deletedId));
    };
  

  useEffect(() => {
    const getJournalists = async () => {
      const data = await fetchJournalists(currentPage, searchQuery);
      if (data) {
        setJournalists(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      }
    };
    getJournalists();
  }, [currentPage, searchQuery]);

  return (
    <div className="h-screen bg-[#F6F7F9]">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
       <Aside />
        </div>

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
              })()} <span className="text-gray-800">Welcome back</span>
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
                    <path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path>
                  </svg>
                </span>
                Journalists
              </p>
              <div className="flex gap-2 items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search by name, email, country"
                  className="py-2  placeholder:text-gray-400
                
                text-sm w-72 pl-4 focus:ring-0 focus:outline-none text-gray-600 rounded-lg border border-gray-200"
                />
              

       <JournalistUploadModal/>
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
                          title
                        </th>

                        <th scope="col" className="px-6 font-normal py-3">
                          country
                        </th>
                        <th scope="col" className="px-6 font-normal py-3">
                          action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalists.map((journalist) => (
                        <tr
                          className="bg-white last:border-0
                     text-gray-500 text-sm border-b
                      border-slate-100"
                        >
                          <th
                            scope="row"
                            className="px-6 py-3 flex items-center gap-2  font-normal"
                          >
                            {journalist.name}
                          </th>
                          <td className="px-6 py-4">
                            <div>
                              <p className="">{journalist.email}</p>
                              <p className="">{journalist.phone}</p>
                            </div>
                          </td>

                          <td className="px-6 truncate py-3">
                            {journalist.title}
                          </td>

                          <td className="px-6 py-3">{journalist.country}</td>
                           <td className="px-6 py-3">
                                                      <div className="flex gap-2">
                                                        <EditJournalistModal
                                                          journalist={selectedJournalist}
                                                          isOpen={isEditModalOpen}
                                                          onClose={() => setIsEditModalOpen(false)}
                                                          onSuccess={handleEditSuccess}
                                                        />
                                                        <button
                                                          onClick={() => handleEditClick(journalist)}
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
                          
                                                        <DeleteJournalistModal
                                                          journalist={selectedJournalist}
                                                          isOpen={isDeleteModalOpen}
                                                          onClose={() => setIsDeleteModalOpen(false)}
                                                          onSuccess={handleDeleteSuccess}
                                                        />
                                                        <button
                                                          onClick={() => handleDeleteClick(journalist)}
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
};
