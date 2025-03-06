import { GraphQLResponse, LItem } from "@/types";
import { toast } from "sonner";

const SUBGRAPH_URL =
  "https://gateway.thegraph.com/api/93280ce6389383613864ff8220a456dd/subgraphs/id/A5oqWboEuDezwqpkaJjih4ckGhoHRoXZExqUbja2k1NQ";

const QUERY = `
  query GetFrontends {
    litems(
      first: 1000,
      orderBy: latestRequestSubmissionTime
      orderDirection: desc,
      where: { 
        registry: "0xda03509bb770061a61615ad8fc8e1858520ebd86"
      }
    ) {
      __typename
      data
      itemID
      disputed
      metadata {
        __typename
        props {
          __typename
          description
          isIdentifier
          label
          type
          value
        }
      }
      requests {
        __typename
        challenger
        deposit
        disputeID
        disputed
        requester
        resolutionTime
        resolved
        rounds {
          __typename
          amountPaidChallenger
          amountPaidRequester
          appealPeriodEnd
          appealPeriodStart
          hasPaidChallenger
          hasPaidRequester
          ruling
        }
        submissionTime
      }
      status
    }
  }
`;

export async function fetchFrontends(): Promise<LItem[]> {
  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(`GraphQL error: ${result.errors[0].message}`);
    }

    // Validate response
    if (!result.data || !Array.isArray(result.data.litems)) {
      console.error("Invalid response format:", result);
      throw new Error("Received invalid data format");
    }

    return result.data.litems;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Failed to load frontends. Please try again later.");
    return [];
  }
}
