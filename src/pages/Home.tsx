import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TypingCursor } from "@/components/ui/TypingCursor";
import { ArrowRight } from "lucide-react";

const featuredProjects = [
  {
    name: "Scalable Fintech Platform",
    slug: "scalable-fintech-platform",
    description: "Development of a scalable financial platform handling millions of transactions with real-time processing and robust security measures.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    impact: "35% latency reduction, millions of users supported",
  },
  {
    name: "Internal Design System",
    slug: "internal-design-system",
    description: "Creation of a robust design system enabling multiple teams to build consistent, accessible interfaces at scale.",
    stack: ["React", "Storybook", "CSS-in-JS"],
    impact: "40% increase in team productivity",
  },
  {
    name: "Real-Time Analytics Dashboard",
    slug: "real-time-analytics-dashboard",
    description: "Real-time dashboard for instant decision-making with live data visualization and customizable metrics.",
    stack: ["Next.js", "WebSockets", "D3.js"],
    impact: "Instant insights for product and business teams",
  },
  {
    name: "E-Commerce Microservices",
    slug: "e-commerce-microservices-architecture",
    description: "Complete microservices ecosystem for high-traffic e-commerce platform with event-driven architecture and automated scaling.",
    stack: ["Go", "Kubernetes", "gRPC", "MongoDB"],
    impact: "99.99% uptime, 10x throughput improvement",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-grid">
        <div className="container">
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            {/* Code-style label */}
            <CodeLabel className="mb-6">Senior Developer</CodeLabel>

            {/* Headline with typing cursor */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hi, I'm Diego Ramirez.
              <br />
              <span className="text-muted-foreground">I build reliable digital systems</span>
              <TypingCursor />
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed opacity-0 animate-fade-in-up stagger-1">
              A Mexico-based developer focused on building products that scale, perform, and deliver real impact. 
              Working at the intersection of engineering, product, and design to turn 
              complex problems into elegant solutions.
            </p>

            {/* CTA */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <Button asChild size="lg" className="font-mono transition-transform hover:scale-105">
                <Link to="/work">
                  View Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container">
          <div className="opacity-0 animate-fade-in-up">
            <CodeDivider label="Featured Work" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <div 
                key={project.name} 
                className={`opacity-0 animate-fade-in-up stagger-${index + 1}`}
              >
                <ProjectCard {...project} className="hover-lift" />
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-12 text-center opacity-0 animate-fade-in-up stagger-4">
            <Link 
              to="/work" 
              className="inline-flex items-center font-mono text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
            >
              <span className="text-primary mr-2">{"//"}</span>
              View all projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
