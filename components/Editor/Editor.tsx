"use client";

import { useState } from "react";

import { Lesson } from "@prisma/client";
import { cn } from "@/lib/utils";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
} from "novel";

import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { slashCommand, suggestionItems } from "./SlashCommand";
import { defaultExtensions } from "./Extensions";
import EditorMenu from "./EditorMenu";
import { NodeSelector } from "./selector/node-selector";
import { LinkSelector } from "./selector/link-selector";
import { TextButtons } from "./selector/text-button";
import { ColorSelector } from "./selector/color-selector";
import { Separator } from "../ui/separator";
import { MathSelector } from "./selector/math-selector";
import { uploadFn } from "./ImageUpload";

// const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProps {
  lesson: Lesson;
  teacherView?: boolean;
  setEditor?: (editor: EditorInstance) => void;
}

export default function Editor({
  lesson,
  teacherView = false,
  setEditor,
}: EditorProps) {
  const [, setSaveStatus] = useState("Saved");
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const initialContent = lesson.content
    ? JSON.parse(lesson.content)
    : defaultEditorContent;

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg text-black">
      {!teacherView && (
        <h1 className="mt-8 px-8 text-3xl font-bold lg:mt-12">{lesson.name}</h1>
      )}
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialContent}
          extensions={extensions}
          className={cn(
            "relative w-full max-w-screen-lg bg-background text-black",
            teacherView
              ? "h-[450px] overflow-scroll rounded-b-md border-b border-l border-r border-input shadow-sm"
              : "min-h-[500px]"
          )}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            setSaveStatus("Unsaved");
          }}
          onCreate={({ editor }) => {
            if (setEditor) {
              setEditor(editor);
            }

            if (!teacherView) {
              editor.setEditable(false);
            }
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />

            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation="vertical" />
            <MathSelector />

            <Separator orientation="vertical" />
            <TextButtons />

            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
