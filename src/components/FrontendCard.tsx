import { LItem, ItemProp } from "@/types";
import { copyToClipboard, formatDate, getIPFSGatewayURL, getPropValue, truncateMiddle } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Copy, Database, Github, CircuitBoard, Waves, CheckCircle, Clock, AlertTriangle, Trash2, Ban } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { connectWallet, switchToMainnet } from "@/lib/web3";
import { EvidenceModal } from "./EvidenceModal";

interface FrontendCardProps {
  item: LItem;
}

export function FrontendCard({ item }: FrontendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<"remove" | "challenge">("remove");
  
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

  const handleActionInitiate = async () => {
    try {
      const account = await connectWallet();
      const isMainnet = await switchToMainnet();
      
      if (!isMainnet) {
        toast.error("Please switch to Ethereum Mainnet to continue");
        return;
      }

      if (item.status === "Registered") {
        setCurrentAction("remove");
      } else if (item.status === "RegistrationRequested" || item.status === "ClearingRequested") {
        setCurrentAction("challenge");
      } else {
        toast.error("No action available for this status");
        return;
      }
      
      setIsEvidenceModalOpen(true);
    } catch (error: any) {
      console.error("Action error:", error);
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  const handleEvidenceSubmit = async (ipfsURI: string) => {
    try {
      setIsLoading(true);
      
      const { removeItem, challengeRequest } = await import("@/lib/web3");
      
      if (currentAction === "remove") {
        await removeItem(item.itemID, ipfsURI);
        toast.success("Removal request submitted successfully");
      } else if (currentAction === "challenge") {
        await challengeRequest(item.itemID, ipfsURI);
        toast.success("Challenge submitted successfully");
      }
      
      setIsEvidenceModalOpen(false);
    } catch (error: any) {
      console.error("Action error:", error);
      toast.error(error.message || "Failed to perform action");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtonText = () => {
    switch (item.status) {
      case "Registered":
        return "Request Removal";
      case "RegistrationRequested":
      case "ClearingRequested":
        return "Challenge Request";
      default:
        return "";
    }
  };

  const getActionButtonIcon = () => {
    switch (item.status) {
      case "Registered":
        return <Trash2 className="h-3.5 w-3.5 mr-1" />;
      case "RegistrationRequested":
      case "ClearingRequested":
        return <Ban className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden animate-slide-up w-full">
      <CardHeader className="pb-2 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-hawaii-blue/10 text-hawaii-blue backdrop-blur-sm border-hawaii-blue/20">
                <Waves className="h-3 w-3 mr-1" />
                {networkName}
              </Badge>
              
              <Badge variant="outline" className={statusInfo.color}>
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold mt-2">{name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-4 relative z-10 px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 flex-shrink-0 flex justify-center">
              <Database className="h-4 w-4 text-hawaii-teal" />
            </div>
            <span className="font-medium mr-1 whitespace-nowrap">Locator ID:</span>
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
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 flex-shrink-0 flex justify-center">
              <Github className="h-4 w-4 text-hawaii-teal" />
            </div>
            <span className="font-medium mr-1 whitespace-nowrap">Repository:</span>
            <a 
              href={repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-hawaii-blue hover:underline flex-1 truncate"
            >
              {repoUrl}
            </a>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 flex-shrink-0 flex justify-center">
              <CircuitBoard className="h-4 w-4 text-hawaii-teal" />
            </div>
            <span className="font-medium mr-1 whitespace-nowrap">Commit:</span>
            <span className="ipfs-hash flex-1">{truncateMiddle(commitHash, 7, 0)}</span>
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
          <div className="mt-5 pt-4 border-t border-hawaii-teal/10 text-sm">
            <h4 className="font-medium mb-2">Additional Information</h4>
            <div className="whitespace-pre-wrap text-muted-foreground text-xs">
              {additionalInfo}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-4 pb-4 text-xs text-muted-foreground border-t border-hawaii-teal/10 relative z-10 px-6">
        {submissionTime && (
          <div className="w-full text-left">
            <span>Listed {formatDate(submissionTime)}</span>
          </div>
        )}
        
        {additionalInfo !== "N/A" && (
          <div className="w-full flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs hover:text-hawaii-teal px-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "▲" : "▼"}
            </Button>
          </div>
        )}
        
        <div className="w-full flex flex-wrap gap-2 justify-end">
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs futuristic-button"
            onClick={() => window.open(ipfsGatewayUrl, "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Open Frontend
          </Button>

          {item.status !== "Absent" && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleActionInitiate}
              disabled={isLoading || item.status === "Absent"}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-1">⌛</span> Processing...
                </span>
              ) : (
                <>
                  {getActionButtonIcon()}
                  {getActionButtonText()}
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>

      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onEvidenceSubmit={handleEvidenceSubmit}
        title={currentAction === "remove" ? "Provide Removal Evidence" : "Provide Challenge Evidence"}
        action={currentAction}
        isLoading={isLoading}
      />
    </Card>
  );
}
