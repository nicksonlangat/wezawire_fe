"use client";
import { useEditor, EditorContent } from "@tiptap/react";
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
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
import "./styles.scss";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "../http/api";
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
    placeholder: "Start writing here....",
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class:
        "p-4  my-4 text-xs rounded-lg bg-violet-900/10 text-violet-500 border border-violet-900",
    },
  }),
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
  threshold: number;
}

const TipTapRenderer: React.FC<TiptapProps> = ({ content, threshold }) => {
  // Function to extract plain text and truncate it
  const truncateContent = (jsonContent: any, wordLimit: number) => {
    if (!jsonContent || !jsonContent.content) return jsonContent; // Return unchanged if invalid

    let text = extractText(jsonContent); // Extract text
    let words = text.split(/\s+/).slice(0, wordLimit);
    let truncatedText =
      words.join(" ") + (words.length < text.split(/\s+/).length ? "..." : "");

    // Return new JSON object with truncated text
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: truncatedText }],
        },
      ],
    };
  };

  // Function to extract text recursively from TipTap JSON
  const extractText = (node: any): string => {
    if (!node || !node.content) return "";
    return node.content
      .map((child: any) =>
        child.type === "text" ? child.text : extractText(child)
      )
      .join(" ");
  };

  const truncatedContent = truncateContent(content, threshold);

  const editor = useEditor({
    extensions,
    content: truncatedContent,
    injectCSS: false,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && truncatedContent) {
      const currentContent = editor.getHTML();
      const newContent = JSON.stringify(truncatedContent);

      // Prevent unnecessary updates
      if (currentContent !== newContent) {
        editor.commands.setContent(truncatedContent);
      }
    }
  }, [editor]); // Only run once when the editor initializes

  return <EditorContent className="text-xs text-slate-500" editor={editor} />;
};

export default TipTapRenderer;
