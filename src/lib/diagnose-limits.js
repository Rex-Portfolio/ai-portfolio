// Input caps for the diagnostic demo, shared by the form and the API route.
// They keep each request (and its Anthropic token cost) bounded.
export const LIMITS = {
  industry: 80,
  teamSize: 40,
  problem: 1500,
};
