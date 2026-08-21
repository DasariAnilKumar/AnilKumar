"use client";

import ScrollReveal from "./ScrollReveal";

const entries = [
  {
    date: "2024 — Present",
    role: "Senior Software Engineer",
    company: "Barbarian (Experience Commerce)",
    award: "ACE Champion Award 2025",
    client: "AbbVie",
    desc: "Developing enterprise digital experiences with Adobe Experience Manager as a Cloud Service, covering AEM component and backend development, third-party application integrations, and frontend integration. Delivered multi-country rollouts using Adobe Experience Manager’s Multi Site Manager (MSM), while also handling JUnit testing, caching strategies, and production debugging. Worked closely with clients to understand requirements and translate them into practical technical solutions, while contributing to small-team ownership and end-to-end feature delivery from requirement gathering and development through testing and production support.",
    stack: "AEM Cloud · Java · Sling · HTL · GraphQL · Content Fragments · JavaScript · REST APIs · Dispatcher · Cloud Manager · Maven · Git · JUnit",
  },
  {
    date: "2022 — 2024",
    role: "Senior Software Engineer",
    company: "HCLTech",
    award: "ERS Champion Award",
    client: "Microsoft",
    desc: "Developed enterprise marketing experiences as an AEM Developer for Microsoft, working on high-traffic digital platforms including Windows, Surface, and Copilot. Built and enhanced AEM components and backend functionality, integrated frontend experiences, and supported content-driven marketing sites across multiple markets. Worked closely with distributed teams to deliver features, troubleshoot production issues, and maintain reliable digital experiences at enterprise scale.",
    stack: "AEM 6.5 · Java · Apache Sling · HTL · GraphQL · Content Fragments · JavaScript · REST APIs · Maven · Git · JUnit · CSS · jQuery",
  },
  {
    date: "2018 — 2022",
    role: "B.Tech in Computer Science & Engineering",
    company: "KSRM College of Engineering",
    award: "8.37 CGPA",
    client: null,
    desc: "Graduated with academic distinction. Focused on Data Structures, Algorithms, Object-Oriented Software Design, Database Management Systems, and Web Engineering.",
    stack: "Data Structures · Algorithms · OOP · DBMS · Web Engineering",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="section">
      <ScrollReveal>
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">Experience</h2>
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
