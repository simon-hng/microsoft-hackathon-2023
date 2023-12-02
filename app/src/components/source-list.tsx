import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { BookOpen } from "@phosphor-icons/react";

export const SourceList = () => {
  const sources = [
    {
      title: "www.TUM.de",
      href: "http://www.tum.de",
      preview: {
        title: "TUM. The Entrepreneurial - Technical University of Munich",
        description: `is a leading university for natural sciences and engineering in
            Germany and the world. Learn about its innovation, talent,
            excellence and responsibility, and discover its news, research
            results and upcoming events.
              `,
      },
    },
    {
      title: "www.timeshighereducation.com",
      href: "https://www.timeshighereducation.com/world-university-rankings/technical-university-munich",
      preview: {
        title:
          "Technical University of Munich | World University Rankings | THE",
        description: `TUM draws its strength from the research and education excellence of its seven TUM Schools and reinforces transdisciplinary innovations through mission-driven Integrative Research Institutes. In response to rapid societal change in the age of digitalization and biologization, TUM has been fundamentally reforming the concept of engineering ...
              `,
      },
    },
  ];

  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-300 text-sm mt-3">
      <BookOpen className="w-6 h-6" />
      <div className="space-x-2 flex">
        <p>Sources:</p>
        {sources.map((source, index) => (
          <SourceItem source={source} key={index} />
        ))}
      </div>
    </div>
  );
};

interface SourceItemProps {
  source: {
    title: string;
    href: string;
    preview: {
      title: string;
      description: string;
    };
  };
}

const SourceItem = ({ source }: SourceItemProps) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Link href={source.href} className="underline underline-offset-2">
        {source.title}
      </Link>
    </HoverCardTrigger>
    <HoverCardContent className="w-80 data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade bg-white p-5 data-[state=open]:transition-all z-10">
      <div className="flex justify-between space-x-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{source.preview.title}</h4>
          <p className="text-sm">{source.preview.description}</p>
          <Link
            className="flex text-blue-500 underline"
            target="_blank"
            href={source.href}
          >
            Visit Source
          </Link>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);
