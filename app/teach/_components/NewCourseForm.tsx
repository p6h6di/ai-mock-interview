"use client";

import React, { useEffect } from "react";
import { NewCourseSchema } from "@/validator/course.schema";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "@prisma/client";
import { createSlugFromName } from "@/lib/courses";
import { toast } from "sonner";
import { createNewCourseAction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Inputs = z.infer<typeof NewCourseSchema>;

// Define the expected return type of createNewCourseAction
type ActionResult = {
  error?: string;
  success?: boolean;
};

const NewCourseForm = ({ tags }: { tags: Tag[] }) => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(NewCourseSchema),
  });

  const name = watch("name");
  register("tagId");

  useEffect(() => {
    if (name) {
      const slug = createSlugFromName(name);

      if (slug) {
        setValue("slug", slug, { shouldValidate: true });
      }
    }
  }, [name, setValue]);

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = (await createNewCourseAction(data)) as ActionResult;

      if (result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Course created!");
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
      console.error("Course creation error:", error);
    }
  };

  return (
    <div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(processForm)}>
        <div>
          <Input type="text" placeholder="Course name" {...register("name")} />
          {errors.name?.message && (
            <p className="mt-1 px-2 text-xs text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input type="text" placeholder="Course slug" {...register("slug")} />
          {errors.slug?.message && (
            <p className="mt-1 px-2 text-xs text-red-400">
              {errors.slug.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            rows={5}
            placeholder="Course description"
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="mt-1 px-2 text-xs text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) =>
              setValue("tagId", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tags</SelectLabel>
                {tags && tags.length > 0 ? (
                  tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tags">No tags found</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.tagId?.message && (
            <p className="mt-1 px-2 text-xs text-red-400">
              {errors.tagId.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </div>
  );
};

export default NewCourseForm;
