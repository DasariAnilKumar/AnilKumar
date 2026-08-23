# Project Architecture & File Overview: Anil Kumar's Portfolio

An interactive, high-performance personal portfolio and developer showroom built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Framer Motion**, and **Three.js**, deployed as a high-speed static export to **Cloudflare Pages** at [https://anildasari.in](https://anildasari.in).

---

## 🏗️ Repository Architecture

The repository is structured into two main layers:
1. **Source Code (`/portfolio-next/`)**: The complete Next.js source project where all TypeScript components, context providers, animations, and CSS styling reside.
2. **Static Distribution Root (`/`)**: Pre-rendered static HTML, CSS, JavaScript chunks, and asset files served directly at the root for Cloudflare Pages edge delivery.

```
AnilKumar/
├── docs/
│   └── project-overview.md        # Comprehensive file-by-file project documentation
├── images/                        # High-resolution portfolio images & certificate scans
├── _headers                       # Cloudflare edge caching & security headers
├── 404.html                       # Fallback 404 static HTML
├── index.html                     # Pre-rendered home page static HTML
├── og.png                         # OpenGraph social share card (1200x630)
├── Dasari_Anil_Kumar_Resume.pdf   # Downloadable PDF resume
└── portfolio-next/                # Next.js Source Code
    ├── public/                    # Static public assets
    ├── src/
    │   ├── app/
    │   │   ├── components/        # Interactive UI components
    │   │   ├── context/           # React context providers
    │   │   ├── globals.css        # Global CSS design tokens & animations
    │   │   ├── layout.tsx         # Root HTML shell & meta configuration
    │   │   ├── not-found.tsx      # Custom 3D Liquid Chrome 404 page
    │   │   └── page.tsx           # Home page composition
    │   └── lib/                   # Utility helpers
    ├── next.config.ts             # Next.js build & export configuration
    ├── package.json               # Dependencies & build scripts
    └── tsconfig.json              # TypeScript compiler configuration
```

---

## 📁 Source Code File-by-File Breakdown (`portfolio-next/src/`)

### 1. App Shell & Routing

#### 📄 [`src/app/layout.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/layout.tsx)
- **Role**: Root HTML template, typography font loading, and application metadata.
- **Key Features**:
  - Loads Google Fonts (`Space Grotesk` for display headings, `Inter` for body text, `JetBrains Mono` for code & badges).
  - Configures OpenGraph meta tags, Twitter card preview, and SEO keywords.
  - Injects an inline anti-flash script into `<head>` to prevent FOUT (Flash of Unstyled Theme) by synchronizing `data-theme` with `localStorage` before paint.
  - Wraps the entire application tree in `ThemeProvider`.

#### 📄 [`src/app/page.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/page.tsx)
- **Role**: Main single-page application orchestrator.
- **Key Features**:
  - Composes the chronological portfolio flow: `Nav` ➔ `Hero` ➔ `Timeline` ➔ `Skills` ➔ `Certifications` ➔ `StatusTerminal` ➔ `Contact` ➔ `Footer`.
  - Wraps sections in container constraints (`max-width: 1440px`) to preserve layout balance across ultra-wide and 4K displays.

#### 📄 [`src/app/not-found.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/not-found.tsx)
- **Role**: Immersive, interactive 404 Error Page.
- **Key Features**:
  - Displays dynamic `4 - [Interactive 3D Chrome Blob] - 4` hero layout.
  - Features the WebGL `LiquidBlob` center element with real-time cursor interaction.
  - Includes smart return-to-home navigation and theme-aware styling.

---

### 2. Context & State Management

#### 📄 [`src/app/context/ThemeContext.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/context/ThemeContext.tsx)
- **Role**: Application-wide dark/light theme management.
- **Key Features**:
  - Persists selected theme (`dark` vs `light`) in browser `localStorage`.
  - Applies `data-theme` attribute to `document.documentElement`.
  - Integrates the modern **View Transitions API** (`document.startViewTransition`) to generate a circular expanding ripple effect from the button's exact click coordinates.

---

### 3. Core Interactive Components (`src/app/components/`)

#### 📄 [`src/app/components/Nav.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Nav.tsx)
- **Role**: Dual-mode navigation system.
- **Key Features**:
  - **Top Header Nav**: Sleek desktop & mobile navigation header with section jump links and the circular Sun/Moon theme switch.
  - **Floating Dynamic Island Capsule Nav**: Appears automatically upon scrolling past the hero. Features:
    - Current active section detector (IntersectionObserver).
    - Circular SVG radial scroll progress meter (0%–100%).
    - Expandable navigation pill showing all section links.
    - Embedded `ThemeToggle` and quick "Back to Top" button.

#### 📄 [`src/app/components/ThemeToggle.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/ThemeToggle.tsx)
- **Role**: Minimalist Circular Sun / Moon Morph Switch.
- **Key Features**:
  - **Dark Mode**: Pitch-black circular button with a thin border and a vector outline **Crescent Moon** icon (`#ffffff`).
  - **Light Mode**: Pure white circular button with a dark border and a vector outline **Sun** with 8 radiating rays (`#111110`).
  - Animated with Framer Motion spring physics (`rotate: -70° ➔ 0°`, `scale: 0.4 ➔ 1`).

#### 📄 [`src/app/components/Hero.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Hero.tsx)
- **Role**: Editorial typographic hero presentation.
- **Key Features**:
  - Massive display typography (`ANIL KUMAR`) with responsive scaling.
  - Role badges (`SENIOR SOFTWARE ENGINEER`, `Adobe Certified AEM Developer`, `4+ Years Experience`).
  - Cutout profile portrait integrated seamlessly into the background.
  - Smooth animated scroll cue indicator (`Scroll ↓`).

#### 📄 [`src/app/components/Timeline.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Timeline.tsx)
- **Role**: Career milestones and professional experience timeline.
- **Key Features**:
  - Vertical guideline with illuminated timeline entry nodes.
  - Highlighting roles at Cognizant, AbbVie client work, key achievements, and the **ACE CHAMPION AWARD 2025**.
  - Tech stack tags (`AEM 6.5`, `AEM as a Cloud Service`, `Sling`, `OSGi`, `Java`, `HTL`, `GraphQL`).

#### 📄 [`src/app/components/Skills.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Skills.tsx)
- **Role**: 3D perspective skill rack.
- **Key Features**:
  - 4 specialized architectural cards: *Core AEM & Web Content Management*, *Backend, Frameworks & Cloud*, *Frontend & Modern Web*, and *Tools, CI/CD & Architecture*.
  - 3D hover elevation with glowing indicator dots and dynamic depth lighting.

#### 📄 [`src/app/components/Certifications.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Certifications.tsx)
- **Role**: Interactive 3D credentials folder and certificate gallery.
- **Key Features**:
  - Hosts the 3D interactive folder component (`FolderComponent.tsx`).
  - Provides quick action pill buttons to directly trigger individual certificates.
  - Renders a full-screen, swipeable/navigable **Certificate Lightbox Modal** with high-resolution scans and verification metadata.

#### 📄 [`src/app/components/FolderComponent.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/FolderComponent.tsx)
- **Role**: Custom 3D SVG folder with hover fan-out physics and certificate interaction.
- **Key Features**:
  - Dynamic dual-theme support (steely dark obsidian vs warm pearl porcelain).
  - SVG isometric flap folding and dynamic card peek animations.
  - Clickable certificate card tabs that open the detailed lightbox modal.

#### 📄 [`src/app/components/StatusTerminal.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/StatusTerminal.tsx)
- **Role**: Interactive "Graviton" Developer Status Terminal.
- **Key Features**:
  - Live IST local clock with synchronized seconds ticks.
  - Current availability, location, tech stack, and timezone status badges.
  - **Graviton Physics Engine**: An interactive `<canvas>` overlay where cursor movement emits magnetic laser tethers to nearby text letters; slicing through them breaks letters off to fall under gravity, with a live reset restore button.

#### 📄 [`src/app/components/Contact.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/Contact.tsx)
- **Role**: Contact section and social connection links.
- **Key Features**:
  - Direct email CTA with click-to-copy clipboard action and toast notification.
  - Direct links to LinkedIn, GitHub, and Resume PDF download.

#### 📄 [`src/app/components/LiquidBlob.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/LiquidBlob.tsx)
- **Role**: Three.js WebGL procedural liquid sphere.
- **Key Features**:
  - Custom vertex and fragment shaders generating liquid iridescent chrome noise.
  - Interactive mouse tracking and fluid deform dynamics.
  - Lightweight canvas lifecycle with automatic cleanup.

#### 📄 [`src/app/components/ScrollReveal.tsx`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/components/ScrollReveal.tsx)
- **Role**: Reusable scroll reveal animation wrapper.
- **Key Features**:
  - Uses Framer Motion's `whileInView` with spring physics to orchestrate smooth section entry animations.

---

### 4. Styling & Utilities

#### 📄 [`src/app/globals.css`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/app/globals.css)
- **Role**: Complete application design system and responsive stylesheet.
- **Key Features**:
  - **Design Tokens**: CSS variables for dark and light themes (`--bg-primary`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--border-subtle`).
  - **Custom Light Palette**: Exact `#FAF9F5` (page background), `#FFFFFF` (cards), `#E4E2D9` (borders), `#111110` (primary text), `#6B6A64` (muted text).
  - **3D Isometric Transforms**: Matrix transforms and lighting shaders for skill cards and folder.
  - **Comprehensive Media Queries**: Pixel-perfect responsive rules for mobile ($\le 480\text{px}$), tablet ($\le 768\text{px}$), and ultra-wide ($\ge 1440\text{px}$).

#### 📄 [`src/lib/utils.ts`](file:///D:/anil_projects/portfolio/AnilKumar/portfolio-next/src/lib/utils.ts)
- **Role**: Helper utilities (e.g. `cn` class name merger with `clsx` and `tailwind-merge`).

---

## ⚙️ Configuration Files

- **`next.config.ts`**: Configures Next.js with `output: 'export'` for static HTML export, unoptimized images for Cloudflare Pages hosting, and Turbopack bundler flags.
- **`package.json`**: Lists dependencies (`next`, `react`, `framer-motion`, `three`, `lucide-react`, `clsx`) and build scripts (`dev`, `build`, `lint`).
- **`_headers`**: Cloudflare Pages configuration enforcing 1-year immutable caching for static assets (`/_next/static/*`) and security headers.
- **`README.md`**: Project quick-start guide, build instructions, and developer documentation.
