
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCurrentAccount, formatWalletAddress, connectWallet } from "@/lib/web3";
import { Database, PlusCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const [account, setAccount] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Check if user is already connected
  useEffect(() => {
    const checkConnection = async () => {
      const currentAccount = await getCurrentAccount();
      setAccount(currentAccount);
    };
    
    checkConnection();
    
    // Listen for account changes
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
  
  // Add scroll effect to header
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
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 backdrop-blur-xl ${
        scrolled ? "bg-background/70 shadow-sm" : "bg-transparent"
      }`}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Database className="h-5 w-5 text-primary" />
          <Link to="/" className="font-medium text-lg">
            <span>Decentralized Frontends</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {location.pathname !== "/submit" && (
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link to="/submit">
                <PlusCircle className="h-4 w-4 mr-1" />
                Submit Frontend
              </Link>
            </Button>
          )}
          
          <Button
            variant={account ? "outline" : "default"}
            size="sm"
            className="gap-1"
            onClick={handleConnect}
          >
            <Wallet className="h-4 w-4 mr-1" />
            {account ? formatWalletAddress(account) : "Connect Wallet"}
          </Button>
        </div>
      </Container>
    </header>
  );
}
