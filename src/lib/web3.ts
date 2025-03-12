import { registry } from "./registry";
export { ItemStatus, type DepositInfo } from "light-curate-data-service";

export async function connectWallet(): Promise<string> {
  await registry.switchToCorrectChain();
  return registry.connectWallet();
}

export const formatWalletAddress = registry.formatWalletAddress;
export const switchToMainnet = registry.switchToCorrectChain;
export const getCurrentAccount = registry.getCurrentAccount;
export const submitToRegistry = registry.submitToRegistry;
export const handleWeb3Error  = registry.handleWeb3Error;

export const getRemovalDepositAmount = registry.getRemovalDepositAmount;
export const getSubmissionDepositAmount = registry.getSubmissionDepositAmount;
export const getSubmissionChallengeDepositAmount = registry.getSubmissionChallengeDepositAmount;
export const getRemovalChallengeDepositAmount = registry.getRemovalChallengeDepositAmount;

export const removeItem = async (itemId: string, evidence: string) => {
  return registry.removeItem(itemId, evidence);
};

export const challengeRequest = async (itemId: string, evidence: string) => {
  return registry.challengeRequest(itemId, evidence);
};
