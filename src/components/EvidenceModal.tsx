
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import { toast } from "sonner";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evidenceURI: string) => Promise<void>;
  title: string;
  description: string;
  actionLabel: string;
}

export function EvidenceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  description, 
  actionLabel 
}: EvidenceModalProps) {
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!evidenceTitle || !evidenceDescription) {
      toast.error("Please provide both a title and description");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload evidence to IPFS
      const evidenceJSON = {
        title: evidenceTitle,
        description: evidenceDescription
      };
      
      const evidenceURI = await uploadJSONToIPFS(evidenceJSON);
      
      // Call the parent's onSubmit with the IPFS URI
      await onSubmit(evidenceURI);
      
      // Close modal and reset form
      setEvidenceTitle("");
      setEvidenceDescription("");
      onClose();
      
    } catch (error) {
      console.error("Error submitting evidence:", error);
      toast.error("Failed to submit evidence. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Evidence Title</Label>
            <Input
              id="title"
              placeholder="e.g., Removal Justification"
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Evidence Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details to support your action..."
              rows={5}
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !evidenceTitle || !evidenceDescription}
            className="ml-2"
          >
            {isSubmitting ? "Submitting..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
