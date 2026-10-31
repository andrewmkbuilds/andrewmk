import { ExternalLink } from "lucide-react";
import { cv, githubLabel, portfolioLabel } from "@/data/cv";

const INK = "text-[#0f172a]";
const MUTED = "text-[#5b6472]";
const ACCENT = "text-[#1d4ed8]";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={`mb-2 border-b border-[#cbd5e1] pb-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] ${ACCENT}`}
    >
      {children}
    </h3>
  );
}

/**
 * The CV as it appears in the downloaded PDF: one ATS-friendly column, real
 * text (not an image), same content source, sized to read like an A4 sheet.
 */
export function CvSheet() {
  return (
    <article
      aria-label="CV preview — the same document as the downloaded PDF and DOCX"
      className="cv-sheet mx-auto w-full max-w-3xl rounded-xl bg-white px-6 py-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] sm:px-10 sm:py-12"
    >
      <header className="border-b border-[#cbd5e1] pb-4">
        <h2 className={`text-3xl font-bold tracking-tight ${INK}`}>{cv.name}</h2>
        <p className={`mt-1 text-sm ${ACCENT}`}>{cv.role}</p>
        <p className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${MUTED}`}>
          <span>{cv.location}</span>
          <span aria-hidden="true">·</span>
          <a
            href={`mailto:${cv.email}`}
            className="focus-ring rounded underline-offset-2 hover:underline"
          >
            {cv.email}
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={cv.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1 rounded underline-offset-2 hover:underline"
          >
            {portfolioLabel}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={cv.github}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1 rounded underline-offset-2 hover:underline"
          >
            {githubLabel}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </p>
      </header>

      <div className="mt-5 space-y-5">
        <section>
          <SectionTitle>Profile</SectionTitle>
          <p className={`text-[13px] leading-relaxed ${INK}`}>{cv.profile}</p>
        </section>

        <section>
          <SectionTitle>Education</SectionTitle>
          {cv.education.map((entry) => (
            <div key={entry.school}>
              <p className={`text-[13px] font-semibold ${INK}`}>{entry.school}</p>
              <p className={`text-[12.5px] ${MUTED}`}>
                {entry.detail} · {entry.meta}
              </p>
            </div>
          ))}
        </section>

        <section>
          <SectionTitle>Technical Skills</SectionTitle>
          <dl className="space-y-1">
            {cv.skills.map((group) => (
              <div key={group.label} className="flex gap-3 text-[12.5px] leading-snug">
                <dt className={`w-32 shrink-0 font-semibold ${INK}`}>{group.label}</dt>
                <dd className={INK}>{group.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <SectionTitle>Development Experience</SectionTitle>
          {cv.experience.map((entry) => (
            <div key={entry.title}>
              <p className={`text-[13px] font-semibold ${INK}`}>{entry.title}</p>
              <p className={`text-[12px] ${MUTED}`}>{entry.meta}</p>
              <ul className={`mt-1 list-disc space-y-1 pl-5 text-[12.5px] leading-snug ${INK}`}>
                {entry.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <SectionTitle>Selected Projects</SectionTitle>
          <ul className="space-y-2">
            {cv.projects.map((project) => (
              <li key={project.name}>
                <p className={`text-[13px] font-semibold ${INK}`}>
                  {project.name}
                  <span className={`font-normal ${ACCENT}`}> — {project.status}</span>
                </p>
                <p className={`text-[12.5px] leading-snug ${MUTED}`}>{project.summary}</p>
                <p className={`mt-0.5 text-[11px] uppercase tracking-[0.1em] ${MUTED}`}>
                  {project.tech}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>MUN Experience and Awards</SectionTitle>
          <ul className={`list-disc space-y-1 pl-5 text-[12.5px] leading-snug ${INK}`}>
            {cv.awards.map((award) => (
              <li key={award.title}>
                <span className="font-semibold">{award.title}</span>
                <span className={MUTED}> — {award.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>Leadership and Extracurricular</SectionTitle>
          <ul className={`list-disc space-y-1 pl-5 text-[12.5px] leading-snug ${INK}`}>
            {cv.leadership.map((item) => (
              <li key={item.title}>
                <span className="font-semibold">{item.title}</span>
                <span className={MUTED}> — {item.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className={`mt-6 border-t border-[#cbd5e1] pt-3 text-[11px] ${ACCENT}`}>
        <a
          href={cv.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring rounded underline-offset-2 hover:underline"
        >
          {portfolioLabel}
        </a>
      </footer>
    </article>
  );
}
