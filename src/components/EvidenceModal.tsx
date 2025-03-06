import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import { toast } from "sonner";
import { getRemovalDepositAmount, DepositInfo } from "@/lib/web3";
import { getSubmissionChallengeDepositAmount, getRemovalChallengeDepositAmount } from "@/lib/web3";
import { ItemStatus } from "@/lib/web3";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceSubmit: (ipfsURI: string) => void;
  title: string;
  action: "remove" | "challenge";
  isLoading: boolean;
  itemStatus?: number;
}

export function EvidenceModal({
  isOpen,
  onClose,
  onEvidenceSubmit,
  title,
  action,
  isLoading,
  itemStatus
}: EvidenceModalProps) {
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [depositBreakdown, setDepositBreakdown] = useState<DepositInfo["breakdown"] | null>(null);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);

  useEffect(() => {
    // Fetch deposit amount when modal is open
    console.log(action)
    console.log(itemStatus)
    if (isOpen && (action === "remove" || action === "challenge")) {
      const fetchDepositAmount = async () => {
        try {
          setIsLoadingDeposit(true);
          let depositInfo;
          
          if (action === "remove") {
            // For removal requests
            depositInfo = await getRemovalDepositAmount();
          } else if (action === "challenge") {
            // For challenge requests, use the appropriate deposit based on item status
            if (itemStatus === ItemStatus.RegistrationRequested) {
              // Challenge a registration request
              depositInfo = await getSubmissionChallengeDepositAmount();
            } else if (itemStatus === ItemStatus.ClearingRequested) {
              // Challenge a removal request
              depositInfo = await getRemovalChallengeDepositAmount();
            } else {
              console.error("Invalid item status for challenge:", itemStatus);
              toast.error("Cannot determine deposit amount for this item status");
              return;
            }
          }
          
          if (depositInfo) {
            setDepositBreakdown(depositInfo.breakdown);
          }
        } catch (error) {
          console.error(`Failed to fetch ${action} deposit amount:`, error);
          toast.error("Failed to fetch deposit information");
        } finally {
          setIsLoadingDeposit(false);
        }
      };

      fetchDepositAmount();
    }
  }, [isOpen, action, itemStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!evidenceTitle.trim()) {
      toast.error("Please provide a title for your evidence");
      return;
    }

    if (!evidenceDescription.trim()) {
      toast.error("Please provide a description for your evidence");
      return;
    }

    try {
      setIsUploading(true);

      // Create evidence JSON object
      const evidenceData = {
        title: evidenceTitle,
        description: evidenceDescription
      };

      // Upload to IPFS
      const ipfsURI = await uploadJSONToIPFS(evidenceData);

      // Pass the IPFS URI back to the parent component
      onEvidenceSubmit(ipfsURI);

    } catch (error) {
      console.error("Failed to upload evidence:", error);
      toast.error("Failed to upload evidence to IPFS");
    } finally {
      setIsUploading(false);
      // Reset form
      setEvidenceTitle("");
      setEvidenceDescription("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {action === "remove" ? (
              "Provide evidence to support your removal request for this registered frontend."
            ) : itemStatus === ItemStatus.RegistrationRequested ? (
              "Provide evidence to challenge this frontend's registration request."
            ) : itemStatus === ItemStatus.ClearingRequested ? (
              "Provide evidence to challenge this frontend's removal request."
            ) : (
              "Provide evidence to support your action."
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="evidence-title" className="text-sm font-medium">
              Evidence Title
            </label>
            <Input
              id="evidence-title"
              placeholder="Provide a title for your evidence"
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
              disabled={isUploading || isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="evidence-description" className="text-sm font-medium">
              Evidence Description
            </label>
            <Textarea
              id="evidence-description"
              placeholder="Describe your reasons in detail..."
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
              rows={5}
              disabled={isUploading || isLoading}
              required
            />
          </div>
          
          {(action === "remove" || action === "challenge") && (
            <div className="p-4 bg-secondary/30 rounded-md">
              <h3 className="text-sm font-medium mb-2">
                {action === "remove" ? "Removal Request Deposit:" : 
                 itemStatus === ItemStatus.RegistrationRequested ? "Registration Challenge Deposit:" :
                 "Removal Challenge Deposit:"}
              </h3>
              {isLoadingDeposit ? (
                <div className="text-sm text-muted-foreground">Loading deposit information...</div>
              ) : depositBreakdown ? (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Deposit:</span>
                    <span>{depositBreakdown.baseDeposit} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arbitration Cost:</span>
                    <span>{depositBreakdown.arbitrationCost} ETH</span>
                  </div>
                  <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{depositBreakdown.total} ETH</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Failed to load deposit information</div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {action === "remove" 
                  ? "This deposit is required to submit your removal request for a registered frontend."
                  : itemStatus === ItemStatus.RegistrationRequested
                    ? "This deposit is required to challenge a frontend's registration request."
                    : "This deposit is required to challenge a frontend's removal request."
                } Your deposit is fully refundable if your claim is correct. You'll be prompted to approve this transaction in your wallet.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || isLoading}
            >
              {isUploading || isLoading ?
                `${isUploading ? 'Uploading...' : 'Processing...'}` :
                `Submit ${action === 'remove' ? 'Removal' : 'Challenge'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
