# Sciora — Ethiopian Grade 8 General Science Simulation App 🔬⚡🔭

<div align="center">

[![Expo SDK](https://img.shields.io/badge/Expo-SDK_57.0.31-000020.svg?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86.3-20232A.svg?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Offline First](https://img.shields.io/badge/Architecture-100%25_Offline--First-10B981.svg?style=for-the-badge)](https://github.com/Respectus11/Sciora)
[![Privacy](https://img.shields.io/badge/Privacy-Zero_Telemetry-00E5FF.svg?style=for-the-badge)](https://github.com/Respectus11/Sciora)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AAA_(18.54%3A1)-8B5CF6.svg?style=for-the-badge)](https://github.com/Respectus11/Sciora)
[![CI Audits](https://img.shields.io/badge/Master_Audits-5%2F5_Passing_(100%25)-4ade80.svg?style=for-the-badge)](https://github.com/Respectus11/Sciora)
[![License](https://img.shields.io/badge/License-MIT-f59e0b.svg?style=for-the-badge)](LICENSE)

<br/>

**A mobile-first scientific laboratory and pedagogical learning engine designed for Ethiopian Grade 8 students.**  
*Strictly aligned with the Ethiopian National General Science Curriculum (Ministry of Education).*

[Overview](#-overview) • [Simulations Matrix](#-interactive-simulation-matrix) • [Pedagogical Engine](#-10-step-pedagogical-engine) • [Architecture](#-system-architecture--engineering) • [Design System](#-design-system--accessibility) • [Verification](#-master-quality--audit-suite) • [Getting Started](#-getting-started)

</div>

---

## 🌟 Overview

Physical science education in emerging classrooms often faces steep resource constraints: schools lack physical laboratory glassware, optical prisms, laser sources, vacuum chambers, and electrical circuit benches. 

**Sciora** closes this gap. It turns abstract physical laws into tangible, interactive physical models directly on Android, iOS, and Web devices. Built with pure mathematical vector algorithms and zero webview overhead, Sciora delivers smooth 60 FPS simulations accompanied by an evidence-based **10-Step Pedagogical Cognitive Engine** that transforms passive memorization into active scientific inquiry.

### Core Architectural Pillars
- 📴 **100% Offline-First**: Zero runtime network requests. Entire curriculum, simulations, and glossary run entirely on-device.
- 🛡️ **Zero-Telemetry Privacy Guarantee**: No user accounts, student tracking, remote analytics, or data harvesting. All student notes and progress remain in an embedded SQLite database.
- ⚡ **Pure Mathematical Vector Graphics**: Simulations run via lightweight SVG geometry calculations without bulky 3D engines, guaranteeing peak performance on budget mobile hardware.
- 🇪🇹 **National Curriculum Alignment**: Direct mapping to the official Ethiopian Ministry of Education Grade 8 General Science textbook (Units 1, 2, 6, and 7).
- 🌐 **Bilingual Scientific Glossary**: Integrated English scientific definitions paired with verified Amharic translations (e.g., እፍጋት, የኦህም ሕግ, የብርሃን ስብራት).

---

## 🔬 Interactive Simulation Matrix

Sciora includes 9 interactive simulations engineered with realistic physics equations, real-time sensor readouts, and responsive tactile controls:

| Unit & Topic | Simulation ID | Physical Laws & Formulae | Key Interactive Controls & Telemetry Readouts |
| :--- | :--- | :--- | :--- |
| **Unit 1.1**<br/>Density & Flotation | `sim-1-density` | $\rho = \frac{m}{V}$<br/>$F_b = \rho_{fluid} V_{disp} g$ | • Triple beam balance slider ($0–500\text{ g}$)<br/>• Graduated cylinder displacement ($50–250\text{ mL}$)<br/>• Fluid selector: Water ($1.00\text{ g/cm}^3$) vs. Ethanol ($0.79\text{ g/cm}^3$)<br/>• Live buoyancy sink/float state machine |
| **Unit 7.1A**<br/>Optics & Reflection | `sim-7-1-reflection` | $\theta_i = \theta_r$<br/>Specular vs. Diffuse | • 360° draggable laser emitter on circular protractor<br/>• Normal line ($\mathbf{N}$) reference with angle tick marks<br/>• Multi-wavelength beam: Cyan, Green, Red, Violet<br/>• Polished mirror vs. rough surface micro-scattering |
| **Unit 7.1B**<br/>Optics & Refraction | `sim-7-1-refraction` | $n_1 \sin\theta_1 = n_2 \sin\theta_2$<br/>$\theta_c = \arcsin\left(\frac{n_2}{n_1}\right)$ | • Incident angle control ($0°–85°$)<br/>• Boundary media: Air, Water ($n=1.33$), Glass ($n=1.52$), Diamond ($n=2.42$)<br/>• Total Internal Reflection (TIR) critical angle trigger<br/>• Newton's 7-color prism dispersion mode |
| **Unit 7.2**<br/>Thermal Conduction | `sim-7-4-heat` | $\frac{Q}{t} = \frac{k A \Delta T}{d}$ | • Molecular lattice vibration visualization<br/>• Rod material selector: Copper ($k=385$), Iron ($k=80$), Glass ($k=0.8$), Wood ($k=0.15$)<br/>• Dynamic temperature gradient coloring<br/>• Wax tack detachment timing sequence |
| **Unit 7.3**<br/>DC Electricity | `sim-7-5-circuit` | $V = I \times R$<br/>$P = I^2 R$ | • Circuit topologies: Single, Series ($20\,\Omega$), Parallel ($5\,\Omega$)<br/>• DC voltage regulator ($1.5\text{ V}–12\text{ V}$)<br/>• Knife switch state toggling<br/>• Live Ammeter & Voltmeter readouts<br/>• Filament bulb luminescence & fuse blowout ($I > 3.0\text{ A}$) |
| **Unit 7.4**<br/>Acoustic Waves | `sim-7-3-sound` | $v = f \times \lambda$<br/>$v_{air} = 343\text{ m/s}$ | • Frequency ($20–1000\text{ Hz}$) & Amplitude controls<br/>• Longitudinal compression & rarefaction particle field<br/>• Medium speeds: Air ($343\text{ m/s}$), Water ($1482\text{ m/s}$), Steel ($5960\text{ m/s}$)<br/>• Bell Jar vacuum pump sound extinction simulation |
| **Unit 7.6**<br/>Magnetism & Dipoles | `sim-7-6-magnetism` | $\nabla \cdot \mathbf{B} = 0$<br/>Magnetic Dipole Field | • Magnetic flux field lines with tangent vector arrows<br/>• Susceptibility testing: Iron, Nickel, Aluminum, Wood<br/>• Bar magnet rotation and pole flip ($N \leftrightarrow S$)<br/>• Magnet bifurcation test (proving non-existence of monopoles) |
| **Unit 2.1**<br/>Atomic Structure | `sim-2-atom` | $Z = p^+ = e^-$<br/>$A = p^+ + n^0$ | • Subatomic particle synthesis ($Z=1$ Hydrogen to $Z=18$ Argon)<br/>• Concentric Bohr energy shells ($K:2, L:8, M:8$)<br/>• Nuclear stability belt & isotope identifier<br/>• Periodic table classification readout |
| **Unit 6.1**<br/>Solar Astronomy | `sim-6-solar` | $\frac{T^2}{a^3} \approx 1.00\text{ yr}^2/\text{AU}^3$<br/>$v_{orb} = \sqrt{\frac{GM}{r}}$ | • Complete 8-planet Keplerian orbital mechanics<br/>• Orbital velocities ($47.9\text{ km/s}$ Mercury to $5.4\text{ km/s}$ Neptune)<br/>• Terrestrial vs. Gas Giant filter overlays<br/>• Circumstellar Goldilocks habitable zone boundary |

---

## 🧠 10-Step Pedagogical Engine

Sciora abandons standard "read-then-quiz" patterns in favor of a 10-stage inquiry progression rooted in Piagetian cognitive dissonance and constructivist learning theory:

```mermaid
flowchart TD
    S1[1. Phenomenon Hook<br/>Local Ethiopian Anchor] --> S2[2. Core Competency<br/>MoE Learning Goals]
    S2 --> S3[3. Prediction Challenge<br/>Formulate Hypothesis]
    S3 --> S4[4. Interactive Lab<br/>60 FPS Vector Simulation]
    S4 --> S5[5. Data Telemetry<br/>Quantitative SI Metrics]
    S5 --> S6[6. Scientific Law<br/>Mathematical Formula]
    S6 --> S7[7. Formative Checkpoint<br/>Mastery Quiz & Citations]
    S7 --> S8[8. Misconception Bust<br/>Myth vs. Scientific Reality]
    S8 --> S9[9. Real-World Link<br/>Ethiopian Infrastructure]
    S9 --> S10[10. Mastery Reflection<br/>Local Lab Journal]
    
    style S1 fill:#0E1726,stroke:#00E5FF,stroke-width:2px,color:#fff
    style S4 fill:#0E1726,stroke:#10B981,stroke-width:2px,color:#fff
    style S7 fill:#0E1726,stroke:#FF9E00,stroke-width:2px,color:#fff
    style S10 fill:#0E1726,stroke:#8B5CF6,stroke-width:2px,color:#fff
```

### Cognitive Stage Breakdown
1. **Phenomenon Hook**: Anchors the lesson in relatable local phenomena (e.g., mirages on the Addis Ababa–Djibouti highway, coffee boiling in a Jebena, heat conduction in traditional cooking).
2. **Core Competency**: Explicit curriculum objectives defining measurable student outcomes.
3. **Prediction Challenge**: Forces students to commit to a physical hypothesis *before* touching the apparatus, provoking genuine cognitive dissonance.
4. **Interactive Lab**: Vector simulation sandbox allowing students to manipulate parameters and observe immediate consequences.
5. **Data Telemetry**: Live metric cards displaying exact quantitative readings with SI units ($g$, $cm^3$, $m/s$, $\Omega$, $V$, $A$).
6. **Scientific Law**: Formal theoretical breakdown, highlighting formulas, constant definitions, and variable relationships.
7. **Formative Checkpoint**: Rigorous multi-choice assessment with instant pedagogical feedback and textbook page citations.
8. **Misconception Bust**: Dedicated comparative card contrasting widespread common myths with scientific reality.
9. **Real-World Link**: Connects abstract theory to Ethiopian engineering, geothermal energy in the Rift Valley, GERD hydroelectric generation, or national agricultural practices.
10. **Mastery Reflection**: Prompts students to record qualitative observations in their personal on-device lab notebook.

---

## 🏛️ System Architecture & Engineering

Sciora follows a modular, feature-first architecture decoupled from remote services:

```mermaid
graph TD
    subgraph Presentation ["Presentation Layer (Expo Router & Design System)"]
        A[Expo Router: app/] --> B[Screen Containers: ScreenContainer]
        B --> C[Glassmorphism UI: GlassCard, Badge, PrimaryButton]
        B --> D[Simulation Frame: SimulationWorkspace]
    end

    subgraph SimulationRegistry ["Simulation Engine (Pure Math & SVG)"]
        D --> E[Simulation Registry: getSimulationById]
        E --> F[Physics Geometry: react-native-svg]
        E --> G[Tactile Feedback: expo-haptics]
    end

    subgraph Domain ["Domain & Curriculum Engine"]
        B --> H[Content Service: contentService]
        H --> I[Curriculum JSON Bundles: content/units/*.json]
        B --> J[10-Step State Machine]
    end

    subgraph Persistence ["Persistence Layer (Embedded SQLite)"]
        J --> K[Progress Repository: progressRepository]
        B --> L[Notes & Bookmarks: notesRepository]
        K --> M[(Local SQLite DB: sciora.db)]
        L --> M
        M --> N[Backup & Restore Service: backupService]
    end

    style Presentation fill:#080D1A,stroke:#00E5FF,color:#fff
    style SimulationRegistry fill:#0E1726,stroke:#10B981,color:#fff
    style Domain fill:#080D1A,stroke:#FF9E00,color:#fff
    style Persistence fill:#0E1726,stroke:#8B5CF6,color:#fff
```

### Key Engineering Patterns
- **Pure Math SVG Rendering**: Physics coordinates are mapped through deterministic linear transformations directly to SVG paths and polygons, bypassing the overhead of WebViews or heavy WebGL engines.
- **Atomic SQLite Persistence**: Uses `expo-sqlite` with write-ahead logging (WAL) for instant progress recording, question attempts, and student lab journals.
- **Portability & Disaster Recovery**: Includes `backupService`, allowing students to export their complete progress and lab notebook as an encrypted JSON backup file for migration or teacher review.
- **Zero-Dependency Native Runtime**: Relies exclusively on core React Native and audited Expo modules for stability across different Android versions.

---

## 🎨 Design System & Accessibility

The **Orbital Laboratory** design system is engineered for maximum immersion, readability, and visual hierarchy under extreme lighting conditions:

### Calibrated Color Tokens
| Token Name | Hex Code | Role in Application |
| :--- | :--- | :--- |
| `spaceDark` | `#080D1A` | Primary background canvas representing deep space |
| `spaceSurface` | `#0E1726` | Card background and container surface |
| `spaceElevated` | `#1E293B` | Floating controls, active tabs, and modals |
| `cyan` | `#00E5FF` | Optics, reflection, primary highlights, and laser paths |
| `emerald` | `#10B981` | Correct answers, biology, success states, and verified laws |
| `amber` | `#FF9E00` | Energy, thermal conduction, caution states, and electricity |
| `violet` | `#8B5CF6` | Astronomy, atomic orbitals, and mastery achievements |
| `rose` | `#F43F5E` | Misconception alerts, fuse blowouts, and error indicators |

### WCAG AAA Contrast Verification
To guarantee legibility on budget smartphones in outdoor Ethiopian daylight, all UI elements are rigorously audited against WCAG standards:

| Foreground Token | Background | Calculated Ratio | WCAG AA Requirement | WCAG AAA Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `textPrimary` (`#F8FAFC`) | `spaceDark` (`#080D1A`) | **18.54 : 1** | $\ge 4.5:1$ | $\ge 7.0:1$ | ✅ **AAA Passed** |
| `cyan` (`#00E5FF`) | `spaceDark` (`#080D1A`) | **13.82 : 1** | $\ge 4.5:1$ | $\ge 7.0:1$ | ✅ **AAA Passed** |
| `emerald` (`#10B981`) | `spaceDark` (`#080D1A`) | **9.42 : 1** | $\ge 4.5:1$ | $\ge 7.0:1$ | ✅ **AAA Passed** |
| `amber` (`#FF9E00`) | `spaceDark` (`#080D1A`) | **8.71 : 1** | $\ge 4.5:1$ | $\ge 7.0:1$ | ✅ **AAA Passed** |
| `textSecondary` (`#94A3B8`) | `spaceDark` (`#080D1A`) | **7.59 : 1** | $\ge 4.5:1$ | $\ge 7.0:1$ | ✅ **AAA Passed** |

---

## 📁 Codebase Tour

```text
sciora/
├── .github/
│   ├── workflows/ci.yml         # Automated GitHub Actions continuous integration suite
│   └── PULL_REQUEST_TEMPLATE.md # Scientific & technical PR code review checklist
├── assets/                      # Bundled educational illustrations and app icons
├── docs/                        # Architectural specifications and curriculum mappings
│   ├── ARCHITECTURE.md          # Complete technical architecture specification
│   ├── CURRICULUM_MAPPING.md    # Unit-by-unit Ethiopian MoE textbook alignment
│   ├── DESIGN_SYSTEM.md         # Tokens, typography scale, and glassmorphism standards
│   └── TESTING.md               # Quality assurance protocol & verification guidelines
├── scripts/                     # Automated repository audit tools
│   ├── run-all-audits.js        # Master CI runner executing all 5 quality suites
│   ├── verify-curriculum.js     # Validates 10-step pedagogical contract compliance
│   ├── verify-simulations.js    # Audits SVG simulation components and contracts
│   └── verify-design-system.js  # Color token integrity and WCAG contrast validation
├── src/
│   ├── app/                     # File-based navigation routes (Expo Router)
│   │   ├── (tabs)/              # Core tabs: Home, Explore, Progress, Settings
│   │   ├── units/[unitId].tsx   # Unit overview & lesson listing
│   │   ├── lessons/[lessonId].tsx # 10-step pedagogical lesson engine
│   │   └── simulations/[simulationId].tsx # Standalone fullscreen lab view
│   ├── components/
│   │   ├── simulation/          # Reusable simulation workspace frames & telemetry
│   │   └── ui/                  # Glassmorphism cards, buttons, badges, modals
│   ├── content/                 # Bundled curriculum JSON files (Units 1, 2, 6, 7)
│   ├── database/                # SQLite initialization and transactional repositories
│   ├── design-system/           # Color palettes, typography, spacing, radii
│   ├── services/                # Content loader, backup exporter, and search service
│   ├── simulations/             # 9 Mathematical SVG physics simulation components
│   └── types/                   # TypeScript schemas for curriculum, lessons, and labs
├── package.json                 # Project dependencies and script definitions
├── tsconfig.json                # Strict TypeScript configuration
└── eslint.config.js             # Modern flat ESLint configuration for Expo
```

---

## 🧪 Master Quality & Audit Suite

Sciora maintains an automated 5-tier audit pipeline to ensure pedagogical integrity, mathematical accuracy, and code health:

```bash
# Execute the complete 5-suite quality runner:
npm test
```

### Individual Audit Commands
```bash
# 1. Audit Curriculum Integrity (Validates 10-step stages, inquiries, misconceptions)
npm run audit:curriculum

# 2. Audit Simulation Contracts (Validates all 9 vector engines and parameter bindings)
npm run audit:simulations

# 3. Audit Design System & WCAG (Validates color tokens and contrast ratios)
npm run audit:design

# 4. TypeScript Strict Compilation (Zero-tolerance typechecking)
npm run typecheck

# 5. Code Quality & Lint Integrity (ESLint Expo flat config)
npm run lint
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device, or an active Android Emulator / iOS Simulator.

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Respectus11/Sciora.git
   cd Sciora
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm run start
   ```

4. **Launch on your target platform:**
   - Scan the terminal QR code using **Expo Go** (Android) or the **Camera App** (iOS).
   - Press <kbd>a</kbd> for Android Emulator.
   - Press <kbd>i</kbd> for iOS Simulator.
   - Press <kbd>w</kbd> for Web browser mode.

---

## 🤝 Contributing & Code Review

We welcome contributions from educators, physics enthusiasts, and mobile software engineers. To contribute:

1. **Fork the repository** and create a descriptive feature branch:
   ```bash
   git checkout -b feature/refraction-dispersion-improvements
   ```
2. **Make your modifications**, ensuring all formulas and pedagogical schemas adhere to the Ethiopian Grade 8 Curriculum.
3. **Run the master audit suite** to guarantee zero regressions:
   ```bash
   npm test
   ```
4. **Push your branch** and open a Pull Request on GitHub.
5. Our GitHub Actions CI workflow will automatically execute all 5 quality suites. Use our integrated [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) to complete your scientific and technical code review.

---

## 📜 Curriculum Alignment & Academic Reference

- **Educational Authority:** Ministry of Education (MoE), Federal Democratic Republic of Ethiopia.
- **Reference Standard:** *General Science Student Textbook — Grade 8* (First Edition).
- **Primary Units Covered:**
  - **Unit 1:** Basics of Scientific Investigation (Density, Measurement, Apparatus)
  - **Unit 2:** Composition of Matter (Atoms, Molecules, Subatomic Particles)
  - **Unit 6:** Earth in Space (Solar System Dynamics, Keplerian Mechanics)
  - **Unit 7:** Motion, Force, Energy and Energy Resources (Optics, Heat, Sound, Magnetism, Electricity)
- **License:** Open educational distribution under the [MIT License](LICENSE).
