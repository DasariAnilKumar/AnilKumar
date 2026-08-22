# Anil Kumar Dasari — Senior AEM & Full-Stack Engineer

> Modern, high-performance portfolio engineered with **Next.js 16**, **React 19**, **TypeScript**, **Framer Motion**, and **Matter.js** physics engine.

🌐 **Live Website**: [anildasari.in](https://anildasari.in)  
📍 **Location**: Hyderabad, India  
📧 **Contact**: [anilkumard707@gmail.com](mailto:anilkumard707@gmail.com) · [LinkedIn](https://www.linkedin.com/in/anildasari) · [GitHub](https://github.com/DasariAnilKumar)

---

## ⚡ Highlights & Interactive Engineering

- **Floating Dynamic Capsule Navigation**:
  - Top-right dynamic island glass capsule that appears on scroll.
  - Displays real-time SVG circular scroll progress, active section status, and spring expansion on hover.
  - Responsive and optimized for all screen sizes.

- **Hero Reverse Parallax Dynamics**:
  - Damped spring physics with reverse horizontal parallax tracking mouse movement across headlines, roles, and cutout portrait layers.

- **Graviton Interactive Terminal**:
  - Real-time **Matter.js** 2D physics simulation with dynamic steel grey laser tethers connecting cursor to characters.
  - Slicing through severs tethers with spark particles and drops letters into real-time gravity physics.
  - Click-activated gravity shockwaves cascade through the system status display.

- **3D Interactive Credentials Folder**:
  - Custom 3D folder fanning out certifications with depth and rotational curvature.
  - Touch-swipeable lightbox modal supporting mobile gestures, keyboard navigation, and automatic stack synchronization.

- **3D Skills Rack**:
  - Perspective-tilted 3D cards with active hover spotlights and automatic inactive card dimming.

- **Interactive Timeline**:
  - Enterprise career milestones across AEM Cloud, OSGi, Edge Delivery Services, and full-stack systems.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, Static Export) |
| **Core** | React 19, TypeScript |
| **Animations** | Framer Motion |
| **Physics** | Matter.js (2D Rigid Body Physics) |
| **Icons** | Lucide React |
| **Styling** | Custom Modular CSS Design System & Variables |
| **Deployment** | GitHub Pages / Static Hosting |

---

## 📂 Project Structure

```
AnilKumar/
├── portfolio-next/              # Next.js Source Application
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── Hero.tsx            # Hero with reverse parallax
│   │       │   ├── Nav.tsx             # Floating dynamic capsule nav
│   │       │   ├── Timeline.tsx        # Career experience timeline
│   │       │   ├── Skills.tsx          # 3D skill panels
│   │       │   ├── FolderComponent.tsx # 3D certificate folder & modal
│   │       │   ├── Certifications.tsx  # Credentials section wrapper
│   │       │   ├── StatusTerminal.tsx  # Graviton physics terminal
│   │       │   ├── Contact.tsx         # Contact section
│   │       │   └── ScrollReveal.tsx    # Viewport scroll animations
│   │       ├── layout.tsx              # Root HTML & metadata
│   │       ├── page.tsx                # Main portfolio page
│   │       └── globals.css             # Global styles & design system
│   ├── public/images/                  # Certificates & avatar assets
│   ├── next.config.ts                  # Static export configuration
│   └── package.json
├── index.html                          # Root static production entry point
└── README.md
```

---

## 🚀 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/DasariAnilKumar/AnilKumar.git
cd AnilKumar/portfolio-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Export

To build the static export for deployment:

```bash
cd portfolio-next
npm run build
```

Copy the generated static files from `portfolio-next/out/*` into the repository root:
```bash
# Windows PowerShell
Copy-Item -Path "portfolio-next\out\*" -Destination ".\" -Recurse -Force
```

---

## 👤 Author

**Dasari Anil Kumar**
- Portfolio: [anildasari.in](https://anildasari.in)
- Email: [anilkumard707@gmail.com](mailto:anilkumard707@gmail.com)
- LinkedIn: [@anildasari](https://www.linkedin.com/in/anildasari)
- GitHub: [@DasariAnilKumar](https://github.com/DasariAnilKumar)

---

## 📄 License

This project is licensed under the MIT License.
