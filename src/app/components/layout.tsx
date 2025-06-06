"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, Search, Bell, User, HomeIcon, BuildingIcon, UsersRound } from "lucide-react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const blurAmount = Math.min(8, scrollY / 50) // Max blur of 8px, more gradual increase

  return (
    <div className="flex h-screen">
      {/* Sticky Sidebar */}
      <aside className="w-64 bg-slate-900 fixed h-full overflow-y-auto">
        {/* <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-slate-800">Wezawire</h1>

          <button className="py-2 w-full drop-shadow-sm text-sm rounded-lg text-indigo-950 bg-white">Create New</button>
          <nav>
            <ul className="space-y-2 mt-5 text-slate-600">
              <li>
                <a href="/" className="flex py-2 gap-2 items-center px-4 hover:bg-[#ebebed] rounded hover:text-[#3e4b67]">
                 
                 <HomeIcon className="size-5"/>
                  Home
                </a>
              </li>

              <li>
                <a href="/" className="flex py-2 gap-2 items-center px-4 hover:bg-[#ebebed] rounded hover:text-[#3e4b67]">
                 
                 <BuildingIcon className="size-5"/>
                  Clients
                </a>
              </li>
              <li>
                <a href="/" className="flex py-2 gap-2 items-center px-4 hover:bg-[#ebebed] rounded hover:text-[#3e4b67]">
                 
                 <UsersRound className="size-5"/>
                  Journalists
                </a>
              </li>
              
            </ul>
          </nav>
        </div> */}

<div className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex gap-1 text-white text-2xl items-center">
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
              <button  className="mt-10 bg-violet-600 text-white text-sm py-2 hover:bg-violet-700 transition-all duration-700 ease-in-out w-full rounded-md">
                New Press Release
              </button>
              <div className="mt-5">
                <ul className="flex flex-col text-sm gap-2 text-slate-400">
                  <li
                    className="flex gap-1 items-center pl-5 text-white bg-slate-800
                       py-2 rounded transition-all duration-700 ease-in-out cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3C12.5523 3 13 3.44771 13 4L13 10C13 10.5523 12.5523 11 12 11L4 11C3.44772 11 3 10.5523 3 10L3 4C3 3.44772 3.44772 3 4 3L12 3ZM20 3C20.5523 3 21 3.44771 21 4L21 10C21 10.5523 20.5523 11 20 11L16 11C15.4477 11 15 10.5523 15 10L15 4C15 3.44771 15.4477 3 16 3L20 3ZM20 13C20.5523 13 21 13.4477 21 14L21 20C21 20.5523 20.5523 21 20 21L12 21C11.4477 21 11 20.5523 11 20L11 14C11 13.4477 11.4477 13 12 13L20 13ZM3 14C3 13.4477 3.44772 13 4 13L8 13C8.55229 13 9 13.4477 9 14L9 20C9 20.5523 8.55229 21 8 21L4 21C3.44772 21 3 20.5523 3 20L3 14Z"></path>
                    </svg>
                    Dashboard
                  </li>
                  <li
                    className="flex gap-1 items-center pl-5 hover:bg-slate-800
                      hover:text-white py-2 rounded transition-all duration-700 ease-in-out cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.5 7C2.5 9.20914 4.29086 11 6.5 11C8.70914 11 10.5 9.20914 10.5 7C10.5 4.79086 8.70914 3 6.5 3C4.29086 3 2.5 4.79086 2.5 7ZM2 21V16.5C2 14.0147 4.01472 12 6.5 12C8.98528 12 11 14.0147 11 16.5V21H2ZM17.5 11C15.2909 11 13.5 9.20914 13.5 7C13.5 4.79086 15.2909 3 17.5 3C19.7091 3 21.5 4.79086 21.5 7C21.5 9.20914 19.7091 11 17.5 11ZM13 21V16.5C13 14.0147 15.0147 12 17.5 12C19.9853 12 22 14.0147 22 16.5V21H13Z"></path>
                    </svg>
                    Clients
                  </li>
                  <li
                   className="flex gap-1 items-center pl-5 hover:bg-slate-800
                   hover:text-white py-2 rounded transition-all duration-700 ease-in-out cursor-pointer"
            >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V19H17V9H20C20.5523 9 21 9.44772 21 10V19ZM7 11V13H11V11H7ZM7 7V9H11V7H7Z"></path>
                    </svg>
                    Journalists
                  </li>
                </ul>
              </div>
            </div>
            <div>
              

              <div className="flex border-t pt-5 border-slate-800 mt-5 justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="bg-slate-800 text-slate-50 size-10 rounded-full flex items-center justify-center uppercase text-sm">
                    NI
                  </span>
                  <div className="text-sm text-slate-600">
                    <p>Nick Langat</p>
                    <p className="text-xs text-slate-400 truncate">
                      nick@prosoft.com
                    </p>
                  </div>
                </div>
                <button className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-slate-500 transition-all duration-700 ease-in-out hover:text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5ZM15 16L20 12L15 8V11H9V13H15V16Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Fixed Top Navbar with subtle backdrop blur */}
        <header
          className="fixed w-[calc(100%-16rem)]  z-10 transition-all duration-300 ease-in-out"
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
            backgroundColor: `rgba(255, 255, 255, ${Math.min(0.85, 0.6 + scrollY / 1000)})`,
          }}
        >
          <div className="flex items-center justify-between p-0">
            <div className="flex items-center">
              
              <h2 className="text-xl font-semibold text-gray-800"></h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Search className="text-gray-600" />
              <Bell className="text-gray-600" />
              <User className="text-gray-600" /> */}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="pt-5  overflow-y-auto h-screen">{children}</div>
      </main>
    </div>
  )
}

export default Layout

