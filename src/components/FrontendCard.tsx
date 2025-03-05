
import { LItem, ItemProp } from "@/types";
import { copyToClipboard, formatDate, getIPFSGatewayURL, getPropValue, truncateMiddle } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Copy, Database, Github, CircuitBoard, Waves, CheckCircle, Clock, AlertTriangle, Trash, Ban } from "lucide-react";
import { useState } from "react";
import { EvidenceModal } from "./EvidenceModal";
import { toast } from "sonner";
import { challengeRequest, removeItem } from "@/lib/web3";

interface FrontendCardProps {
  item: LItem;
}

export function FrontendCard({ item }: FrontendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"remove" | "challenge">("remove");
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  // Map status values from LightGeneralizedTCR contract
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Registered":
        return { label: "Registered", icon: <CheckCircle className="h-3 w-3 mr-1" />, color: "bg-green-500/10 text-green-600 backdrop-blur-sm border-green-500/20" };
      case "RegistrationRequested":
        return { label: "Registration Pending", icon: <Clock className="h-3 w-3 mr-1" />, color: "bg-yellow-500/10 text-yellow-600 backdrop-blur-sm border-yellow-500/20" };
      case "ClearingRequested":
        return { label: "Removal Pending", icon: <Clock className="h-3 w-3 mr-1" />, color: "bg-red-500/10 text-red-600 backdrop-blur-sm border-red-500/20" };
      case "Absent":
        return { label: "Not Registered", icon: <AlertTriangle className="h-3 w-3 mr-1" />, color: "bg-gray-500/10 text-gray-600 backdrop-blur-sm border-gray-500/20" };
      default:
        return { label: status, icon: null, color: "bg-gray-500/10 text-gray-600 backdrop-blur-sm border-gray-500/20" };
    }
  };
  
  const statusInfo = getStatusInfo(item.status);

  const openEvidenceModal = (type: "remove" | "challenge") => {
    setActionType(type);
    setEvidenceModalOpen(true);
  };

  const handleSubmitEvidence = async (evidenceURI: string) => {
    try {
      setIsProcessing(true);
      
      if (actionType === "remove") {
        await removeItem(item.itemID, evidenceURI);
        toast.success("Removal request submitted successfully");
      } else {
        await challengeRequest(item.itemID, evidenceURI);
        toast.success("Challenge submitted successfully");
      }

    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Failed to process transaction. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderActionButton = () => {
    if (isProcessing) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled
        >
          Processing...
        </Button>
      );
    }

    switch (item.status) {
      case "Registered":
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
            onClick={() => openEvidenceModal("remove")}
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            Suggest Removal
          </Button>
        );
      case "RegistrationRequested":
      case "ClearingRequested":
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
            onClick={() => openEvidenceModal("challenge")}
          >
            <Ban className="h-3.5 w-3.5 mr-1" />
            Challenge Request
          </Button>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden animate-slide-up w-full">
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="mb-2 bg-hawaii-blue/10 text-hawaii-blue backdrop-blur-sm border-hawaii-blue/20">
                <Waves className="h-3 w-3 mr-1" />
                {networkName}
              </Badge>
              
              <Badge variant="outline" className={statusInfo.color}>
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
            </div>
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
            <span className="ipfs-hash flex-1">{commitHash}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(commitHash, "Commit hash copied!")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy full commit hash</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          
          {renderActionButton()}
          
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
      
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        onSubmit={handleSubmitEvidence}
        title={actionType === "remove" ? "Submit Removal Request" : "Challenge Request"}
        description={
          actionType === "remove" 
            ? "Provide evidence for why this frontend should be removed from the registry." 
            : "Provide evidence to challenge this request."
        }
        actionLabel={actionType === "remove" ? "Submit Removal" : "Submit Challenge"}
      />
    </Card>
  );
}
