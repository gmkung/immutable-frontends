declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCurrentAccount, formatWalletAddress, connectWallet } from "@/lib/web3";
import { PlusCircle, Wallet, Zap, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { AboutModal } from "@/components/AboutModal";

export function Header() {
  const [account, setAccount] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkConnection = async () => {
      const currentAccount = await getCurrentAccount();
      setAccount(currentAccount);
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setAccount(address);
      toast.success("Wallet connected successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 backdrop-blur-xl ${scrolled ? "bg-background/70 shadow-sm border-b border-gothic-ash/20" : "bg-transparent"
        }`}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Zap className="h-6 w-6 text-gothic-violet animate-flicker" />
            <Shield className="h-4 w-4 text-gothic-gold absolute -top-1 -right-1 animate-glow" />
          </div>
          <Link to="/" className="font-gothic font-medium text-lg flex items-center gap-x-1.5">
            <span className="gradient-text shadow-text">Immutable Frontends</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-gothic-silver hover:text-gothic-platinum hover:bg-gothic-slate/30"
            onClick={() => setAboutModalOpen(true)}
          >
            <Info className="h-4 w-4 mr-1" />
            About
          </Button>

          {location.pathname !== "/submit" && (
            <Button asChild variant="outline" size="sm" className="gap-1 gothic-border text-gothic-platinum hover:bg-gothic-violet/20">
              <Link to="/submit">
                <PlusCircle className="h-4 w-4 mr-1" />
                Submit Frontend
              </Link>
            </Button>
          )}

          <Button
            variant={account ? "outline" : "default"}
            size="sm"
            className={cn(
              "gap-1",
              account ? "gothic-border text-gothic-platinum hover:bg-gothic-violet/20" : "gothic-button"
            )}
            onClick={handleConnect}
          >
            <Wallet className="h-4 w-4 mr-1" />
            {account ? formatWalletAddress(account) : "Connect Wallet"}
          </Button>
        </div>
      </Container>

      <AboutModal
        open={aboutModalOpen}
        onOpenChange={setAboutModalOpen}
      />
    </header>
  );

  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
}
