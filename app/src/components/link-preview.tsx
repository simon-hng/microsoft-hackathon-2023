"use client";

import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { env } from "@/env.mjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function extractDomain(url: string): string | null {
  // Define a regular expression pattern to match the domain
  const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;

  // Use the regular expression to extract the domain
  const match = url.match(domainRegex);

  // Check if a match is found
  if (match && match[1]) {
    return match[1];
  } else {
    // Return null if no match is found
    return null;
  }
}

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
          {extractDomain(href) ?? source?.domain}
        </Link>
      </HoverCardTrigger>
      {source && (
        <HoverCardContent className="z-10 w-80 bg-white p-5 data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all">
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
