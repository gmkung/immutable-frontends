import { getWeb3Instances } from "./core";
import {
  getSubmissionDepositAmount,
  getSubmissionChallengeDepositAmount,
  getRemovalDepositAmount,
  getRemovalChallengeDepositAmount,
} from "./deposits";
import { ZERO_ADDRESS } from "./types";

// Add this interface near the top of the file
interface ItemInfo {
  numberOfRequests: string | number;
  // add other properties if needed
}

// Add this interface near the top with the other interface
interface RequestInfo {
  parties: string[];
  // add other properties if needed
}

/**
 * Remove an item from the registry
 */
export async function removeItem(
  itemID: string,
  evidenceURI: string
): Promise<void> {
  const { web3, registry } = await getWeb3Instances();

  try {
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get required deposit amount
    const depositAmount = await getRemovalDepositAmount();
    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }

    // Format evidence URI to match expected format
    const formattedEvidence = evidenceURI.startsWith("/ipfs/")
      ? evidenceURI
      : `/ipfs/${evidenceURI}`;

    // Convert ETH to Wei for the transaction
    const depositWei = web3.utils.toWei(depositAmount, "ether");

    // Submit transaction - use string for gas (converted from number)
    await registry.methods.removeItem(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositWei,
      gas: "500000",
    });
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
}

/**
 * Challenge a request
 */
export async function challengeRequest(
  itemID: string,
  evidenceURI: string
): Promise<void> {
  const { web3, registry } = await getWeb3Instances();

  try {
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get item info to determine which deposit to use
    const itemInfo = (await registry.methods
      .getItemInfo(itemID)
      .call()) as ItemInfo;
    if (!itemInfo) {
      throw new Error("Could not retrieve item information");
    }

    // Safely get the number of requests
    let requestID = 0;
    if (itemInfo && typeof itemInfo === "object") {
      const requestsCount = itemInfo.numberOfRequests ?? "0";
      const parsedRequestsCount = parseInt(requestsCount.toString(), 10);
      if (parsedRequestsCount !== 0) {
        requestID = parsedRequestsCount - 1;
      }
    }

    // Get request info
    const requestInfo = (await registry.methods
      .getRequestInfo(itemID, requestID)
      .call()) as RequestInfo;
    if (!requestInfo) {
      throw new Error("Could not retrieve request information");
    }

    // Check if parties property exists and is an array with at least 2 elements
    let depositAmount: string;

    // Safely access the parties array
    if (
      requestInfo &&
      typeof requestInfo === "object" &&
      requestInfo.parties &&
      Array.isArray(requestInfo.parties) &&
      requestInfo.parties.length >= 2 &&
      requestInfo.parties[1] === ZERO_ADDRESS
    ) {
      // This is a registration request (submitter is in position 0)
      depositAmount = await getSubmissionChallengeDepositAmount();
    } else {
      // This is a removal request (submitter is in position 1)
      depositAmount = await getRemovalChallengeDepositAmount();
    }

    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }

    // Format evidence URI to match expected format
    const formattedEvidence = evidenceURI.startsWith("/ipfs/")
      ? evidenceURI
      : `/ipfs/${evidenceURI}`;

    // Convert ETH to Wei for the transaction
    const depositWei = web3.utils.toWei(depositAmount, "ether");

    // Submit transaction - use string for gas (converted from number)
    await registry.methods.challengeRequest(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositWei,
      gas: "500000",
    });
  } catch (error) {
    console.error("Error challenging request:", error);
    throw error;
  }
}

/**
 * Submit an item to the registry
 */
export async function submitItem(itemString: string): Promise<void> {
  const { web3, registry } = await getWeb3Instances();

  try {
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get required deposit amount
    const depositInfo = await getSubmissionDepositAmount();
    if (!depositInfo || !depositInfo.depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }

    // Convert ETH to Wei for the transaction
    const depositWei = web3.utils.toWei(depositInfo.depositAmount, "ether");

    // Submit transaction - use string for gas (converted from number)
    await registry.methods.addItem(itemString).send({
      from: accounts[0],
      value: depositWei,
      gas: "500000",
    });
  } catch (error) {
    console.error("Error submitting item:", error);
    throw error;
  }
}

/**
 * Submit item to registry - public interface for components
 */
export async function submitToRegistry(ipfsHash: string): Promise<string> {
  try {
    await submitItem(ipfsHash);
    return "Transaction submitted successfully";
  } catch (error) {
    console.error("Error submitting to registry:", error);
    throw error;
  }
}
