import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, Ban } from "lucide-react";

interface ActionButtonsProps {
  status: string;
  ipfsGatewayUrl: string;
  onActionInitiate: () => Promise<void>;
  isLoading: boolean;
  disputed: boolean;
}

export function ActionButtons({
  status,
  ipfsGatewayUrl,
  onActionInitiate,
  isLoading,
  disputed
}: ActionButtonsProps) {
  const getActionButtonText = () => {
    switch (status) {
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
    switch (status) {
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
    <div className="flex justify-between w-full">
      <Button
        variant="default"
        size="sm"
        className="h-8 text-xs futuristic-button"
        onClick={() => window.open(ipfsGatewayUrl, "_blank")}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1" />
        Open Frontend
      </Button>

      {status !== "Absent" && (
        <Button
          variant="outline"
          size="sm"
          className={`h-8 text-xs ${disputed ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onActionInitiate}
          disabled={isLoading || status === "Absent" || disputed}
          title={disputed ? "No actions available for disputed items" : ""}
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
  );
}
