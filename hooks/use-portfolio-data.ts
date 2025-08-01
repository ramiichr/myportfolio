import { useQuery } from "@apollo/client";
import { GET_PORTFOLIO_DATA } from "@/lib/graphql/client";
import { portfolioData as fallbackData } from "@/data/portfolio-data";

// Hook to fetch portfolio data from GraphQL with fallback to static data
export function usePortfolioData(language: string) {
  const { data, loading, error } = useQuery(GET_PORTFOLIO_DATA, {
    variables: { language },
    errorPolicy: "all",
  });

  // Return GraphQL data if available, otherwise fallback to static data
  const portfolioData = data?.portfolioData || {
    profile:
      fallbackData.profile[language as keyof typeof fallbackData.profile],
    projects:
      fallbackData.projects[language as keyof typeof fallbackData.projects],
    skills: fallbackData.skills,
    experiences:
      fallbackData.experiences[
        language as keyof typeof fallbackData.experiences
      ],
    education:
      fallbackData.education[language as keyof typeof fallbackData.education],
  };

  return {
    portfolioData,
    loading,
    error,
    isFromGraphQL: !!data?.portfolioData,
  };
}
