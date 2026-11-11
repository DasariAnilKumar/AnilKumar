"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Status = "live" | "store" | "progress";

type Product = {
  name: string;
  kind: string;
  status: Status;
  statusLabel: string;
  description: string;
  tags: string[];
  image: string;
  domain: string;
  links: { label: string; href: string }[];
};

const products: Product[] = [
  {
    name: "MissionChecked",
    kind: "SaaS · Productivity",
    status: "live",
    statusLabel: "Live",
    description:
      "An AI-powered daily planner with Kanban boards, effort estimates, auto-generated subtasks, text rewrites and scheduled email digests. Sign in with Google.",
    tags: ["React", "Vite", "AI", "Cloudflare", "Vercel"],
    image: "/images/products/missionchecked.webp",
    domain: "missionchecked.com",
    links: [{ label: "Visit site", href: "https://missionchecked.com" }],
  },
  {
    name: "MeetDring",
    kind: "Windows desktop app",
    status: "store",
    statusLabel: "On Microsoft Store",
    description:
      "A desktop hydration companion: a transparent character strolls across your screen to remind you to drink water, then leaves. Click-through, so it never steals focus.",
    tags: ["Windows 10 · 11", "270 KB", "Free"],
    image: "/images/products/meetdring.webp",
    domain: "meetdring-khaki.vercel.app",
    links: [
      { label: "Microsoft Store", href: "https://apps.microsoft.com/detail/9NF1LDTXN6HQ" },
      { label: "Website", href: "https://meetdring-khaki.vercel.app/" },
    ],
  },
  {
    name: "TFI Fight Karo",
    kind: "Browser game",
    status: "progress",
    statusLabel: "In progress",
    description:
      "The Great Theatre Brawl: a fan-made, just-for-fun Tollywood fighting game set inside a single-screen cinema hall. Playable preview in the browser.",
    tags: ["Web game", "Parody", "Desktop & mobile"],
    image: "/images/products/tfi-fight-karo.webp",
    domain: "tfi-fight-karo.vercel.app",
    links: [{ label: "Play preview", href: "https://tfi-fight-karo.vercel.app/" }],
  },
];

export default function Products() {
  return (
    <section id="products" className="section">
      <ScrollReveal>
        <div className="section-header">
          <span className="section-number">04</span>
          <h2 className="section-title">Products</h2>
        </div>
        <p className="section-subtext">
          Things I build and ship on my own time, outside client work.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <div className="product-grid">
          {products.map((p, i) => (
            <article key={p.name} className="product-card">
              {/* Screenshot in a minimal browser frame; the whole frame links to the product */}
              <a
                className="product-shot"
                href={p.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.name}`}
                tabIndex={-1}
              >
                <span className="product-shot-bar" aria-hidden="true">
                  <span className="product-shot-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="product-shot-url">{p.domain}</span>
                </span>
                <span className="product-shot-img">
                  <Image
                    src={p.image}
                    alt={`${p.name} screenshot`}
                    width={788}
                    height={493}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </span>
              </a>

              <div className="product-body">
                <div className="product-meta">
                  <span className="product-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`product-status product-status--${p.status}`}>
                    <span className="product-status-dot" aria-hidden="true" />
                    {p.statusLabel}
                  </span>
                </div>

                <h3 className="product-name">{p.name}</h3>
                <p className="product-kind">{p.kind}</p>
                <p className="product-desc">{p.description}</p>

                <ul className="product-tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>

                <div className="product-links">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      className="product-link"
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
