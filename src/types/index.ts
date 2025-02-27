
export interface ItemProp {
  __typename?: string;
  description: string;
  isIdentifier: boolean;
  label: string;
  type: string;
  value: string | null;
}

export interface LItemMetadata {
  __typename?: string;
  props: ItemProp[];
}

export interface LRound {
  __typename?: string;
  amountPaidChallenger: string;
  amountPaidRequester: string;
  appealPeriodEnd: string;
  appealPeriodStart: string;
  hasPaidChallenger: boolean;
  hasPaidRequester: boolean;
  ruling: string;
}

export interface LRequest {
  __typename?: string;
  challenger: string;
  deposit: string;
  disputeID: string;
  disputed: boolean;
  requester: string;
  resolutionTime: string;
  resolved: boolean;
  rounds: LRound[];
  submissionTime: string;
}

export interface LItem {
  __typename?: string;
  data: string;
  itemID: string;
  metadata: LItemMetadata;
  requests: LRequest[];
  status: string;
}

export interface LRegistry {
  __typename?: string;
  numberOfAbsent: string;
  numberOfChallengedClearing: string;
  numberOfChallengedRegistrations: string;
  numberOfClearingRequested: string;
  numberOfRegistered: string;
  numberOfRegistrationRequested: string;
}

export interface GraphQLResponse {
  data: {
    litems: LItem[];
    lregistry: LRegistry;
  };
}

export interface ItemColumn {
  label: string;
  description: string;
  type: string;
  isIdentifier?: boolean;
}

export interface ItemValues {
  [key: string]: string;
}

export interface ItemData {
  columns: ItemColumn[];
  values: ItemValues;
}

export interface Web3Error {
  code: number;
  message: string;
  stack?: string;
}

export interface SubmissionStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash: string | null;
}
