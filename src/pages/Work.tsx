import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { ProjectCard } from "@/components/ui/ProjectCard";

const projects = [
  {
    name: "Scalable Fintech Platform",
    slug: "scalable-fintech-platform",
    description: "Development of a scalable financial platform designed to handle millions of transactions with real-time processing capabilities. Built with a focus on security, reliability, and performance at scale.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    impact: "35% latency reduction, support for millions of users",
  },
  {
    name: "Internal Design System",
    slug: "internal-design-system",
    description: "Creation of a comprehensive design system that enables multiple development teams to build consistent, accessible, and visually cohesive interfaces. Includes documentation, component library, and design tokens.",
    stack: ["React", "Storybook", "CSS-in-JS", "TypeScript"],
    impact: "40% increase in team productivity, improved visual consistency",
  },
  {
    name: "Real-Time Analytics Dashboard",
    slug: "real-time-analytics-dashboard",
    description: "A real-time dashboard built for instant decision-making. Features live data visualization, customizable metrics, and seamless integration with multiple data sources for product and business intelligence.",
    stack: ["Next.js", "WebSockets", "D3.js", "Redis"],
    impact: "Instant insights for product and business teams",
  },
  {
    name: "E-Commerce Microservices Architecture",
    slug: "e-commerce-microservices-architecture",
    description: "Complete microservices ecosystem for a high-traffic e-commerce platform. Features event-driven architecture, automated scaling, and distributed data management for maximum reliability and performance.",
    stack: ["Go", "Kubernetes", "gRPC", "MongoDB"],
    impact: "99.99% uptime, 10x throughput improvement",
  },
];

export default function Work() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container">
          {/* Page Header */}
          <div className="max-w-2xl mb-12 opacity-0 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Work
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              A selection of projects showcasing systems engineering, product development, 
              and technical problem-solving. Each project represents real challenges solved 
              with measurable impact.
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-1">
            <CodeDivider label="Projects" />
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.name}
                className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 2, 4)}`}
              >
                <ProjectCard {...project} className="hover-lift" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
