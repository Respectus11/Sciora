# Sciora — Grade 8 Science Learning App

Sciora is a mobile-first science learning app for Ethiopian Grade 8 students. It combines curriculum-based lessons with interactive visual simulations so learners can explore scientific ideas, change parameters, and observe results.

The app is built with React Native and Expo. Curriculum content is bundled with the application, while learning progress and notes are stored locally with SQLite.

## Highlights

- Curriculum content organized around Ethiopian Grade 8 General Science Units 1, 2, 6, and 7
- Interactive simulations for density, atomic structure, the solar system, reflection, refraction, heat conduction, electric circuits, sound waves, and magnetism
- Guided lessons with prediction prompts, explanations, knowledge checks, and reflection activities
- A scientific glossary and search across the bundled learning content
- Local progress tracking, notes, bookmarks, and backup/restore workflows
- A consistent dark interface with reusable components and design tokens
- Automated repository checks for curriculum content, simulation contracts, design tokens, TypeScript, and linting

## Technology

- **App framework:** React Native, Expo, Expo Router
- **Language:** TypeScript
- **Visual simulations:** React Native SVG
- **Local persistence:** expo-sqlite
- **UI and interaction:** React Navigation, Expo Haptics, Expo Blur, Expo Linear Gradient
- **Quality checks:** TypeScript, ESLint, and project-specific audit scripts

## Getting started

### Prerequisites

Install Node.js and npm, then set up at least one target platform:
- Expo Go on a compatible Android or iOS device
- An Android emulator or iOS simulator
- A web browser for the configured web target

Use a Node.js version supported by the Expo SDK declared in `package.json`.

### Install dependencies

```bash
git clone https://github.com/Respectus11/Sciora.git
cd Sciora
npm install
```

### Start the development server

```bash
npm start
```

Follow the Expo CLI instructions to open the app on a device or emulator. The repository also defines platform-specific scripts:

```bash
npm run android
npm run ios
npm run web
```

Availability and behavior can vary by device, simulator configuration, and Expo Go compatibility.

## Run the quality checks

Run the project's audit suite:

```bash
npm test
```

Individual checks are available as well:

```bash
npm run audit:curriculum
npm run audit:simulations
npm run audit:design
npm run typecheck
npm run lint
```

These commands are defined in `package.json`; run them locally to verify the current checkout.

## Curriculum and simulations

| Topic | Simulation |
| --- | --- |
| Density and flotation | Density measurement |
| Atomic structure | Atom builder |
| Solar system | Solar system model |
| Light reflection | Reflection lab |
| Light refraction | Refraction and dispersion |
| Thermal conduction | Heat transfer |
| DC electricity | Circuit builder |
| Acoustic waves | Sound wave lab |
| Magnetism | Magnetic fields and dipoles |

Curriculum data is stored in `src/content/`, with shared TypeScript types in `src/types/`. The simulation registry is maintained in `src/simulations/registry.ts`.

## Project structure

```text
Sciora/
├── src/
│   ├── app/             Expo Router screens and navigation
│   ├── components/     Reusable UI and simulation components
│   ├── content/        Curriculum JSON and unit content
│   ├── database/       SQLite schema and repositories
│   ├── design-system/  Colors, spacing, typography, and elevation
│   ├── services/       Content, glossary, search, and backup services
│   └── simulations/    Interactive science simulations
├── scripts/            Curriculum, simulation, and design audits
├── docs/               Architecture and project documentation
├── app.json            Expo application configuration
├── eas.json            EAS build profiles
└── package.json        Dependencies and project scripts
```

## Offline use and data

Sciora is designed around bundled learning materials and on-device persistence. Notes and progress are stored locally, and the application does not require students to create an account to use these features. Review the implementation and device behavior before making deployment-specific privacy guarantees.

## Contributing

1. Create a branch for your change.
2. Keep curriculum updates consistent with the content schema and intended Grade 8 scope.
3. Run `npm test`, `npm run typecheck`, and `npm run lint` before opening a pull request.
4. For curriculum or simulation changes, include the source or reasoning needed to review scientific accuracy.

## License

Sciora is distributed under the [MIT License](LICENSE).
