
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ActionButtons } from "./ActionButtons";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FrontendCardFooterProps {
  submissionTime: string;
  ipfsGatewayUrl: string;
  status: string;
  onActionInitiate: () => Promise<void>;
  isLoading: boolean;
  additionalInfo: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function FrontendCardFooter({ 
  submissionTime, 
  ipfsGatewayUrl, 
  status, 
  onActionInitiate, 
  isLoading,
  additionalInfo,
  isExpanded,
  onToggleExpand
}: FrontendCardFooterProps) {
  return (
    <CardFooter className="flex flex-col space-y-4 pt-4 pb-4 text-xs text-muted-foreground border-t border-hawaii-teal/10 relative z-10 px-6">
      {/* First row: Submission time */}
      <div className="w-full">
        {submissionTime && (
          <span>Listed {formatDate(submissionTime)}</span>
        )}
      </div>
      
      {/* Second row: Action buttons */}
      <div className="w-full flex justify-end items-center">
        <ActionButtons 
          status={status}
          ipfsGatewayUrl={ipfsGatewayUrl}
          onActionInitiate={onActionInitiate}
          isLoading={isLoading}
        />
      </div>
      
      {/* Show more button at the bottom - full width with chevron */}
      {additionalInfo !== "N/A" && (
        <div className="w-full mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs hover:text-hawaii-teal flex items-center justify-center border-t border-hawaii-teal/10"
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="ml-1">{isExpanded ? "Show less" : "Show more"}</span>
          </Button>
        </div>
      )}
    </CardFooter>
  );
}
