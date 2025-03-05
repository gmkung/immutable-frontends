
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, Database, Shield } from "lucide-react";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  const registryAddress = "0xda03509Bb770061A61615AD8Fc8e1858520eBd86";
  const etherscanUrl = `https://etherscan.io/address/${registryAddress}`;
  const klerosUrl = `https://curate.kleros.io/tcr/1/${registryAddress}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Immutable Frontends
          </DialogTitle>
          <DialogDescription>
            Information about the registry and data source
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Data Source</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This registry is powered by data from the Kleros Curate TCR system on the Ethereum mainnet.
              </p>
              <Button 
                variant="link" 
                className="h-auto p-0 mt-1"
                onClick={() => window.open(klerosUrl, "_blank")}
              >
                Visit Kleros Curate <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Smart Contract</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Registry Contract Address:
                <code className="block bg-muted px-2 py-1 rounded mt-1 text-xs font-mono">
                  {registryAddress}
                </code>
              </p>
              <Button 
                variant="link" 
                className="h-auto p-0 mt-1"
                onClick={() => window.open(etherscanUrl, "_blank")}
              >
                View on Etherscan <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
