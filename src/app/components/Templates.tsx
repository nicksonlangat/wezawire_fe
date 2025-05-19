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
  type: "standard" | "partnership" | "product-launch" | "award" | "event";
}

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>("all");
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
          description:
            "A traditional press release template suitable for general announcements",
          previewImage:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] Announces [News Headline]</h1>
        
            <!-- Optional Hero Image -->
            <img src="[image-url]" alt="[Brief image description]" style="max-width: 100%; height: auto; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px; color: #555;">[Optional caption or photo credit]</p>
        
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong>, [brief description of the company], today announced [key news summary in one sentence].</p>
        
            <h2>About the Announcement</h2>
            <p>[Provide a few paragraphs explaining the news in detail. Include relevant background information, what led to the announcement, and the key messages you want to convey.]</p>
        
            <h2>Quotes</h2>
            <p>"[Insert a compelling quote from a company spokesperson or executive, ideally the CEO]," said [Full Name], [Title] of [Company Name].</p>
            <p>"[Optional second quote from a partner, industry expert, or internal team member]," added [Full Name], [Title].</p>
        
            <h2>Impact and Next Steps</h2>
            <p>[Describe what this news means for the industry, customers, or community. What should readers expect next? Will there be a launch, release, or public event?]</p>
        
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [brief company overview: what you do, who you serve, and your mission]. For more information, visit <a href="[company website]">[company website]</a>.</p>
        
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Job Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
          `,
          type: "standard",
        },
        {
          id: "template-2",
          title: "Partnership Announcement",
          description:
            "Perfect for announcing new partnerships or collaborations",
          previewImage:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
          <h1>[Company Name] Partners with [Partner Name] to [Objective]</h1>
        
          <!-- Optional Partnership Image -->
          <img src="[image-url]" alt="[Brief image description]" style="max-width: 100%; height: auto; margin: 20px 0;" />
          <p style="text-align: center; font-size: 14px; color: #555;">[Optional caption or photo credit]</p>
        
          <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> and <strong>[Partner Name]</strong> today announced a strategic partnership to [summary of objective or goal].</p>
        
          <h2>Partnership Overview</h2>
          <p>[Explain the nature of the partnership, how it came about, what each party brings to the table, and the goals of the collaboration.]</p>
        
          <h2>Joint Statement</h2>
          <p>"[Quote from Company A spokesperson]," said [Full Name], [Title] at [Company Name].</p>
          <p>"[Quote from Partner spokesperson]," added [Full Name], [Title] at [Partner Name].</p>
        
          <h2>Benefits and Impact</h2>
          <p>[Describe the expected impact of the partnership: new services, customer benefits, market expansion, innovation, etc.]</p>
        
          <h2>About [Company Name]</h2>
          <p>[Company Name] is a [brief description]. Visit <a href="[company website]">[company website]</a> for more information.</p>
        
          <h2>About [Partner Name]</h2>
          <p>[Partner Name] is a [brief description]. Visit <a href="[partner website]">[partner website]</a> for more information.</p>
        
          <h2>Media Contact</h2>
          <p>
            <strong>[Full Name]</strong><br />
            [Job Title]<br />
            [Company Name]<br />
            [Email Address]<br />
            [Phone Number]<br />
            [Website URL]
          </p>
        `,
          type: "partnership",
        },
        {
          id: "template-3",
          title: "Product Launch",
          description: "Announce a new product or service launch",
          previewImage:
            "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] Launches Revolutionary [Product/Service Name]</h1>

<img src="[image-url]" alt="[Product Image]" style="max-width: 100%; height: auto; margin: 20px 0;" />
<p style="text-align: center; font-size: 14px; color: #555;">[Optional: Caption or photo credit]</p>

<p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong>, a leader in [industry or market category], today announced the launch of its groundbreaking new [Product/Service Name], designed to [briefly state purpose or impact]. The innovative solution aims to [key benefit or problem solved].</p>

<h2>Innovation That Matters</h2>
<p>[Product/Service Name] is built to [describe main functionality and purpose]. With cutting-edge features like [list a few highlights], it provides users with a streamlined and intuitive experience. The product has been under development for [X months/years], with input from [customer base/industry experts/etc.].</p>

<p>"[Insert brief technical or performance claim—e.g., reduces costs by 40%, increases efficiency, enhances experience, etc.]," said [Product Lead Name], [Product Lead Title] at [Company Name]. "We built [Product Name] from the ground up to address real challenges our users face every day."</p>

<h2>Executive Insight</h2>
<p>"[Quote from CEO/founder about the strategic importance of this launch, customer impact, or company growth goals]," said [Full Name], [Title], [Company Name]. "This launch marks a pivotal moment for our company as we continue to push the boundaries of what’s possible in [industry category]."</p>

<h2>Availability</h2>
<p>The new [Product/Service Name] is available starting [Launch Date] on [platform/store/distribution channel]. Customers can learn more, request a demo, or purchase it directly through <a href="[Product URL]">[Product URL]</a>. Pricing starts at [pricing tiers or starting price], with plans designed for [target market segments, e.g. individuals, startups, enterprises, etc.].</p>

<h2>About [Company Name]</h2>
<p>[Company Name] is a [brief company description—year founded, what you do, and who you serve]. With a commitment to innovation, quality, and customer satisfaction, [Company Name] has been recognized as a leader in [industry/space]. For more information, visit <a href="[Company Website]">[Company Website]</a>.</p>

<h2>Media Contact</h2>
<p>
  <strong>[Full Name]</strong><br />
  [Title]<br />
  [Company Name]<br />
  [Email Address]<br />
  [Phone Number]<br />
  [Website URL]
</p>

            `,
          type: "product-launch",
        },
        {
          id: "template-4",
          title: "Award or Recognition",
          description: "Announce an award or industry recognition",
          previewImage:
            "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=3019&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] Receives [Award Name]</h1>
          
            <!-- Optional Award Image -->
            <img src="[image-url]" alt="[Brief image description]" style="max-width: 100%; height: auto; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px; color: #555;">[Optional caption or photo credit]</p>
          
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> is proud to announce that it has received the <strong>[Award Name]</strong> for [brief description of the achievement or category].</p>
          
            <h2>About the Recognition</h2>
            <p>[Provide background on the award or recognition—who gives it, its importance in the industry, past recipients, etc. Describe why your company was selected and what it means for your team or stakeholders.]</p>
          
            <h2>Quote</h2>
            <p>"[Quote from a company executive or representative expressing gratitude and significance of the recognition]," said [Full Name], [Title] at [Company Name].</p>
          
            <h2>What It Means</h2>
            <p>[Describe how this award impacts your business or future goals. Mention any next steps, upcoming initiatives, or events connected to the achievement.]</p>
          
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [brief description]. To learn more, visit <a href="[company website]">[company website]</a>.</p>
          
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Job Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
          `,
          type: "award",
        },
        {
          id: "template-5",
          title: "Event Announcement",
          description: "Announce an upcoming event or conference",
          previewImage:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] to Host [Event Name]</h1>
            
            <img src="[event-image-url]" alt="[Event Image]" style="max-width: 100%; height: auto; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px; color: #555;">[Optional: Caption or photo credit]</p>
            
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> today announced it will host <strong>[Event Name]</strong>, a [event type, e.g. conference, summit, workshop] focused on [brief event purpose or theme]. The event will take place on [Event Date] at [Venue/Location] and is expected to attract [expected audience or attendees, e.g., industry leaders, professionals, etc.].</p>
            
            <h2>Bringing the Industry Together</h2>
            <p>[Event Name] is designed to [primary goal of the event – e.g., showcase innovation, foster collaboration, discuss key industry trends]. The event will feature keynote presentations, panel discussions, and interactive workshops led by experts from [related industries or companies].</p>
            
            <p>"[Quote from organizer or CEO about the significance of the event and what participants can expect]," said [Full Name], [Title], [Company Name]. "We’re excited to bring together such a diverse group of professionals for meaningful conversations and actionable insights."</p>
            
            <h2>Highlights of the Event</h2>
            <ul>
              <li>Keynote by [Speaker Name], [Title], [Organization]</li>
              <li>Panels covering [list key topics, e.g., AI in business, sustainable tech, future of work]</li>
              <li>Networking opportunities with [attendee profile – startups, investors, partners]</li>
              <li>Exclusive product demonstrations and breakout sessions</li>
            </ul>
            
            <h2>Registration Details</h2>
            <p>Registration for [Event Name] is now open. Early bird pricing is available until [Early Bird Deadline]. Tickets and event details can be found at <a href="[Registration URL]">[Registration URL]</a>. The event is open to [target audience, e.g. the public, professionals, media].</p>
            
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [short company description: what you do, when you were founded, your mission]. The company is committed to [your values or impact] and has hosted numerous industry-leading events that connect professionals from around the world. Learn more at <a href="[Company Website]">[Company Website]</a>.</p>
            
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
            `,
          type: "event",
        },
        {
          id: "template-6",
          title: "Market Expansion",
          description: "Announce expansion into new markets or regions",
          previewImage:
            "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] Expands Operations to [New Region/Market]</h1>
            
            <img src="[expansion-image-url]" alt="[Expansion Image]" style="max-width: 100%; height: auto; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px; color: #555;">[Optional: Caption or photo credit]</p>
            
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> today announced its expansion into <strong>[New Region/Market]</strong>, marking a significant milestone in the company's growth strategy. This move will enable [Company Name] to better serve customers in the region and capitalize on emerging market opportunities.</p>
            
            <h2>Strategic Growth in [New Region/Market]</h2>
            <p>The expansion involves [briefly describe nature of expansion – new offices, partnerships, product launches, hiring]. This development aligns with [Company Name]'s long-term vision to [company's growth goals or mission]. The company aims to bring its innovative solutions and services to new customers while strengthening relationships with existing partners.</p>
            
            <p>"[Quote from CEO or Regional Manager highlighting the importance of this expansion and expected impact]," said [Full Name], [Title], [Company Name]. "We are excited to establish a stronger presence in [New Region/Market] and look forward to contributing to the local economy and community."</p>
            
            <h2>Opportunities for Customers and Partners</h2>
            <p>The expansion will provide customers in [New Region/Market] with [describe benefits such as improved service, localized support, new offerings]. It also opens doors for new partnerships and collaborations within the region’s vibrant business ecosystem.</p>
            
            <h2>Looking Ahead</h2>
            <p>As part of this initiative, [Company Name] plans to [mention upcoming activities like events, hiring, product launches specific to the region]. The company invites stakeholders to join in this exciting new chapter.</p>
            
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [brief company overview including founding year, industry, and mission]. The company is dedicated to delivering innovative products and exceptional customer service globally. For more information, visit <a href="[Company Website]">[Company Website]</a>.</p>
            
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
            `,
          type: "standard",
        },
        {
          id: "template-7",
          title: "Executive Appointment",
          description: "Announce new executive leadership appointment",
          previewImage:
            "https://images.unsplash.com/photo-1541844053589-346841d0b34c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] Appoints [Executive Name] as [Position]</h1>
            
            <img src="[executive-photo-url]" alt="[Executive Name]" style="max-width: 200px; height: auto; margin: 20px 0;" />
            
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> today announced the appointment of <strong>[Executive Name]</strong> as its new <strong>[Position]</strong>, effective immediately. [Executive Name] brings over [number] years of experience in [industry or relevant field] and will play a key role in driving the company’s strategic vision and growth.</p>
            
            <h2>About the Appointment</h2>
            <p>[Executive Name] joins [Company Name] from [Previous Company or Role], where they successfully [mention notable achievements or responsibilities]. In their new role, [Executive Name] will oversee [key responsibilities], focusing on [strategic goals or initiatives].</p>
            
            <p>"[Quote from CEO or Chairperson about the appointment and expectations]," said [Full Name], [Title], [Company Name].</p>
            
            <p>"I am honored to join [Company Name] and excited to contribute to its future success by [brief statement from the executive about their vision or goals]," said [Executive Name].</p>
            
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [brief company description, industry, mission]. The company is committed to [values, innovation, leadership], serving customers across [markets/regions]. Learn more at <a href="[Company Website]">[Company Website]</a>.</p>
            
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
            `,
          type: "standard",
        },
        {
          id: "template-8",
          title: "Joint Venture",
          description:
            "Announce a new joint venture between multiple organizations",
          previewImage:
            "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          content: `
            <h1>[Company Name] and [Partner Company] Launch Joint Venture for [Purpose]</h1>
            
            <img src="[joint-venture-image-url]" alt="Joint Venture" style="max-width: 100%; height: auto; margin: 20px 0;" />
            <p style="text-align: center; font-size: 14px; color: #555;">[Optional: Caption or photo credit]</p>
            
            <p><strong>[City, Country]</strong> – <em>[Date]</em> – <strong>[Company Name]</strong> and <strong>[Partner Company]</strong> today announced the formation of a joint venture to [briefly describe purpose and objectives of the joint venture]. This collaboration aims to leverage the strengths of both organizations to [describe expected benefits and goals].</p>
            
            <h2>Details of the Joint Venture</h2>
            <p>The joint venture will focus on [key activities, markets, technologies, or services]. Both companies will contribute [mention contributions such as capital, expertise, technology] to ensure the success of this partnership.</p>
            
            <p>"[Quote from CEO or senior executives from one or both companies highlighting the significance and expected impact of the joint venture]," said [Full Name], [Title], [Company Name].</p>
            
            <p>"We are excited to partner with [Partner Company] to create new opportunities and deliver greater value to our customers," said [Full Name], [Title], [Partner Company].</p>
            
            <h2>Strategic Importance</h2>
            <p>This joint venture reflects both companies' commitment to innovation, growth, and expanding their footprint in [industry or market]. It positions them to better address [market needs, challenges, or opportunities].</p>
            
            <h2>About [Company Name]</h2>
            <p>[Company Name] is a [brief company description including founding year, industry, and mission]. For more information, visit <a href="[Company Website]">[Company Website]</a>.</p>
            
            <h2>About [Partner Company]</h2>
            <p>[Partner Company] is a [brief partner company description]. Learn more at <a href="[Partner Website]">[Partner Website]</a>.</p>
            
            <h2>Media Contact</h2>
            <p>
              <strong>[Full Name]</strong><br />
              [Title]<br />
              [Company Name]<br />
              [Email Address]<br />
              [Phone Number]<br />
              [Website URL]
            </p>
            `,
          type: "partnership",
        },
      ];

      setTemplates(sampleTemplates);
      setIsLoading(false);
      setTotalPages(Math.ceil(sampleTemplates.length / 6));
    }, 800);
  }, []);

  const filteredTemplates =
    filterType === "all"
      ? templates
      : templates.filter((template) => template.type === filterType);

  // Templates for current page
  const currentTemplates = filteredTemplates.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  );

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
      const template = templates.find((t) => t.id === selectedTemplate);

      // In a real implementation, pass the template content to your API
      const response = await createPressRelease({
        content: template?.content || "",
        templateId: selectedTemplate,
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
                      {template.type.replace("-", " ")}
                    </span>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-0 left-0 w-full h-full bg-violet-500 bg-opacity-20 flex items-center justify-center">
                      <span className="bg-white rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-6 text-violet-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Page {currentPage} of{" "}
                {Math.max(1, Math.ceil(filteredTemplates.length / 6))}
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
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(filteredTemplates.length / 6))
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredTemplates.length / 6)
                }
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
