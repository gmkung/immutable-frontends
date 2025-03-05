
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ActionButtons } from "./ActionButtons";

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
      {/* First row: Submission time and Action buttons */}
      <div className="w-full flex justify-between items-center">
        {submissionTime && (
          <span>Listed {formatDate(submissionTime)}</span>
        )}
        
        <ActionButtons 
          status={status}
          ipfsGatewayUrl={ipfsGatewayUrl}
          onActionInitiate={onActionInitiate}
          isLoading={isLoading}
        />
      </div>
      
      {/* Show more button at the bottom */}
      {additionalInfo !== "N/A" && (
        <div className="w-full flex justify-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs hover:text-hawaii-teal px-0"
            onClick={onToggleExpand}
          >
            {isExpanded ? "▲" : "▼"}
          </Button>
        </div>
      )}
    </CardFooter>
  );
}
