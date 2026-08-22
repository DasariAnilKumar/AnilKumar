"use client";

import ScrollReveal from "./ScrollReveal";

const entries = [
  {
    date: "2024 — Present",
    role: "Senior Software Engineer",
    company: "Barbarian (Experience Commerce)",
    award: "ACE Champion Award 2025",
    client: "AbbVie",
    desc: "Shipped multi-country AbbVie sites on AEM as a Cloud Service, using Multi Site Manager for the rollouts. I take features from requirements through components, backend, integrations, caching, and production support.",
    stack: "AEM Cloud · Java · Sling · HTL · GraphQL · Content Fragments · JavaScript · REST APIs · Dispatcher · Cloud Manager · Maven · Git · JUnit",
  },
  {
    date: "2022 — 2024",
    role: "Senior Software Engineer",
    company: "HCLTech",
    award: "ERS Champion Award",
    client: "Microsoft",
    desc: "Built AEM experiences for Microsoft marketing sites including Windows, Surface, and Copilot. Components, backend, and frontend integration on high-traffic sites across multiple markets.",
    stack: "AEM 6.5 · Java · Apache Sling · HTL · GraphQL · Content Fragments · JavaScript · REST APIs · Maven · Git · JUnit · CSS · jQuery",
  },
  {
    date: "2018 — 2022",
    role: "B.Tech in Computer Science & Engineering",
    company: "KSRM College of Engineering",
    award: "8.37 CGPA",
    client: null,
    desc: "Coursework in data structures, algorithms, object-oriented design, databases, and web engineering.",
    stack: "Data Structures · Algorithms · OOP · DBMS · Web Engineering",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="section">
      <ScrollReveal>
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">Timeline</h2>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="timeline">
          {entries.map((entry, i) => (
            <article key={i} className="timeline-entry">
              <div className="timeline-date">{entry.date}</div>
              <div className="timeline-body">
                <h3 className="timeline-role">{entry.role}</h3>
                <div className="timeline-company-wrap">
                  <span className="timeline-company">{entry.company}</span>
                  {entry.client && (
                    <span className="timeline-client">Client: {entry.client}</span>
                  )}
                  {entry.award && (
                    <span className="timeline-award">{entry.award}</span>
                  )}
                </div>
                <p className="timeline-desc">{entry.desc}</p>
                <div className="timeline-stack">{entry.stack}</div>
              </div>
            </article>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
