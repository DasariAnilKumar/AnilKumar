"use client";

import ScrollReveal from "./ScrollReveal";

const skillCategories = [
  {
    number: "01",
    title: "CMS & Enterprise",
    description: "AEM platforms, modular components, and content models.",
    skills: [
      "AEM Cloud",
      "Edge Delivery Services",
      "OSGi",
      "Apache Sling",
      "HTL",
      "Content Fragments",
      "Dispatcher",
      "Cloud Manager",
    ],
  },
  {
    number: "02",
    title: "Backend & Systems",
    description: "Java services, APIs, and delivery pipelines.",
    skills: [
      "Java",
      "GraphQL",
      "REST APIs",
      "CI/CD",
      "Maven",
      "Git",
      "JUnit",
    ],
  },
  {
    number: "03",
    title: "Frontend",
    description: "Interfaces that sit on top of AEM.",
    skills: ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS", "jQuery"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <ScrollReveal>
        <div className="section-header">
          <span className="section-number">03</span>
          <h2 className="section-title">Skills & Capabilities</h2>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <div className="skill-stage">
          <p className="skill-stage-hint">
            Hover a panel · Tap on mobile
          </p>
          <div className="skill-rack">
            {skillCategories.map((category) => (
              <article key={category.number} className="skill-panel">
                <span className="skill-panel-index" aria-hidden="true">
                  {category.number}
                </span>
                <div className="skill-panel-top">
                  <span className="skill-cat-number">{category.number}</span>
                  <h3 className="skill-cat-title">{category.title}</h3>
                </div>
                <p className="skill-cat-desc">{category.description}</p>
                <ul className="skill-panel-skills">
                  {category.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
