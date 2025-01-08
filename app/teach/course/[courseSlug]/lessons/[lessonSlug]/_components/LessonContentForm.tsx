"use client";

import { Lesson, Video } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditorInstance } from "novel";
import { useSession } from "next-auth/react";
import {
  createUploadUrl,
  deleteLessonAction,
  revalidate,
  updateLessonAction,
} from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Editor from "@/components/Editor/Editor";

interface LessonContentFormProps {
  lesson: Lesson & { video?: Video | null };
}
const LessonContentForm = ({ lesson }: LessonContentFormProps) => {
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const { data: session } = useSession();

  const status = lesson.video?.status;
  const [videoStatus, setVideoStatus] = useState<string>(status || "waiting");
  useEffect(() => {
    if (!status) return;
    setVideoStatus(status);
  }, [status]);

  useEffect(() => {
    if (videoStatus === "ready" || videoStatus === "waiting") return;

    const interval = setInterval(async () => {
      revalidate(`/teach/course/${lesson.courseSlug}/lessons/${lesson.slug}`);

      if (videoStatus === "ready") {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videoStatus]);

  const [isPublished, setIsPublished] = useState(lesson.isPublished);

  const hasVideo = !!lesson.video?.playbackId;
  const videoIsReady = videoStatus === "ready";
  const readyToPublish = hasVideo && videoIsReady;

  function toggleIsPublished() {
    if (isPublished) {
      setIsPublished(false);
      return;
    }

    if (!isPublished && readyToPublish) {
      setIsPublished(true);
      return;
    }

    if (!isPublished && !hasVideo) {
      toast.error("Upload a video to publish this lesson.");
      return;
    }

    if (!isPublished && !videoIsReady) {
      return toast.error("Please wait for the video to finish processing.");
    }
  }

  async function handleUpdateLesson() {
    if (!editor) {
      return;
    }

    const json = editor.getJSON();
    const content = JSON.stringify(json);

    const result = await updateLessonAction(lesson.id, {
      content,
      isPublished,
    });

    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success("Lesson updated successfully!");
  }

  return (
    <section className="max-w-full lg:max-w-2xl xl:max-w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{lesson.name}</h2>
          <Badge variant={lesson.isPublished ? "default" : "secondary"}>
            {lesson.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleUpdateLesson}>
            Save changes
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8"
            onClick={async () =>
              await deleteLessonAction(
                lesson.id,
                `/teach/course/${lesson.courseSlug}`
              )
            }
          >
            <Trash2 className="size-4 text-rose-500 dark:text-rose-400" />
          </Button>
        </div>
      </div>

      <form>
        <div className="mt-4 flex flex-col gap-4 xl:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                {/* Preview */}
                {/* <div className="flex flex-row items-center justify-between rounded-md border px-4 py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="access" className="text-">
                      Free preview
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow students to preview this lesson for free.
                    </p>
                  </div>
                  <Switch
                    id="access"
                    checked={isFree}
                    onCheckedChange={setIsFree}
                  />
                </div> */}
                {/* Publish */}
                <div className="flex flex-row items-center justify-between rounded-md border px-4 py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="publish" className="text-">
                      Publish
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Publish this lesson to make it available to students.
                    </p>
                  </div>
                  <Switch
                    id="publish"
                    checked={isPublished}
                    onCheckedChange={toggleIsPublished}
                  />
                </div>
              </div>
            </div>

            {/* Video */}
            <div className="flex flex-1 flex-col gap-3 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h3 className="flex-1 text-sm font-medium">Lesson video</h3>

                {lesson.video?.playbackId && videoStatus === "ready" && (
                  <div className="flex flex-1 items-center justify-end">
                    <MuxUploader
                      noDrop
                      noProgress
                      noRetry
                      noStatus
                      className="hidden bg-orange-300"
                      id="my-uploader"
                      endpoint={async () => {
                        const response = await createUploadUrl(lesson.id);
                        if (typeof response === "string") {
                          return response;
                        }
                        return response.url;
                      }}
                      onSuccess={() => setVideoStatus("preparing")}
                    ></MuxUploader>

                    <div className="w-full bg-sky-200">
                      <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>

                      <MuxUploaderProgress
                        type="bar"
                        muxUploader="my-uploader"
                        className="w-full [--progress-bar-fill-color:#047857]"
                      ></MuxUploaderProgress>
                    </div>

                    <MuxUploaderFileSelect muxUploader="my-uploader">
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircledIcon className="h-3.5 w-3.5" />
                        <span className="sm:whitespace-nowrap">Change</span>
                      </Button>
                    </MuxUploaderFileSelect>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "flex aspect-video min-h-48 grow items-center justify-center rounded-md bg-muted",
                  videoStatus === "preparing" && "animate-pulse bg-foreground"
                )}
              >
                {videoStatus === "ready" && lesson.video?.playbackId && (
                  <MuxPlayer
                    accentColor="#047857"
                    className="aspect-[16/9] overflow-hidden rounded-md"
                    playbackId={lesson.video.playbackId}
                    metadata={{
                      video_id: lesson.video.assetId,
                      video_title: lesson.name,
                      viewer_user_id: session?.user?.id,
                    }}
                  />
                )}

                {videoStatus === "preparing" && (
                  <div className="text-background">
                    <h4 className="text-xl font-semibold">Processing...</h4>
                    <p className="mt-3 text-sm">
                      This might take a few minutes!
                    </p>
                    <p className="text-sm">
                      Make sure to save changes before leaving this page.
                    </p>
                  </div>
                )}

                {!lesson.video && videoStatus !== "preparing" && (
                  // Default uploader
                  // <MuxUploader
                  //   className='h-full w-full'
                  //   endpoint={async () => await createUploadUrl(lesson.id)}
                  //   onSuccess={() => setVideoStatus('preparing')}
                  // >
                  //   <Button size='sm' className='h-7 gap-1' slot='file-select'>
                  //     <PlusCircledIcon className='h-3.5 w-3.5' />
                  //     <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  //       Select a file
                  //     </span>
                  //   </Button>
                  // </MuxUploader>

                  <MuxUploaderDrop
                    overlay
                    overlayText="Drop to upload"
                    muxUploader="my-uploader"
                    className="h-full w-full rounded-md border border-dashed border-emerald-700 [--overlay-background-color:#047857]"
                  >
                    <MuxUploader
                      noDrop
                      noProgress
                      noRetry
                      noStatus
                      id="my-uploader"
                      className="hidden"
                      endpoint={async () => {
                        const response = await createUploadUrl(lesson.id);
                        return typeof response === "string"
                          ? response
                          : response.url;
                      }}
                      onSuccess={() => setVideoStatus("preparing")}
                    ></MuxUploader>
                    <h1 slot="heading">Drop a video file here to upload</h1>
                    <span
                      slot="separator"
                      className="mt-2 text-sm italic text-muted-foreground"
                    >
                      — or —
                    </span>
                    <div className="w-full">
                      <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>
                      <MuxUploaderProgress
                        className="text-sm font-semibold text-emerald-700 sm:text-base"
                        muxUploader="my-uploader"
                        type="percentage"
                      ></MuxUploaderProgress>
                      <MuxUploaderProgress
                        type="bar"
                        muxUploader="my-uploader"
                        className="[--progress-bar-fill-color:#047857] [--progress-bar-height:8px] sm:[--progress-bar-height:10px]"
                      ></MuxUploaderProgress>
                    </div>
                    <MuxUploaderFileSelect
                      muxUploader="my-uploader"
                      className="mt-4"
                    >
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircledIcon className="h-3.5 w-3.5" />
                        <span className="sm:whitespace-nowrap">
                          Select a file
                        </span>
                      </Button>
                    </MuxUploaderFileSelect>
                  </MuxUploaderDrop>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-t-md border bg-muted">
              <h3 className="p-4 text-sm font-medium">Lesson content</h3>
            </div>
            <Editor lesson={lesson} setEditor={setEditor} teacherView />
          </div>
        </div>
      </form>
    </section>
  );
};

export default LessonContentForm;
