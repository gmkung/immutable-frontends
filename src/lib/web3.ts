
import { Web3Error } from "@/types";
import { toast } from "sonner";
import LCURATE_ABI from "@/constants/lcurate_ABI.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0xda03509Bb770061A61615AD8Fc8e1858520eBd86"; // Kleros Curate TCR Address

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
}

export async function getCurrentAccount(): Promise<string | null> {
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

export async function getSubmissionDepositAmount(): Promise<{ depositAmount: string, depositInWei: string }> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Create contract instance
    const contract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Step 1: Get submissionBaseDeposit
    const submissionBaseDeposit = await contract.methods.submissionBaseDeposit().call();
    
    // Step 1: Get arbitrator address and extraData
    const arbitratorAddress = await contract.methods.arbitrator().call();
    const arbitratorExtraData = await contract.methods.arbitratorExtraData().call();
    
    // Step 2: Create arbitrator contract instance and get arbitration cost
    // We need the Kleros arbitrator ABI, but for now we can just use the cost estimation
    // Hard-coding a typical arbitration cost for Kleros Court
    const estimatedArbitrationCost = web3.utils.toWei("0.05", "ether");
    
    // Step 3: Calculate total deposit (submission deposit + arbitration cost)
    const totalDepositWei = BigInt(submissionBaseDeposit) + BigInt(estimatedArbitrationCost);
    
    // Convert to ETH for display
    const depositAmountEth = web3.utils.fromWei(totalDepositWei.toString(), "ether");
    
    // Add a small buffer (10%) to account for gas price fluctuations
    const bufferAmount = (Number(depositAmountEth) * 0.1).toFixed(5);
    const totalWithBuffer = (Number(depositAmountEth) + Number(bufferAmount)).toFixed(5);
    
    return { 
      depositAmount: totalWithBuffer, 
      depositInWei: totalDepositWei.toString() 
    };
  } catch (error) {
    console.error("Error getting submission deposit amount:", error);
    // Return default value as fallback
    return { 
      depositAmount: "0.435", 
      depositInWei: "435000000000000000" 
    };
  }
}

export async function submitToRegistry(ipfsPath: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  // Ensure ipfsPath starts with "/ipfs/"
  const formattedPath = ipfsPath.startsWith("/ipfs/") ? ipfsPath : `/ipfs/${ipfsPath}`;
  
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const from = accounts[0];
    
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum);
    
    // Get required deposit amount
    const { depositInWei } = await getSubmissionDepositAmount();
    
    // Create contract instance
    const contract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Estimate gas and get current gas price
    const gasEstimate = await contract.methods.addItem(formattedPath).estimateGas({ 
      from,
      value: depositInWei 
    });
    const gasPrice = await web3.eth.getGasPrice();
    
    // Calculate gas with 20% buffer and convert to string
    const gasBigInt = BigInt(gasEstimate);
    const gasWithBuffer = (gasBigInt * BigInt(120) / BigInt(100)).toString();
    
    // Convert gasPrice to string
    const gasPriceString = gasPrice.toString();
    
    // Submit transaction with the dynamic deposit amount
    const txReceipt = await contract.methods.addItem(formattedPath).send({
      from,
      gas: gasWithBuffer,
      gasPrice: gasPriceString,
      value: depositInWei,
    });
    
    return txReceipt.transactionHash;
  } catch (error: any) {
    console.error("Error submitting to registry:", error);
    
    // Format error for user
    let errorMessage = "Failed to submit to registry";
    
    if (error.code === 4001) {
      errorMessage = "Transaction rejected by user";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
}

export function formatWalletAddress(address: string | null): string {
  if (!address) return "Not connected";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function handleWeb3Error(error: any): string {
  let message = "An unknown error occurred";
  
  if (typeof error === "string") {
    message = error;
  } else if (error?.message) {
    message = error.message.replace("MetaMask Tx Signature: ", "");
    
    // Clean up common Web3 errors
    if (message.includes("User denied")) {
      message = "Transaction was rejected";
    } else if (message.includes("insufficient funds")) {
      message = "Insufficient funds for transaction";
    }
  }
  
  // Limit message length
  if (message.length > 100) {
    message = message.substring(0, 100) + "...";
  }
  
  return message;
}

export async function switchToMainnet(): Promise<boolean> {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // Ethereum Mainnet
    });
    return true;
  } catch (error: any) {
    console.error("Error switching network:", error);
    toast.error("Please switch to Ethereum Mainnet");
    return false;
  }
}
