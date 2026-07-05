export type Project = {
  slug: string;
  name: string;
  tagline: string; // one-line "what it does"
  tech: string[];
  metric?: string; // outcome / metric line
  image?: string; // screenshot path under /public
  liveUrl?: string;
  codeUrl?: string;
  featured?: boolean;
  status: "live" | "coming-soon";
};

export const projects: Project[] = [
  {
    slug: "garageconnect",
    name: "GarageConnect",
    tagline:
      "A two-sided marketplace where garages sign up and drivers find nearby mechanics for car & bike repairs.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Auth", "Maps API"],
    metric: "Flagship platform · full signup, search & booking flow",
    image: "/projects/garageconnect.png",
    featured: true,
    status: "coming-soon",
  },
  {
    slug: "business-website",
    name: "Business Website",
    tagline:
      "A polished small-business site with online booking — the kind local shops hire for every day.",
    tech: ["Next.js", "Tailwind", "CMS"],
    metric: "Responsive marketing site + booking",
    image: "/projects/business-website.png",
    status: "coming-soon",
  },
  {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    tagline:
      "A reporting dashboard that turns raw business data into clear, actionable charts.",
    tech: ["Next.js", "Charts", "API integration"],
    metric: "Real-time reporting & data automation",
    image: "/projects/analytics-dashboard.png",
    status: "coming-soon",
  },
  {
    slug: "ai-app",
    name: "AI Assistant App",
    tagline:
      "An AI-powered assistant that answers questions and automates a niche workflow.",
    tech: ["Next.js", "Claude API", "Vector search"],
    metric: "LLM-powered product",
    image: "/projects/ai-app.png",
    status: "coming-soon",
  },
];
