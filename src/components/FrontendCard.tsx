import { LItem } from "@/types";
import { getIPFSGatewayURL, getPropValue } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { connectWallet, switchToMainnet, ItemStatus } from "@/lib/web3";
import { EvidenceModal } from "./EvidenceModal";
import { FrontendCardHeader } from "./frontend-card/FrontendCardHeader";
import { FrontendCardContent } from "./frontend-card/FrontendCardContent";
import { FrontendCardFooter } from "./frontend-card/FrontendCardFooter";

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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Convert string status to numeric enum value
  const getItemStatusValue = (status: string): number => {
    switch (status) {
      case "Absent": return ItemStatus.Absent;
      case "Registered": return ItemStatus.Registered;
      case "RegistrationRequested": return ItemStatus.RegistrationRequested;
      case "ClearingRequested": return ItemStatus.ClearingRequested;
      default: return -1; // Invalid status
    }
  };

  return (
    <Card className="glass-card overflow-hidden animate-slide-up w-full break-all break-inside-avoid mb-6">
      <FrontendCardHeader
        name={name}
        description={description}
        networkName={networkName}
        status={item.status}
        disputed={item.disputed}
      />

      <FrontendCardContent
        locatorId={locatorId}
        repoUrl={repoUrl}
        commitHash={commitHash}
        versionTag={versionTag}
        additionalInfo={additionalInfo}
        isExpanded={isExpanded}
      />

      <FrontendCardFooter
        submissionTime={submissionTime}
        ipfsGatewayUrl={ipfsGatewayUrl}
        status={item.status}
        onActionInitiate={handleActionInitiate}
        isLoading={isLoading}
        additionalInfo={additionalInfo}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
      />

      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onEvidenceSubmit={handleEvidenceSubmit}
        title={currentAction === "remove" ? "Provide Removal Evidence" : "Provide Challenge Evidence"}
        action={currentAction}
        isLoading={isLoading}
        itemStatus={getItemStatusValue(item.status)}
      />
    </Card>
  );
}
