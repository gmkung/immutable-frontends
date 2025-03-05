import { Web3Error } from "@/types";
import { toast } from "sonner";
import LCURATE_ABI from "@/constants/lcurate_ABI.json";
import KLEROS_LIQUID_ABI from "@/constants/KlerosLiquid_ABI.json";

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

export async function getChallengePeriodDurationInDays(): Promise<number> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Create TCR contract instance
    const tcrContract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Get challengePeriodDuration in seconds
    const challengePeriodInSeconds = await tcrContract.methods.challengePeriodDuration().call();
    
    // Convert seconds to days (86400 seconds in a day)
    const challengePeriodInDays = Math.ceil(Number(challengePeriodInSeconds) / 86400);
    
    return challengePeriodInDays;
  } catch (error) {
    console.error("Error getting challenge period duration:", error);
    throw new Error("Failed to retrieve challenge period duration");
  }
}

export async function getSubmissionDepositAmount(): Promise<{ 
  depositAmount: string, 
  depositInWei: string,
  breakdown: {
    submissionBaseDeposit: string,
    arbitrationCost: string,
    total: string
  },
  challengePeriodDays: number
}> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Get challenge period duration
    const challengePeriodDays = await getChallengePeriodDurationInDays();
    
    // Create TCR contract instance
    const tcrContract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Step 1: Get submissionBaseDeposit
    const submissionBaseDepositResult = await tcrContract.methods.submissionBaseDeposit().call();
    const submissionBaseDeposit = submissionBaseDepositResult ? submissionBaseDepositResult.toString() : "0";
    
    // Step 2: Get arbitrator address and extra data
    const arbitratorAddress = await tcrContract.methods.arbitrator().call();
    const arbitratorExtraData = await tcrContract.methods.arbitratorExtraData().call();
    
    console.log("Arbitrator address:", arbitratorAddress);
    console.log("Arbitrator extra data:", arbitratorExtraData);
    
    // Step 3: Create Kleros Liquid arbitrator contract instance
    // Check if arbitratorAddress is a valid string
    let arbitrationCost;
    if (arbitratorAddress && typeof arbitratorAddress === 'string') {
      try {
        const arbitratorContract = new web3.eth.Contract(KLEROS_LIQUID_ABI as any, arbitratorAddress);
        
        // Step 4: Get actual arbitration cost
        arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
        console.log("Arbitration cost from contract:", arbitrationCost);
      } catch (error) {
        console.error("Error getting arbitration cost:", error);
        throw new Error("Failed to retrieve arbitration cost");
      }
    } else {
      console.warn("Invalid arbitrator address");
      throw new Error("Invalid arbitrator address");
    }
    
    // Step 5: Calculate total deposit (submission deposit + arbitration cost)
    const totalDepositWei = BigInt(submissionBaseDeposit) + BigInt(arbitrationCost);
    
    // Convert to ETH for display
    const submissionBaseDepositEth = web3.utils.fromWei(submissionBaseDeposit, "ether");
    const arbitrationCostEth = web3.utils.fromWei(arbitrationCost.toString(), "ether");
    const depositAmountEth = web3.utils.fromWei(totalDepositWei.toString(), "ether");
    
    console.log("Deposit calculation breakdown:", {
      submissionBaseDeposit: submissionBaseDepositEth,
      arbitrationCost: arbitrationCostEth,
      base_plus_arbitration: depositAmountEth,
      total: depositAmountEth
    });
    
    return { 
      depositAmount: depositAmountEth,
      depositInWei: totalDepositWei.toString(),
      breakdown: {
        submissionBaseDeposit: submissionBaseDepositEth,
        arbitrationCost: arbitrationCostEth,
        total: depositAmountEth
      },
      challengePeriodDays
    };
  } catch (error) {
    console.error("Error getting submission deposit amount:", error);
    throw new Error(`Failed to calculate required deposit amount: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSubmissionChallengeDepositAmount(): Promise<{ 
  depositAmount: string, 
  depositInWei: string,
  breakdown: {
    submissionChallengeBaseDeposit: string,
    arbitrationCost: string,
    total: string
  },
  challengePeriodDays: number
}> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Get challenge period duration
    const challengePeriodDays = await getChallengePeriodDurationInDays();
    
    // Create TCR contract instance
    const tcrContract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Step 1: Get submissionChallengeBaseDeposit
    const submissionChallengeBaseDepositResult = await tcrContract.methods.submissionChallengeBaseDeposit().call();
    const submissionChallengeBaseDeposit = submissionChallengeBaseDepositResult ? submissionChallengeBaseDepositResult.toString() : "0";
    
    // Step 2: Get arbitrator address and extra data
    const arbitratorAddress = await tcrContract.methods.arbitrator().call();
    const arbitratorExtraData = await tcrContract.methods.arbitratorExtraData().call();
    
    console.log("Arbitrator address:", arbitratorAddress);
    console.log("Arbitrator extra data:", arbitratorExtraData);
    
    // Step 3: Create Kleros Liquid arbitrator contract instance
    // Check if arbitratorAddress is a valid string
    let arbitrationCost;
    if (arbitratorAddress && typeof arbitratorAddress === 'string') {
      try {
        const arbitratorContract = new web3.eth.Contract(KLEROS_LIQUID_ABI as any, arbitratorAddress);
        
        // Step 4: Get actual arbitration cost
        arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
        console.log("Arbitration cost from contract:", arbitrationCost);
      } catch (error) {
        console.error("Error getting arbitration cost:", error);
        throw new Error("Failed to retrieve arbitration cost");
      }
    } else {
      console.warn("Invalid arbitrator address");
      throw new Error("Invalid arbitrator address");
    }
    
    // Step 5: Calculate total deposit (submission challenge deposit + arbitration cost)
    const totalDepositWei = BigInt(submissionChallengeBaseDeposit) + BigInt(arbitrationCost);
    
    // Convert to ETH for display
    const submissionChallengeBaseDepositEth = web3.utils.fromWei(submissionChallengeBaseDeposit, "ether");
    const arbitrationCostEth = web3.utils.fromWei(arbitrationCost.toString(), "ether");
    const depositAmountEth = web3.utils.fromWei(totalDepositWei.toString(), "ether");
    
    console.log("Challenge Deposit calculation breakdown:", {
      submissionChallengeBaseDeposit: submissionChallengeBaseDepositEth,
      arbitrationCost: arbitrationCostEth,
      base_plus_arbitration: depositAmountEth,
      total: depositAmountEth
    });
    
    return { 
      depositAmount: depositAmountEth,
      depositInWei: totalDepositWei.toString(),
      breakdown: {
        submissionChallengeBaseDeposit: submissionChallengeBaseDepositEth,
        arbitrationCost: arbitrationCostEth,
        total: depositAmountEth
      },
      challengePeriodDays
    };
  } catch (error) {
    console.error("Error getting submission challenge deposit amount:", error);
    throw new Error(`Failed to calculate required challenge deposit amount: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getRemovalDepositAmount(): Promise<{ 
  depositAmount: string, 
  depositInWei: string,
  breakdown: {
    removalBaseDeposit: string,
    arbitrationCost: string,
    total: string
  },
  challengePeriodDays: number
}> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Get challenge period duration
    const challengePeriodDays = await getChallengePeriodDurationInDays();
    
    // Create TCR contract instance
    const tcrContract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Step 1: Get removalBaseDeposit
    const removalBaseDepositResult = await tcrContract.methods.removalBaseDeposit().call();
    const removalBaseDeposit = removalBaseDepositResult ? removalBaseDepositResult.toString() : "0";
    
    // Step 2: Get arbitrator address and extra data
    const arbitratorAddress = await tcrContract.methods.arbitrator().call();
    const arbitratorExtraData = await tcrContract.methods.arbitratorExtraData().call();
    
    console.log("Arbitrator address:", arbitratorAddress);
    console.log("Arbitrator extra data:", arbitratorExtraData);
    
    // Step 3: Create Kleros Liquid arbitrator contract instance
    // Check if arbitratorAddress is a valid string
    let arbitrationCost;
    if (arbitratorAddress && typeof arbitratorAddress === 'string') {
      try {
        const arbitratorContract = new web3.eth.Contract(KLEROS_LIQUID_ABI as any, arbitratorAddress);
        
        // Step 4: Get actual arbitration cost
        arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
        console.log("Arbitration cost from contract:", arbitrationCost);
      } catch (error) {
        console.error("Error getting arbitration cost:", error);
        throw new Error("Failed to retrieve arbitration cost");
      }
    } else {
      console.warn("Invalid arbitrator address");
      throw new Error("Invalid arbitrator address");
    }
    
    // Step 5: Calculate total deposit (removal deposit + arbitration cost)
    const totalDepositWei = BigInt(removalBaseDeposit) + BigInt(arbitrationCost);
    
    // Convert to ETH for display
    const removalBaseDepositEth = web3.utils.fromWei(removalBaseDeposit, "ether");
    const arbitrationCostEth = web3.utils.fromWei(arbitrationCost.toString(), "ether");
    const depositAmountEth = web3.utils.fromWei(totalDepositWei.toString(), "ether");
    
    console.log("Removal Deposit calculation breakdown:", {
      removalBaseDeposit: removalBaseDepositEth,
      arbitrationCost: arbitrationCostEth,
      base_plus_arbitration: depositAmountEth,
      total: depositAmountEth
    });
    
    return { 
      depositAmount: depositAmountEth,
      depositInWei: totalDepositWei.toString(),
      breakdown: {
        removalBaseDeposit: removalBaseDepositEth,
        arbitrationCost: arbitrationCostEth,
        total: depositAmountEth
      },
      challengePeriodDays
    };
  } catch (error) {
    console.error("Error getting removal deposit amount:", error);
    throw new Error(`Failed to calculate required removal deposit amount: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getRemovalChallengeDepositAmount(): Promise<{ 
  depositAmount: string, 
  depositInWei: string,
  breakdown: {
    removalChallengeBaseDeposit: string,
    arbitrationCost: string,
    total: string
  },
  challengePeriodDays: number
}> {
  try {
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    
    // Get challenge period duration
    const challengePeriodDays = await getChallengePeriodDurationInDays();
    
    // Create TCR contract instance
    const tcrContract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Step 1: Get removalChallengeBaseDeposit
    const removalChallengeBaseDepositResult = await tcrContract.methods.removalChallengeBaseDeposit().call();
    const removalChallengeBaseDeposit = removalChallengeBaseDepositResult ? removalChallengeBaseDepositResult.toString() : "0";
    
    // Step 2: Get arbitrator address and extra data
    const arbitratorAddress = await tcrContract.methods.arbitrator().call();
    const arbitratorExtraData = await tcrContract.methods.arbitratorExtraData().call();
    
    console.log("Arbitrator address:", arbitratorAddress);
    console.log("Arbitrator extra data:", arbitratorExtraData);
    
    // Step 3: Create Kleros Liquid arbitrator contract instance
    // Check if arbitratorAddress is a valid string
    let arbitrationCost;
    if (arbitratorAddress && typeof arbitratorAddress === 'string') {
      try {
        const arbitratorContract = new web3.eth.Contract(KLEROS_LIQUID_ABI as any, arbitratorAddress);
        
        // Step 4: Get actual arbitration cost
        arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
        console.log("Arbitration cost from contract:", arbitrationCost);
      } catch (error) {
        console.error("Error getting arbitration cost:", error);
        throw new Error("Failed to retrieve arbitration cost");
      }
    } else {
      console.warn("Invalid arbitrator address");
      throw new Error("Invalid arbitrator address");
    }
    
    // Step 5: Calculate total deposit (removal challenge deposit + arbitration cost)
    const totalDepositWei = BigInt(removalChallengeBaseDeposit) + BigInt(arbitrationCost);
    
    // Convert to ETH for display
    const removalChallengeBaseDepositEth = web3.utils.fromWei(removalChallengeBaseDeposit, "ether");
    const arbitrationCostEth = web3.utils.fromWei(arbitrationCost.toString(), "ether");
    const depositAmountEth = web3.utils.fromWei(totalDepositWei.toString(), "ether");
    
    console.log("Removal Challenge Deposit calculation breakdown:", {
      removalChallengeBaseDeposit: removalChallengeBaseDepositEth,
      arbitrationCost: arbitrationCostEth,
      base_plus_arbitration: depositAmountEth,
      total: depositAmountEth
    });
    
    return { 
      depositAmount: depositAmountEth,
      depositInWei: totalDepositWei.toString(),
      breakdown: {
        removalChallengeBaseDeposit: removalChallengeBaseDepositEth,
        arbitrationCost: arbitrationCostEth,
        total: depositAmountEth
      },
      challengePeriodDays
    };
  } catch (error) {
    console.error("Error getting removal challenge deposit amount:", error);
    throw new Error(`Failed to calculate required removal challenge deposit amount: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

export async function removeItem(itemID: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const from = accounts[0];
    
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum);
    
    // Get required deposit amount
    const { depositInWei } = await getRemovalDepositAmount();
    
    // Create contract instance
    const contract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Estimate gas and get current gas price
    const gasEstimate = await contract.methods.removeItem(itemID).estimateGas({ 
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
    const txReceipt = await contract.methods.removeItem(itemID).send({
      from,
      gas: gasWithBuffer,
      gasPrice: gasPriceString,
      value: depositInWei,
    });
    
    return txReceipt.transactionHash;
  } catch (error: any) {
    console.error("Error removing item from registry:", error);
    
    // Format error for user
    let errorMessage = "Failed to remove item from registry";
    
    if (error.code === 4001) {
      errorMessage = "Transaction rejected by user";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
}

export async function challengeRequest(itemID: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const from = accounts[0];
    
    // Create Web3 instance
    const Web3 = (await import("web3")).default;
    const web3 = new Web3(window.ethereum);
    
    // Create contract instance
    const contract = new web3.eth.Contract(LCURATE_ABI as any, CONTRACT_ADDRESS);
    
    // Get the request count - ensure it returns a number
    const requestCountResult = await contract.methods.getNumberOfRequests(itemID).call();
    const requestCount = Number(requestCountResult);
    
    if (requestCount === 0) {
      throw new Error("No request found for this item");
    }
    
    // Get item status to determine which deposit amount to use
    const itemResult = await contract.methods.items(itemID).call();
    
    if (!itemResult) {
      throw new Error("Failed to retrieve item information");
    }
    
    const itemStatus = Number(itemResult.status);
    
    if (isNaN(itemStatus)) {
      throw new Error("Failed to retrieve valid item status");
    }
    
    let depositInfo;
    if (itemStatus === 1) {
      depositInfo = await getSubmissionChallengeDepositAmount();
    } else if (itemStatus === 3) {
      depositInfo = await getRemovalChallengeDepositAmount();
    } else {
      throw new Error("Item not in a challengeable state");
    }
    
    const requestID = requestCount - 1;
    
    // Estimate gas and get current gas price
    const gasEstimate = await contract.methods.challengeRequest(itemID, requestID).estimateGas({ 
      from,
      value: depositInfo.depositInWei 
    });
    const gasPrice = await web3.eth.getGasPrice();
    
    // Calculate gas with 20% buffer and convert to string
    const gasBigInt = BigInt(gasEstimate);
    const gasWithBuffer = (gasBigInt * BigInt(120) / BigInt(100)).toString();
    
    // Convert gasPrice to string
    const gasPriceString = gasPrice.toString();
    
    // Submit challenge transaction
    const txReceipt = await contract.methods.challengeRequest(itemID, requestID).send({
      from,
      gas: gasWithBuffer,
      gasPrice: gasPriceString,
      value: depositInfo.depositInWei,
    });
    
    return txReceipt.transactionHash;
  } catch (error: any) {
    console.error("Error challenging request:", error);
    
    // Format error for user
    let errorMessage = "Failed to challenge request";
    
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
