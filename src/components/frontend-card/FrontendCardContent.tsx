
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Github, CircuitBoard } from "lucide-react";
import { MetadataField } from "./MetadataField";
import { truncateMiddle } from "@/lib/utils";

interface FrontendCardContentProps {
  locatorId: string;
  repoUrl: string;
  commitHash: string;
  versionTag: string;
  additionalInfo: string;
  isExpanded: boolean;
}

export function FrontendCardContent({ 
  locatorId, 
  repoUrl, 
  commitHash, 
  versionTag, 
  additionalInfo,
  isExpanded
}: FrontendCardContentProps) {
  return (
    <CardContent className="pb-3 space-y-4 relative z-10 px-6">
      <div className="space-y-3">
        <MetadataField 
          icon={<Database className="h-4 w-4 text-hawaii-teal" />}
          label="Locator ID"
          value={locatorId}
          truncated={true}
          truncateFunction={truncateMiddle}
          copyable={true}
          copyMessage="IPFS hash copied!"
        />
        
        <MetadataField 
          icon={<Github className="h-4 w-4 text-hawaii-teal" />}
          label="Repository"
          value={repoUrl}
          isLink={true}
        />
        
        <MetadataField 
          icon={<CircuitBoard className="h-4 w-4 text-hawaii-teal" />}
          label="Commit"
          value={commitHash}
          truncated={true}
          truncateFunction={(str) => truncateMiddle(str, 7, 0)}
          copyable={true}
          copyMessage="Commit hash copied!"
          suffix={versionTag && (
            <Badge variant="outline" className="ml-2 bg-hawaii-sand/10 text-hawaii-orange border-hawaii-sand/20">
              {versionTag}
            </Badge>
          )}
        />
      </div>
      
      {isExpanded && additionalInfo !== "N/A" && (
        <div className="mt-5 pt-4 border-t border-hawaii-teal/10 text-sm">
          <h4 className="font-medium mb-2">Additional Information</h4>
          <div className="whitespace-pre-wrap text-muted-foreground text-xs">
            {additionalInfo}
          </div>
        </div>
      )}
    </CardContent>
  );
}
