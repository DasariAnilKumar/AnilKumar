"use client";

import ScrollReveal from "./ScrollReveal";
import FolderComponent from "./FolderComponent";

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <ScrollReveal>
        <div className="section-header">
          <span className="section-number">04</span>
          <h2 className="section-title">Certifications & Honors</h2>
        </div>
        <p className="section-subtext">
          Interactive 3D folder · Hover or tap to expand · Click any credential card to view in full resolution
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="credentials-folder-container">
          <FolderComponent size="md" />
        </div>
      </ScrollReveal>
    </section>
  );
}
