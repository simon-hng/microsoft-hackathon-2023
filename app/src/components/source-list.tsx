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
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <p>Sources:</p>
        </div>
        <ul className="flex flex-col gap-1 lg:flex-row lg:items-center">
          {sources.map((href, index) => (
            <li key={index}>
              <LinkPreview href={href} title={href} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
