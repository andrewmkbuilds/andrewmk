import type { ReactNode } from "react";
import Accordion from "@/components/annnimate/accordion";

export interface PackAccordionItem {
  id: string;
  title: string;
  body: ReactNode;
  defaultOpen?: boolean;
  /** Line-by-line reveal of the answer text (the pack's SplitText stagger). */
  stagger?: boolean;
}

interface PackAccordionProps {
  items: PackAccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  /** Heading element for each question, so the page outline stays right. */
  headingLevel?: 2 | 3;
}

/**
 * The Annnimate accordion, wired to the site's content and type.
 *
 * The pack ships the item as a render-prop shell; this keeps that behaviour
 * (GSAP height animation + rotating icon) and only fixes the markup around it:
 * a real `<button>` that reports `aria-expanded`, an SVG icon with both bars
 * as refs for the rotate/fade, and the panel as a labelled region.
 */
export function PackAccordion({
  items,
  allowMultiple = false,
  className = "",
  headingLevel = 3,
}: PackAccordionProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Accordion
      className={`anm-accordion ${className}`.trim()}
      allowMultiple={allowMultiple}
      duration={0.6}
      ease="expo.inOut"
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          defaultOpen={Boolean(item.defaultOpen)}
          duration={0.6}
          iconMode="both"
          iconRotation={-135}
          enableStagger={Boolean(item.stagger)}
          staggerDuration={0.45}
          staggerDelay={0.08}
          staggerStartDelay={160}
        >
          {({
            toggle,
            isOpen,
            contentRef,
            iconRef,
            verticalBarRef,
          }: {
            toggle: () => void;
            isOpen: boolean;
            contentRef: React.Ref<HTMLDivElement>;
            iconRef: React.Ref<SVGSVGElement>;
            verticalBarRef: React.Ref<SVGPathElement>;
          }) => (
            <>
              <Heading>
                <button
                  type="button"
                  onClick={toggle}
                  className="accordion_trigger focus-ring"
                  aria-expanded={isOpen}
                >
                  <span className="accordion_title">{item.title}</span>
                  <svg
                    ref={iconRef}
                    className="accordion_icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      ref={verticalBarRef}
                      d="M8 1V15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 8H15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </Heading>
              <div ref={contentRef} className="accordion_content">
                <div className="accordion_text">{item.body}</div>
              </div>
            </>
          )}
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
