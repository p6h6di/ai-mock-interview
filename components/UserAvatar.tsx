import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

const UserAvatar = ({
  avatar,
  sizes,
}: {
  avatar: string | null | undefined;
  sizes?: string;
}) => {
  return (
    <Avatar className={cn(sizes)}>
      <AvatarImage src={avatar || ""} />
      <AvatarFallback>
        <Icons.user className="size-5 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
