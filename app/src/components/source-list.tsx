import "@radix-ui/react-hover-card";
import { BookOpen } from "@phosphor-icons/react";
import { LinkPreview } from "./link-preview";

export const SourceList = () => {
  const sources = [
    "http://www.tum.de",
    "https://www.timeshighereducation.com/world-university-rankings/technical-university-munich",
  ];

  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-300 text-sm mt-3">
      <BookOpen className="w-6 h-6" />
      <div className="space-x-2 flex">
        <p>Sources:</p>
        {sources.map((href, index) => (
          <LinkPreview href={href} key={index} />
        ))}
      </div>
    </div>
  );
};
