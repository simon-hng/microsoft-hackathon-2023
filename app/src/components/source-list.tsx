import "@radix-ui/react-hover-card";
import { BookOpen } from "@phosphor-icons/react";
import { LinkPreview } from "./link-preview";

export const SourceList = () => {
  const sources = [
    "http://www.tum.de",
    "https://www.timeshighereducation.com/world-university-rankings/technical-university-munich",
  ];

  return (
    <div className="dark:text-dark-300 mt-3 flex items-center gap-2 text-sm text-gray-700">
      <BookOpen className="h-6 w-6" />
      <div className="flex space-x-2">
        <p>Sources:</p>
        {sources.map((href, index) => (
          <LinkPreview href={href} key={index} />
        ))}
      </div>
    </div>
  );
};
