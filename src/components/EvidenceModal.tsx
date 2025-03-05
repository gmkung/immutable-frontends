
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import { toast } from "sonner";

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
      
      // Reset form
      setEvidenceTitle("");
      setEvidenceDescription("");
      
    } catch (error) {
      console.error("Failed to upload evidence:", error);
      toast.error("Failed to upload evidence to IPFS");
    } finally {
      setIsUploading(false);
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
