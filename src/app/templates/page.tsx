"use client";
import { useEffect, useState } from "react";
import Aside from "../components/Aside";
import Templates from "../components/Templates";
import PRGenerationModal from "../components/GeneratePR";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if authentication data exists in localStorage
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (!accessToken || !userData) {
      // If either token or user data is missing, redirect to login
      router.push("/login");
      return;
    }

    // Optional: You could also verify if the token is valid or expired
    // by making a request to your backend

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F6F7F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F6F7F9]">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
          <Aside />
        </div>
        <PRGenerationModal />
        <div className="w-4/5 h-full p-2">
          <Templates />
        </div>
      </div>
    </div>
  );
}