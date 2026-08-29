import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CodeDivider } from "@/components/ui/CodeDivider";
import { TechTag } from "@/components/ui/TechTag";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const projectsData: Record<string, {
  name: string;
  description: string;
  fullDescription: string;
  stack: string[];
  impact: string;
  challenges: string[];
  features: string[];
}> = {
  "scalable-fintech-platform": {
    name: "Scalable Fintech Platform",
    description: "Development of a scalable financial platform designed to handle millions of transactions with real-time processing capabilities.",
    fullDescription: "Built a comprehensive financial platform from the ground up, focusing on security, reliability, and performance at scale. The system processes millions of transactions daily with sub-second latency, implementing sophisticated fraud detection algorithms and real-time analytics dashboards for stakeholders.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS"],
    impact: "35% latency reduction, support for millions of users",
    challenges: [
      "Handling high-volume concurrent transactions without data loss",
      "Implementing real-time fraud detection with minimal false positives",
      "Ensuring PCI-DSS compliance across the entire stack",
      "Scaling horizontally while maintaining data consistency"
    ],
    features: [
      "Real-time transaction processing engine",
      "Multi-factor authentication system",
      "Automated fraud detection with ML models",
      "Comprehensive audit logging and reporting"
    ]
  },
  "internal-design-system": {
    name: "Internal Design System",
    description: "Creation of a comprehensive design system that enables multiple development teams to build consistent interfaces.",
    fullDescription: "Developed and maintained a company-wide design system used by 50+ developers across multiple product teams. The system includes a complete component library, design tokens, documentation portal, and automated visual regression testing to ensure consistency across all products.",
    stack: ["React", "Storybook", "CSS-in-JS", "TypeScript", "Figma API"],
    impact: "40% increase in team productivity, improved visual consistency",
    challenges: [
      "Aligning design and engineering teams on component APIs",
      "Maintaining backward compatibility during updates",
      "Creating accessible components that meet WCAG 2.1 AA standards",
      "Documenting usage patterns for diverse use cases"
    ],
    features: [
      "60+ production-ready components",
      "Automated visual regression testing",
      "Figma-to-code synchronization",
      "Interactive documentation with live examples"
    ]
  },
  "real-time-analytics-dashboard": {
    name: "Real-Time Analytics Dashboard",
    description: "A real-time dashboard built for instant decision-making with live data visualization.",
    fullDescription: "Created a high-performance analytics dashboard that processes and visualizes millions of data points in real-time. The system features customizable widgets, alerting capabilities, and seamless integration with multiple data sources including databases, APIs, and streaming platforms.",
    stack: ["Next.js", "WebSockets", "D3.js", "Redis", "ClickHouse"],
    impact: "Instant insights for product and business teams",
    challenges: [
      "Rendering large datasets without performance degradation",
      "Implementing efficient data aggregation pipelines",
      "Creating intuitive drag-and-drop dashboard customization",
      "Handling network interruptions gracefully"
    ],
    features: [
      "Real-time data streaming with WebSocket connections",
      "Customizable dashboard layouts and widgets",
      "Advanced filtering and drill-down capabilities",
      "Automated alerting and anomaly detection"
    ]
  },
  "e-commerce-microservices-architecture": {
    name: "E-Commerce Microservices Architecture",
    description: "Complete microservices ecosystem for a high-traffic e-commerce platform.",
    fullDescription: "Architected and implemented a distributed microservices system handling peak traffic of 100K+ requests per minute. The platform features event-driven communication, automated scaling, circuit breakers, and comprehensive observability with distributed tracing.",
    stack: ["Go", "Kubernetes", "gRPC", "MongoDB", "Kafka", "Prometheus"],
    impact: "99.99% uptime, 10x throughput improvement",
    challenges: [
      "Designing resilient inter-service communication",
      "Implementing distributed transactions across services",
      "Managing data consistency in eventual consistency model",
      "Orchestrating deployments across 20+ microservices"
    ],
    features: [
      "Event-driven architecture with Kafka",
      "Kubernetes-native auto-scaling",
      "Distributed tracing with Jaeger",
      "Comprehensive health monitoring and alerting"
    ]
  }
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
              <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/work">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Work
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="container max-w-4xl">
          {/* Back Link */}
          <Link 
            to="/work" 
            className="inline-flex items-center font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-8 opacity-0 animate-fade-in-up"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Work
          </Link>

          {/* Project Header */}
          <div className="mb-12 opacity-0 animate-fade-in-up stagger-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {project.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {project.fullDescription}
            </p>
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.stack.map((tech) => (
                <TechTag key={tech}>{tech}</TechTag>
              ))}
            </div>

            {/* Impact */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="font-mono text-sm text-primary">
                <span className="text-muted-foreground">{"//"}</span> Impact: {project.impact}
              </span>
            </div>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-2">
            <CodeDivider label="Challenges" />
          </div>

          {/* Challenges */}
          <div className="mb-12 opacity-0 animate-fade-in-up stagger-3">
            <ul className="space-y-3">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-mono text-primary mt-1">→</span>
                  <span className="text-muted-foreground">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="opacity-0 animate-fade-in-up stagger-3">
            <CodeDivider label="Features" />
          </div>

          {/* Features */}
          <div className="mb-12 opacity-0 animate-fade-in-up stagger-4">
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-mono text-primary mt-1">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-8 border-t border-border opacity-0 animate-fade-in-up stagger-4">
            <Button variant="outline" className="font-mono" disabled>
              <Github className="mr-2 h-4 w-4" />
              View Code
            </Button>
            <Button variant="outline" className="font-mono" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
