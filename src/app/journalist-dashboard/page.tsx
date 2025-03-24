"use client";

import { Suspense, useState } from "react";

import { useEffect } from "react";
import { Journalist } from "../models/core";
import { useApi } from "../http/api";
import Aside from "../components/Aside";
import JournalistUploadModal from "../components/UploadDataModal";
import EditJournalistModal from "../components/EditJournalistModal";
import DeleteJournalistModal from "../components/DeleteJournalist";
import Dashboard from "./dashboard";

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
            
          

            <div className="p-5">
                <Dashboard/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
