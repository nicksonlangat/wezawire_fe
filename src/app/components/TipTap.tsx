"use client";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Strike from "@tiptap/extension-strike";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { all, createLowlight } from "lowlight";
import "./styles.scss";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "../http/api";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { eventEmitter } from "../utils/eventEmitter";

const lowlight = createLowlight(all);

const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Underline,
  Strike,
  Italic,
  Code,
  Placeholder.configure({
    placeholder: "Start writing your press release or use the AI writer…",
  }),
  Blockquote.configure({}),
  BulletList,
  ListItem,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
];

interface TiptapProps {
  content: {};
  editable: boolean;
  id: string;
}

const Tiptap: React.FC<TiptapProps> = ({ content, editable, id }) => {
  const { patchPressRelease } = useApi();
  const editor = useEditor({
    extensions,
    content: content,
    injectCSS: false,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON(); // Get JSON content
      const description = editor.getHTML(); // Get full HTML

      // Extract first <h1> as title
      let title = "";
      const firstH1 = jsonContent.content?.find(
        (node) => node.type === "heading" && node.attrs?.level === 1
      );

      if (firstH1) {
        title = firstH1?.content!.map((c) => c.text).join(""); // Extract text from nodes
      }

      handleContentUpdate({
        json_content: jsonContent,
        description: description,
        title: title,
      });
    },
  });

  const handleContentUpdate = async (data: object) => {
    try {
      const response = await patchPressRelease(id, data);
      // eventEmitter.emit("reloadTask", response);
    } catch (error: any) {
      toast.error("Failed to update content.");
    }
  };

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content, id, editable]);

  return (
    <>
      <EditorContent className="text-sm text-slate-700" editor={editor} />

      <BubbleMenu editor={editor} className="w-[120%]">
        <div className="bg-slate-900 text-slate-400 w-full  rounded-lg">
          <div className="p-1.5  flex gap-2 items-center transition-all duration-500 ease-in-out">
            {/* <button
              className="text-xs p-1 px-2 flex gap-1 items-center  text-slate-300
                      
                      rounded-md transition-all duration-700 ease-in-out hover:text-slate-900 hover:bg-white
                      "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-pink-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 4.4375C15.3462 4.4375 16.4375 3.34619 16.4375 2H17.5625C17.5625 3.34619 18.6538 4.4375 20 4.4375V5.5625C18.6538 5.5625 17.5625 6.65381 17.5625 8H16.4375C16.4375 6.65381 15.3462 5.5625 14 5.5625V4.4375ZM1 11C4.31371 11 7 8.31371 7 5H9C9 8.31371 11.6863 11 15 11V13C11.6863 13 9 15.6863 9 19H7C7 15.6863 4.31371 13 1 13V11ZM17.25 14C17.25 15.7949 15.7949 17.25 14 17.25V18.75C15.7949 18.75 17.25 20.2051 17.25 22H18.75C18.75 20.2051 20.2051 18.75 22 18.75V17.25C20.2051 17.25 18.75 15.7949 18.75 14H17.25Z"></path>
              </svg>
              Edit with AI
            </button> */}

            <Popover>
              <PopoverButton className="flexh hidden py-1 px-2 rounded-md  gap-2 items-center text-[#FF6154] hover:bg-[#FF6154] hover:text-white transition-all duration-500 ease-in-out text-sm">
                <svg
                  viewBox="0 0 576 512"
                  fill="currentColor"
                  className="size-3.5"
                >
                  <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM461.4 48L496 82.6 386.2 192.3l-34.6-34.6L461.4 48zM80 429.4L317.7 191.7l34.6 34.6L114.6 464 80 429.4zM427.4 14.1L46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"></path>
                </svg>
                AI Functions
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white/5 flex flex-col rounded-xl bg-white border border-slate-300 drop-shadow-lg mt-3 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="px-3 mt-5">
                  <button className="py-2 w-full flex gap-2 items-center px-3 rounded-lg  transition-all duration-500 ease-in-out text-[#344054] font-semibold hover:text-[#344054] hover:bg-[#F2F4F7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-[#FF6154]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                    </svg>
                    Summarize
                  </button>
                </div>
                <div className="px-3">
                  <button className="py-2 w-full flex gap-2 items-center px-3 rounded-lg  transition-all duration-500 ease-in-out text-[#344054] font-semibold hover:text-[#344054] hover:bg-[#F2F4F7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-[#FF6154]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1 11C6.52285 11 11 6.52285 11 1H13C13 6.52285 17.4772 11 23 11V13C17.4772 13 13 17.4772 13 23H11C11 17.4772 6.52285 13 1 13V11ZM5.80342 12C8.56895 13.2093 10.7907 15.431 12 18.1966C13.2093 15.431 15.431 13.2093 18.1966 12C15.431 10.7907 13.2093 8.56895 12 5.80342C10.7907 8.56895 8.56895 10.7907 5.80342 12Z"></path>
                    </svg>
                    Improve
                  </button>
                </div>
                <div className="px-3">
                  <button className="py-2 w-full flex gap-2 items-center px-3 rounded-lg  transition-all duration-500 ease-in-out text-[#344054] font-semibold hover:text-[#344054] hover:bg-[#F2F4F7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-[#FF6154]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 5 12 11 6 5H18ZM18 19 12 13 6 19H18Z"></path>
                    </svg>
                    Shorten
                  </button>
                </div>
                <div className="px-3 w-48">
                  <button className="py-2 w-full flex gap-2 items-center px-3 rounded-lg  transition-all duration-500 ease-in-out text-[#344054] font-semibold hover:text-[#344054] hover:bg-[#F2F4F7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-[#FF6154]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path>
                    </svg>
                    Explain
                  </button>
                </div>
                <div className="h-5"></div>
              </PopoverPanel>
            </Popover>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-white text-slate-900"
                  : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19 18v-8l-2 2" />
                <path d="M4 6v12" />
                <path d="M12 6v12" />
                <path d="M11 18h2" />
                <path d="M3 18h2" />
                <path d="M4 12h8" />
                <path d="M3 6h2" />
                <path d="M11 6h2" />
              </svg>
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-white text-slate-900"
                  : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0" />
                <path d="M4 6v12" />
                <path d="M12 6v12" />
                <path d="M11 18h2" />
                <path d="M3 18h2" />
                <path d="M4 12h8" />
                <path d="M3 6h2" />
                <path d="M11 6h2" />
              </svg>
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`${
                editor?.isActive("heading", { level: 3 })
                  ? "bg-white text-slate-900"
                  : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19 14a2 2 0 1 0 -2 -2" />
                <path d="M17 16a2 2 0 1 0 2 -2" />
                <path d="M4 6v12" />
                <path d="M12 6v12" />
                <path d="M11 18h2" />
                <path d="M3 18h2" />
                <path d="M4 12h8" />
                <path d="M3 6h2" />
                <path d="M11 6h2" />
              </svg>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              className={`${
                editor?.isActive("bold") ? "bg-white text-slate-900" : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 20v-16h6a4 4 0 0 1 0 8a4 4 0 0 1 0 8h-6" />
                <path d="M7 12l6 0" />
              </svg>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              className={`${
                editor?.isActive("italic") ? "bg-white text-slate-900" : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 5l6 0" />
                <path d="M7 19l6 0" />
                <path d="M14 5l-4 14" />
              </svg>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={!editor?.can().chain().focus().toggleUnderline().run()}
              className={`${
                editor?.isActive("underline") ? "bg-white text-slate-900" : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 5v5a5 5 0 0 0 10 0v-5" />
                <path d="M5 19h14" />
              </svg>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
              className={`${
                editor?.isActive("strike") ? "bg-white text-slate-900" : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l14 0" />
                <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
              </svg>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor?.can().chain().focus().toggleBulletList().run()}
              className={`${
                editor?.isActive("bulletList") ? "bg-white text-slate-900" : ""
              } p-1.5 rounded-md transition-all duration-500 ease-in-out hover:text-slate-900 hover:bg-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l11 0" />
                <path d="M9 12l11 0" />
                <path d="M9 18l11 0" />
                <path d="M5 6l0 .01" />
                <path d="M5 12l0 .01" />
                <path d="M5 18l0 .01" />
              </svg>
            </button>
          </div>
        </div>
      </BubbleMenu>

      {/* <button
        onClick={copyJSON}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Copy JSON
      </button> */}
    </>
  );
};

export default Tiptap;
