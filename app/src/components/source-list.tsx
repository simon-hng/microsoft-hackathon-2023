import "@radix-ui/react-hover-card";
import { BookOpen, File } from "@phosphor-icons/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface Source  {
  metadata: Record<string, string>
}

const SourceView = ({source}: {source: Source}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <File className="w-6 h-6"/>
      </HoverCardTrigger>
        <HoverCardContent className="z-10 w-min bg-white p-5 data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all">
          <div className="flex justify-between space-x-4 max-h-80 overflow-y-scroll">
            <div className="space-y-2">
            {Object.entries(source.metadata).map(([key, value]) =>
              (
              <div className="flex flex-col gap-2">
                <dt className="text-gray-500">{key}:</dt>
                <dd className="font-semibold">{value}</dd>
              </div>))
            }
            </div>
          </div>
        </HoverCardContent>
    </HoverCard>
  )
}

interface SourceListProps{
  sources: Source[]
}
export const SourceList = ({sources}: SourceListProps) => {
  return (
    <div className="dark:text-dark-300 mt-3 flex items-center gap-2 text-sm text-gray-700">
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <p>Sources:</p>
        </div>
        <ul className="flex gap-1">
          {sources?.map((source, index) => (
            <li key={index}>
              <SourceView source={source}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
