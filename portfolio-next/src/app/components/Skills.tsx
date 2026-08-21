"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import FolderComponent from "./FolderComponent";

const skillCategories = [
  {
    number: "01",
    title: "CMS & Enterprise Architecture",
    description: "Adobe Experience Manager platform development, modular components, and content models.",
    skills: ["AEM Cloud", "Apache Sling", "HTL", "Content Fragments"],
  },
  {
    number: "02",
    title: "Backend & Systems",
    description: "Enterprise Java backend, API architectures, scripting, and continuous integration pipelines.",
    skills: ["Java", "Python", "C#", "GraphQL", "CI/CD"],
  },
  {
    number: "03",
    title: "Frontend & Interfaces",
    description: "Semantic web standards, client-side scripting, responsive styling, and modern UI integration.",
    skills: ["JavaScript", "HTML", "CSS", "jQuery", "Bootstrap"],
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

      {/* Structured Editorial Skill Rows */}
      <ScrollReveal delay={0.05}>
        <div className="skills-categories-wrapper">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="skill-category-row">
              <div className="skill-cat-meta">
                <span className="skill-cat-number">{category.number}</span>
                <div>
                  <h3 className="skill-cat-title">{category.title}</h3>
                  <p className="skill-cat-desc">{category.description}</p>
                </div>
              </div>

              <div className="skill-pills-list">
                {category.skills.map((skill, sIdx) => (
                  <motion.div
                    key={sIdx}
                    className="skill-pill-item"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="skill-pill-dot" />
                    <span className="skill-pill-name">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Interactive 3D Certificates Folder - Instant Render & Dedicated Anchor */}
      <div id="certifications" className="credentials-row">
        <div className="credentials-header-wrap">
          <div className="credentials-label">Certifications & Honors</div>
          <p className="credentials-subtext">
            Interactive 3D folder · Hover or tap to expand · Click any credential card to view in full resolution
          </p>
        </div>

        <div className="credentials-folder-container">
          <FolderComponent size="md" />
        </div>
      </div>
    </section>
  );
}
