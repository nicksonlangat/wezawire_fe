"use client";
import { useEffect, useState } from "react";
import { useApi } from "../http/api";
import Spinner from "../components/Spinner";
import { PressRelease } from "../models/core";
import { eventEmitter } from "../utils/eventEmitter";
import { toast } from "sonner";
import Aside from "../components/Aside";

export default function EmailStats() {
  const { fetchEmailStats, fetchPressReleases } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    overall: {
      totalSent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
    };
    campaigns: {
      id: string;
      title: string;
      sentDate: string;
      totalSent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
    }[];
  }>({
    overall: {
      totalSent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
    },
    campaigns: [],
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);

  // Dummy campaign data for the table
const dummyCampaigns = [
    {
        id: "1",
        title: "Product Launch Announcement",
        sentDate: "2025-05-01T10:30:00",
        totalSent: 1250,
        delivered: 1235,
        opened: 872,
        clicked: 543,
        bounced: 15,
    },
    {
        id: "2",
        title: "Company Rebranding",
        sentDate: "2025-04-25T14:15:00",
        totalSent: 980,
        delivered: 965,
        opened: 724,
        clicked: 412,
        bounced: 15,
    },
    {
        id: "3",
        title: "Quarterly Financial Results",
        sentDate: "2025-04-15T09:00:00",
        totalSent: 550,
        delivered: 542,
        opened: 385,
        clicked: 201,
        bounced: 8,
    },
    {
        id: "4",
        title: "Industry Conference Invitation",
        sentDate: "2025-04-10T13:45:00",
        totalSent: 450,
        delivered: 441,
        opened: 289,
        clicked: 178,
        bounced: 9,
    },
    {
        id: "5",
        title: "New Partnership Announcement",
        sentDate: "2025-04-05T11:20:00",
        totalSent: 785,
        delivered: 773,
        opened: 605,
        clicked: 342,
        bounced: 12,
    },
    {
        id: "6",
        title: "Holiday Sale Promotion",
        sentDate: "2025-03-20T08:00:00",
        totalSent: 1500,
        delivered: 1480,
        opened: 1100,
        clicked: 750,
        bounced: 20,
    },
    {
        id: "7",
        title: "Customer Feedback Survey",
        sentDate: "2025-03-10T15:30:00",
        totalSent: 600,
        delivered: 590,
        opened: 450,
        clicked: 300,
        bounced: 10,
    },
    {
        id: "8",
        title: "Webinar Invitation",
        sentDate: "2025-02-28T12:00:00",
        totalSent: 900,
        delivered: 890,
        opened: 700,
        clicked: 400,
        bounced: 10,
    },
    {
        id: "9",
        title: "Product Update Notification",
        sentDate: "2025-02-15T10:00:00",
        totalSent: 1200,
        delivered: 1180,
        opened: 950,
        clicked: 600,
        bounced: 20,
    },
    {
        id: "10",
        title: "Special Discount Offer",
        sentDate: "2025-01-30T09:30:00",
        totalSent: 1400,
        delivered: 1380,
        opened: 1000,
        clicked: 700,
        bounced: 20,
    },
    // {
    //     id: "11",
    //     title: "Event Reminder",
    //     sentDate: "2025-01-20T14:00:00",
    //     totalSent: 800,
    //     delivered: 790,
    //     opened: 600,
    //     clicked: 350,
    //     bounced: 10,
    // },
    // {
    //     id: "12",
    //     title: "Year-End Review",
    //     sentDate: "2024-12-31T16:00:00",
    //     totalSent: 1000,
    //     delivered: 990,
    //     opened: 750,
    //     clicked: 500,
    //     bounced: 10,
    // },
];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch press releases to populate campaign dropdown
        const prData = await fetchPressReleases(1, ""); // Adjusted to match the expected arguments
        if (prData && prData.results) {
          setPressReleases(prData.results);
        }

        // Fetch email stats based on selected filters
        const emailStats = await fetchEmailStats(
          selectedTimeframe,
          selectedCampaign
        );
        if (emailStats) {
          setStats(emailStats);
        } else {
          // Use dummy data when API doesn't return results
          setStats({
            overall: {
              totalSent: 4015,
              delivered: 3956,
              opened: 2875,
              clicked: 1676,
              bounced: 59,
            },
            campaigns: dummyCampaigns,
          });
        }
      } catch (error) {
        console.error("Error loading email stats:", error);
        toast.error("Failed to load email statistics");

        // Fallback to dummy data on error
        setStats({
          overall: {
            totalSent: 4015,
            delivered: 3956,
            opened: 2875,
            clicked: 1676,
            bounced: 59,
          },
          campaigns: dummyCampaigns,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedTimeframe, selectedCampaign]);

  const calculatePercentage = (value: number, total: number): number => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleCampaignChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCampaign(event.target.value);
  };

  const renderStatCard = (
    title: string,
    value: number,
    total: number,
    icon: JSX.Element
  ) => {
    const percentage = calculatePercentage(value, total);

    return (
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl mt-2 font-medium text-gray-800">
              {value.toLocaleString()}
            </p>
            {total > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {percentage}% of total
              </p>
            )}
          </div>
          <div
            className={`rounded-lg size-10 flex items-center justify-center ${
              title === "Bounced"
                ? "bg-red-100 text-red-500"
                : title === "Clicked"
                ? "bg-blue-100 text-blue-500"
                : title === "Opened"
                ? "bg-yellow-100 text-yellow-500"
                : title === "Delivered"
                ? "bg-green-100 text-green-500"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#F6F7F9]">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
          <Aside />
        </div>

        <div className="w-4/5 h-full p-2">
          <div className="bg-white w-full h-full overflow-auto p-10 border border-gray-100 rounded-xl">
            <div className="flex w-full justify-between items-center">
              <div>
                <p className="flex gap-2 items-center text-xl text-gray-700">
                  <span className="bg-violet-500 rounded-md flex items-center justify-center size-7 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22 13.3414C21.3744 13.1203 20.7013 13 20 13C16.6863 13 14 15.6863 14 19C14 19.7013 14.1203 20.3744 14.3414 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V13.3414ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
                    </svg>
                  </span>
                  Email Statistics
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTimeframeChange("7days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      selectedTimeframe === "7days"
                        ? "bg-violet-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => handleTimeframeChange("30days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      selectedTimeframe === "30days"
                        ? "bg-violet-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => handleTimeframeChange("90days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      selectedTimeframe === "90days"
                        ? "bg-violet-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    90 Days
                  </button>
                </div>
                <select
                  value={selectedCampaign}
                  onChange={handleCampaignChange}
                  className="border  border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-0"
                >
                  <option value="all">All Press Releases</option>
                  {pressReleases.map((pr) => (
                    <option key={pr.id} className="" value={pr.id}>
                      {pr.title?.slice(0, 20) || "Untitled Press Release"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="text-violet-500" />
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-5 gap-1">
                  {renderStatCard(
                    "Total Sent",
                    stats.overall.totalSent,
                    stats.overall.totalSent,
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.0006 3C14.7549 3 17.251 4.13571 19.0003 5.99635L20.1464 4.85023L21.5607 6.26444L19.0003 8.82497C17.9887 9.83657 16.741 10.61 15.3472 11.0325C13.9534 11.455 12.4786 11.513 11.0508 11.2018C9.62297 10.8906 8.2929 10.2206 7.18482 9.25206C6.07674 8.28355 5.22718 7.05223 4.7146 5.67349C4.20203 4.29475 4.04608 2.8191 4.26323 1.37578L6.28283 1.7456C6.10782 2.90224 6.23566 4.08438 6.65234 5.17515C7.06902 6.26591 7.75662 7.22954 8.64822 7.9687C9.53982 8.70786 10.5996 9.19464 11.7356 9.37322C12.8717 9.55179 14.0351 9.41396 15.1074 8.97254L12.0006 5.86563L13.4149 4.45142L17.9291 8.96565C16.4359 10.93 14.3294 12.3461 12.0006 12.8955V21H10.0006V12.8955C7.7592 12.3666 5.71383 11.0213 4.2533 9.15276L3.00062 10.4054L1.5864 8.99123L4.14693 6.4307C4.69283 5.88481 5.29422 5.39985 5.93705 4.98232C5.41419 6.67058 5.45048 8.49579 6.03879 10.1645C6.6271 11.8333 7.73519 13.2593 9.18791 14.2251C10.6406 15.1909 12.3675 15.6439 14.1031 15.5131C15.8387 15.3823 17.4844 14.6748 18.7912 13.5014L20.1473 14.8575L18.733 16.2717L17.587 15.1256C15.8376 16.9862 13.3416 18.1219 10.5872 18.1219L10.0006 18.1196V21H14.0006V23H8.00062V16.8098C7.0033 16.5726 6.04671 16.1917 5.16394 15.6749L5.99991 14C6.93748 14.6433 7.99992 15.1206 9.14072 15.3824C10.0558 13.9479 11.5791 12.9999 13.2686 12.9999C15.6153 12.9999 17.5819 14.8195 17.9653 17.15C18.4666 17.0522 18.9493 16.8927 19.4033 16.6788L20.0998 18.4303C19.3563 18.7749 18.5639 19.0003 17.7454 19.0957C17.3653 20.7588 15.861 21.9999 14.0006 21.9999L14.0006 20C15.1052 20 16.0006 19.1046 16.0006 18C16.0006 16.8954 15.1052 16 14.0006 16C12.8961 16 12.0006 16.8954 12.0006 18H10.0006C10.0006 15.7909 11.7915 14 14.0006 14C14.1667 14 14.3302 14.0119 14.4905 14.035C14.2425 13.405 13.6229 12.9999 12.8984 12.9999C11.8984 12.9999 11.0546 13.7046 10.8607 15.0672C8.69104 14.8812 6.73874 13.8614 5.34122 12.2815C5.7534 12.8508 6.2462 13.359 6.8027 13.7899L5.9327 15.4453C4.90233 14.6336 4.05473 13.6111 3.44946 12.4504C3.29653 12.1283 3.16541 11.7965 3.05364 11.4566L4.99491 10.9043C5.05706 11.0842 5.12663 11.2597 5.20351 11.4301C6.3536 10.2387 7.86989 9.4471 9.51551 9.1864C9.05859 8.3295 8.84094 7.36591 8.88546 6.39586C7.71255 6.82847 6.67636 7.54436 5.88771 8.46841C5.45384 7.45211 5.25359 6.35006 5.2978 5.23485C6.32321 4.36083 7.59414 3.77335 8.95895 3.56173C9.9113 3.40896 10.8818 3.43243 11.8259 3.63181C10.3712 4.19776 9.13983 5.19999 8.32297 6.5C8.33721 7.40643 8.59308 8.28437 9.05939 9.02884C9.97737 8.91403 10.8449 8.58223 11.5818 8.06604C11.6362 8.02592 11.6894 7.98433 11.7415 7.94129C11.3979 7.35168 11.2156 6.68355 11.2156 5.98392H13.2156C13.2156 6.23045 13.2582 6.46538 13.3332 6.68047C13.8377 6.30065 14.4301 6.03999 15.0656 5.9178C15.1102 5.90913 15.1552 5.90173 15.2006 5.89558C14.2125 4.82025 12.8584 4.12514 11.3801 4.0103C11.5863 4.00346 11.7932 4 12.0006 4C12.2007 4 12.3995 4.00323 12.5968 4.00957C13.4564 4.03765 14.2943 4.21557 15.0783 4.53064C15.9479 4.12242 16.9336 3.94237 17.9091 4.02271C16.2114 3.35435 14.3578 3 12.4397 3L12.0006 3Z" />
                    </svg>
                  )}
                  {renderStatCard(
                    "Delivered",
                    stats.overall.delivered,
                    stats.overall.totalSent,
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 3C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.455L2 22.5V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V18.385L5.76333 17H20V5ZM10.5153 7.4116L11.5722 8.4685L8.97048 11.0702L10.5722 12.6719L9.5153 13.7288L6.85693 11.0702L10.5153 7.4116ZM12.9116 13.7281L11.8547 12.6712L14.4563 10.0695L12.8547 8.46783L13.9116 7.41093L16.5702 10.0695L12.9116 13.7281Z" />
                    </svg>
                  )}
                  {renderStatCard(
                    "Opened",
                    stats.overall.opened,
                    stats.overall.delivered,
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 1C16.9706 1 21 5.02944 21 10V17H19V19H18V21H6V19H5V17H3V10C3 5.02944 7.02944 1 12 1ZM12 3C8.13401 3 5 6.13401 5 10V17H7V19H17V17H19V10C19 6.13401 15.866 3 12 3ZM7 14H9V10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10H13C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10V14H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V14Z" />
                    </svg>
                  )}
                  {renderStatCard(
                    "Clicked",
                    stats.overall.clicked,
                    stats.overall.opened,
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.0604 2.1059L15.8801 10.6915L24 10.5022L17.0109 15.7607L19.4439 24.4577L12.6696 18.8506L5.65073 24.1285L8.45045 15.6429L1.30371 10.6003L9.42357 11.0746L13.0604 2.1059Z" />
                    </svg>
                  )}
                  {renderStatCard(
                    "Bounced",
                    stats.overall.bounced,
                    stats.overall.totalSent,
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.0001 1.99609C16.9707 1.99609 21.0001 6.02551 21.0001 10.9961V16.9961H7.82849L5.41437 19.4103L4.00015 17.9961L9.00015 12.9961H4.00015V10.9961C4.00015 6.02551 8.0296 1.99609 13.0001 1.99609H12.0001ZM12.0001 3.99609C9.20584 3.99609 6.83015 5.78402 6.31381 8.3286C8.67724 7.79218 10.6123 6.20965 11.5312 4.11133C12.8824 6.95486 15.508 8.99609 18.6326 8.99609H19.0001V10.9961C19.0001 7.13018 15.8661 3.99609 12.0001 3.99609ZM15.0001 10.9961V12.9961H13.0001V10.9961H15.0001ZM10.0001 10.9961V12.9961H8.00015V10.9961H10.0001ZM13.0001 16.9961V22.9961H7.00015V20.9961H11.0001V16.9961H13.0001ZM19.0001 20.9961V22.9961H17.0001V20.9961H19.0001ZM17.0001 16.9961V18.9961H15.0001V16.9961H17.0001Z" />
                    </svg>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-700 text-lg">
                      Campaign Performance
                    </h2>
                  </div>

                  <div className="bg-gray-100 p-1 rounded-lg">
                    <div className="relative overflow-x-auto rounded-lg">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 border-b border-gray-100 uppercase bg-white">
                          <tr>
                            <th scope="col" className="px-6 font-normal py-3">
                              Campaign
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Date Sent
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Recipients
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Delivered
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Opens
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Clicks
                            </th>
                            <th scope="col" className="px-6 font-normal py-3">
                              Bounces
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {stats.campaigns && stats.campaigns.length > 0 ? (
                      stats.campaigns.map((campaign, index) => (
                        <tr key={index} className="bg-white last:border-0 text-gray-500 text-sm border-b border-slate-100">
                          <td className="px-6 py-3">{campaign.title || "Untitled Campaign"}</td>
                          <td className="px-6 py-3">{new Date(campaign.sentDate).toLocaleDateString()}</td>
                          <td className="px-6 py-3">{campaign.totalSent}</td>
                          <td className="px-6 py-3">
                            {campaign.delivered} ({calculatePercentage(campaign.delivered, campaign.totalSent)}%)
                          </td>
                          <td className="px-6 py-3">
                            {campaign.opened} ({calculatePercentage(campaign.opened, campaign.delivered)}%)
                          </td>
                          <td className="px-6 py-3">
                            {campaign.clicked} ({calculatePercentage(campaign.clicked, campaign.opened)}%)
                          </td>
                          <td className="px-6 py-3">
                            {campaign.bounced} ({calculatePercentage(campaign.bounced, campaign.totalSent)}%)
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white text-gray-500 text-sm">
                        <td colSpan={7} className="px-6 py-8 text-center">
                          No campaign data available for the selected filters
                        </td>
                      </tr>
                    )} */}

                          {dummyCampaigns && dummyCampaigns.length > 0 ? (
                            dummyCampaigns.map((campaign, index) => (
                              <tr
                                key={index}
                                className="bg-white last:border-0 text-gray-500 text-sm border-b border-slate-100"
                              >
                                <td className="px-6 py-3">
                                  {campaign.title || "Untitled Campaign"}
                                </td>
                                <td className="px-6 py-3">
                                  {new Date(
                                    campaign.sentDate
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3">
                                  {campaign.totalSent}
                                </td>
                                <td className="px-6 py-3">
                                  {campaign.delivered} (
                                  {calculatePercentage(
                                    campaign.delivered,
                                    campaign.totalSent
                                  )}
                                  %)
                                </td>
                                <td className="px-6 py-3">
                                  {campaign.opened} (
                                  {calculatePercentage(
                                    campaign.opened,
                                    campaign.delivered
                                  )}
                                  %)
                                </td>
                                <td className="px-6 py-3">
                                  {campaign.clicked} (
                                  {calculatePercentage(
                                    campaign.clicked,
                                    campaign.opened
                                  )}
                                  %)
                                </td>
                                <td className="px-6 py-3">
                                  {campaign.bounced} (
                                  {calculatePercentage(
                                    campaign.bounced,
                                    campaign.totalSent
                                  )}
                                  %)
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="bg-white text-gray-500 text-sm">
                              <td colSpan={7} className="px-6 py-8 text-center">
                                No campaign data available for the selected
                                filters
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
