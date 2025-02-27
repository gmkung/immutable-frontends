
import { LItem, ItemProp } from "@/types";
import { copyToClipboard, formatDate, getIPFSGatewayURL, getPropValue, truncateMiddle } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Copy, Database, Github, FileCode, Waves, CircuitBoard } from "lucide-react";
import { useState } from "react";

interface FrontendCardProps {
  item: LItem;
}

export function FrontendCard({ item }: FrontendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const props = item.metadata.props;
  const name = getPropValue(props, "Name");
  const description = getPropValue(props, "Description");
  const networkName = getPropValue(props, "Network name");
  const locatorId = getPropValue(props, "Locator ID");
  const repoUrl = getPropValue(props, "Repository URL");
  const commitHash = getPropValue(props, "Commit hash");
  const versionTag = getPropValue(props, "Version tag (optional)");
  const additionalInfo = getPropValue(props, "Additional information (Optional)");
  
  const ipfsGatewayUrl = getIPFSGatewayURL(locatorId);
  const submissionTime = item.requests[0]?.submissionTime || "";
  
  return (
    <Card className="glass-card overflow-hidden animate-slide-up w-full">
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2 bg-hawaii-blue/10 text-hawaii-blue backdrop-blur-sm border-hawaii-blue/20">
              <Waves className="h-3 w-3 mr-1" />
              {networkName}
            </Badge>
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-3 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4 text-hawaii-teal" />
            <span className="font-medium mr-1">Locator ID:</span>
            <span className="ipfs-hash flex-1">{truncateMiddle(locatorId, 8, 6)}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(locatorId, "IPFS hash copied!")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy hash</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Github className="h-4 w-4 text-hawaii-teal" />
            <span className="font-medium mr-1">Repository:</span>
            <a 
              href={repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-hawaii-blue hover:underline flex-1 truncate"
            >
              {repoUrl}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <CircuitBoard className="h-4 w-4 text-hawaii-teal" />
            <span className="font-medium mr-1">Commit:</span>
            <span className="ipfs-hash flex-1">{truncateMiddle(commitHash, 7, 0)}</span>
            {versionTag && (
              <Badge variant="outline" className="ml-2 bg-hawaii-sand/10 text-hawaii-orange border-hawaii-sand/20">
                {versionTag}
              </Badge>
            )}
          </div>
        </div>
        
        {isExpanded && additionalInfo !== "N/A" && (
          <div className="mt-4 pt-4 border-t border-hawaii-teal/10 text-sm">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <div className="whitespace-pre-wrap text-muted-foreground text-xs">
              {additionalInfo}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2 text-xs text-muted-foreground border-t border-hawaii-teal/10 relative z-10">
        <div>
          {submissionTime && (
            <span>Listed {formatDate(submissionTime)}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {additionalInfo !== "N/A" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover:text-hawaii-teal"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs futuristic-button"
            onClick={() => window.open(ipfsGatewayUrl, "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Open Frontend
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
