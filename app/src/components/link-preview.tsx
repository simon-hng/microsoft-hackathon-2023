"use client";

import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { env } from "@/env.mjs";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LinkPreviewProps {
  href: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  images: string[];
  sitename: string;
  favicon: string;
  duration: number;
  domain: string;
  url: string;
}

export const LinkPreview = ({ href }: LinkPreviewProps) => {
  const query = useQuery({
    queryKey: ["LinkPreview", href],
    queryFn: () =>
      axios
        .get("https://jsonlink.io/api/extract", {
          params: {
            api_key: env.NEXT_PUBLIC_JSONLINK_API_KEY,
            url: href,
          },
        })
        .then((res) => res.data as LinkMetadata),
  });

  const source = query.data;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={source?.url ?? href}
          className="underline underline-offset-2"
        >
          {source?.domain ?? href}
        </Link>
      </HoverCardTrigger>
      {source && (
        <HoverCardContent className="w-80 data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade bg-white p-5 data-[state=open]:transition-all z-10">
          <div className="flex justify-between space-x-4">
            <div className="space-y-2">
              {source.images.length > 0 && (
                <img src={source.images.at(0) as string} alt={source.title} />
              )}
              <h4 className="text-sm font-semibold">{source.title}</h4>
              <p className="text-sm">{source.description}</p>
              <Link
                className="flex text-blue-500 underline"
                target="_blank"
                href={source.url}
              >
                Visit Source
              </Link>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};
