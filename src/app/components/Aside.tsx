"use client";
import { useState } from "react";
import { PressRelease } from "../models/core";
import { useApi } from "../http/api";
import { eventEmitter } from "../utils/eventEmitter";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { usePathname, useRouter } from "next/navigation";
import TemplateSelectorModal from "./TemplateSelectorModal";

export default function Aside() {
  const { createPressRelease } = useApi();
  const [processing, setProcessing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const openPressRelease = (press_release: PressRelease) => {
    eventEmitter.emit("openAIModal", press_release);
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

  const openTemplateSelector = () => {
    eventEmitter.emit("openTemplateSelector");
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const visitPath = (path: string) => {
    router.push(path);
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3C12.5523 3 13 3.44771 13 4L13 10C13 10.5523 12.5523 11 12 11L4 11C3.44772 11 3 10.5523 3 10L3 4C3 3.44772 3.44772 3 4 3L12 3ZM20 3C20.5523 3 21 3.44771 21 4L21 10C21 10.5523 20.5523 11 20 11L16 11C15.4477 11 15 10.5523 15 10L15 4C15 3.44771 15.4477 3 16 3L20 3ZM20 13C20.5523 13 21 13.4477 21 14L21 20C21 20.5523 20.5523 21 20 21L12 21C11.4477 21 11 20.5523 11 20L11 14C11 13.4477 11.4477 13 12 13L20 13ZM3 14C3 13.4477 3.44772 13 4 13L8 13C8.55229 13 9 13.4477 9 14L9 20C9 20.5523 8.55229 21 8 21L4 21C3.44772 21 3 20.5523 3 20L3 14Z"></path>
        </svg>
      ),
    },
    {
      name: "Clients",
      path: "/clients",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2.5 7C2.5 9.20914 4.29086 11 6.5 11C8.70914 11 10.5 9.20914 10.5 7C10.5 4.79086 8.70914 3 6.5 3C4.29086 3 2.5 4.79086 2.5 7ZM2 21V16.5C2 14.0147 4.01472 12 6.5 12C8.98528 12 11 14.0147 11 16.5V21H2ZM17.5 11C15.2909 11 13.5 9.20914 13.5 7C13.5 4.79086 15.2909 3 17.5 3C19.7091 3 21.5 4.79086 21.5 7C21.5 9.20914 19.7091 11 17.5 11ZM13 21V16.5C13 14.0147 15.0147 12 17.5 12C19.9853 12 22 14.0147 22 16.5V21H13Z"></path>
        </svg>
      ),
    },
    {
      name: "Journalists",
      path: "/journalists",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V19H17V9H20C20.5523 9 21 9.44772 21 10V19ZM7 11V13H11V11H7ZM7 7V9H11V7H7Z"></path>
        </svg>
      ),
    },
    {
      name: "Templates",
      path: "/templates",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 2V22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H8ZM20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H10V2H20.0049Z"></path></svg>
      ),
    },
    {
      name: "Email Stats",
      path: "/email-stats",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 13.3414C21.3744 13.1203 20.7013 13 20 13C16.6863 13 14 15.6863 14 19C14 19.7013 14.1203 20.3744 14.3414 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V13.3414ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829ZM17.05 19.5485C17.0172 19.3706 17 19.1873 17 19C17 18.8127 17.0172 18.6294 17.05 18.4515L16.0359 17.866L17.0359 16.134L18.0505 16.7197C18.3278 16.4824 18.6489 16.2948 19 16.1707V15H21V16.1707C21.3511 16.2948 21.6722 16.4824 21.9495 16.7197L22.9641 16.134L23.9641 17.866L22.95 18.4515C22.9828 18.6294 23 18.8127 23 19C23 19.1873 22.9828 19.3706 22.95 19.5485L23.9641 20.134L22.9641 21.866L21.9495 21.2803C21.6722 21.5176 21.3511 21.7052 21 21.8293V23H19V21.8293C18.6489 21.7052 18.3278 21.5176 18.0505 21.2803L17.0359 21.866L16.0359 20.134L17.05 19.5485ZM20 20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18C19.4477 18 19 18.4477 19 19C19 19.5523 19.4477 20 20 20Z"></path></svg>
      ),
    },
  ];

  return (
    <div className="h-full">
      <TemplateSelectorModal/>
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex gap-1 text-gray-800 text-2xl items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-7"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.7134 7.12811L4.46682 7.69379C4.28637 8.10792 3.71357 8.10792 3.53312 7.69379L3.28656 7.12811C2.84706 6.11947 2.05545 5.31641 1.06767 4.87708L0.308047 4.53922C-0.102682 4.35653 -0.102682 3.75881 0.308047 3.57612L1.0252 3.25714C2.03838 2.80651 2.84417 1.97373 3.27612 0.930828L3.52932 0.319534C3.70578 -0.106511 4.29417 -0.106511 4.47063 0.319534L4.72382 0.930828C5.15577 1.97373 5.96158 2.80651 6.9748 3.25714L7.69188 3.57612C8.10271 3.75881 8.10271 4.35653 7.69188 4.53922L6.93228 4.87708C5.94451 5.31641 5.15288 6.11947 4.7134 7.12811ZM3.06361 21.6132C4.08854 15.422 6.31105 1.99658 21 1.99658C19.5042 4.99658 18.5 6.49658 17.5 7.49658L16.5 8.49658L18 9.49658C17 12.4966 14 15.9966 10 16.4966C7.33146 16.8301 5.66421 18.6635 4.99824 21.9966H3C3.02074 21.8722 3.0419 21.7443 3.06361 21.6132Z"></path>
            </svg>
            <p>Wezawire</p>
          </div>
          
          <div className="mt-10 flex gap-2">
            <button
              onClick={addPressRelease}
              className="bg-violet-500 flex-1 flex items-center justify-center
               text-white text-sm py-2 hover:bg-violet-600 transition-all duration-700 ease-in-out rounded-md"
            >
              {processing ? (
                <>
                  <Spinner className="text-white" /> Generating
                </>
              ) : (
                <>New</>
              )}
            </button>
            
            <button
              onClick={openTemplateSelector}
              className="bg-violet-100 text-violet-600 flex-1 flex items-center justify-center
               text-sm py-2 hover:bg-violet-200 transition-all duration-700 ease-in-out rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 2V22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H8ZM20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H10V2H20.0049Z"></path>
              </svg>
              From Template
            </button>
          </div>
          
          <div className="mt-5">
            <ul className="flex flex-col text-sm gap-2 text-gray-500">
              {navItems.map((item) => (
                <li
                  key={item.path}
                  onClick={() => visitPath(item.path)}
                  className={`flex gap-1 items-center pl-5 py-2 rounded transition-all duration-700 ease-in-out cursor-pointer ${
                    isActivePath(item.path)
                      ? "text-gray-800 bg-gray-200"
                      : "hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}