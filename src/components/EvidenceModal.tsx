
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import { toast } from "sonner";
import { getRemovalDepositAmount } from "@/lib/web3";

interface DepositBreakdown {
  removalBaseDeposit: string;
  arbitrationCost: string;
  total: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceSubmit: (ipfsURI: string) => void;
  title: string;
  action: "remove" | "challenge";
  isLoading: boolean;
}

export function EvidenceModal({
  isOpen,
  onClose,
  onEvidenceSubmit,
  title,
  action,
  isLoading
}: EvidenceModalProps) {
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [depositBreakdown, setDepositBreakdown] = useState<DepositBreakdown | null>(null);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);

  useEffect(() => {
    // Only fetch deposit amount when modal is open and action is "remove"
    if (isOpen && action === "remove") {
      const fetchDepositAmount = async () => {
        try {
          setIsLoadingDeposit(true);
          const depositInfo = await getRemovalDepositAmount();
          setDepositBreakdown(depositInfo.breakdown);
        } catch (error) {
          console.error("Failed to fetch deposit amount:", error);
          toast.error("Failed to fetch deposit information");
        } finally {
          setIsLoadingDeposit(false);
        }
      };

      fetchDepositAmount();
    }
  }, [isOpen, action]);

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
          
          {action === "remove" && (
            <div className="p-4 bg-secondary/30 rounded-md">
              <h3 className="text-sm font-medium mb-2">Deposit Required:</h3>
              {isLoadingDeposit ? (
                <div className="text-sm text-muted-foreground">Loading deposit information...</div>
              ) : depositBreakdown ? (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Deposit:</span>
                    <span>{depositBreakdown.removalBaseDeposit} ETH</span>
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
                This deposit will be required to submit your removal request. You'll be prompted to approve this transaction in your wallet.
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
