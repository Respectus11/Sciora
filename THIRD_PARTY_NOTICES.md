# Third-Party Notices and Open Source Licenses

Sciora is an open educational application developed to support Ethiopian Grade 8 students. This document inventories all upstream code, ideas, assets, and libraries consulted or adapted in the project.

---

## 1. Upstream Simulation Repository

- **Repository**: [https://github.com/gemsjohn/physics-sims](https://github.com/gemsjohn/physics-sims)
- **Author**: John Martin
- **License**: MIT License
- **Commit Reference**: `main` (Audited October 2026)

### License Text:

```text
MIT License

Copyright (c) 2025 John Martin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Audit & Adaptation Notes:
1. **`bohr_model.html`**:
   - Upstream code uses Three.js + UnrealBloomPass loaded dynamically from `https://unpkg.com/three@0.163.0/`.
   - *Sciora decision*: Rebuilt as a 2D native SVG/Skia pedagogical atom builder with clear simplified model labeling, element configuration up to Sodium (Na), proton/neutron/electron counters, and offline independence. Upstream element data and visual color cues consulted under MIT.
2. **`planetary_orbit.html`**:
   - Upstream code uses Three.js loaded from `https://cdn.jsdelivr.net/npm/three@0.163.0/` and includes advanced Hohmann transfer and Keplerian orbital mechanics.
   - *Sciora decision*: Rebuilt as an educational, touch-friendly 2D/schematic Solar System Explorer aligned with Grade 8 General Science Unit 6. Advanced orbital-transfer mechanics excluded to maintain curriculum focus.
3. **`earths_magnetic_field.html` & `em_solenoid.html`**:
   - Upstream code uses 3D canvas and CDN imports.
   - *Sciora decision*: Excluded from core Unit 7.6 requirement in favor of a direct 2D bar-magnet field-lines and magnetic-materials lab. Retained as reference for future advanced extension modules.
4. **`general_relativity.html`**:
   - Excluded. General relativity is beyond the Ethiopian Grade 8 General Science syllabus.

---

## 2. Curriculum & Educational References

- **Source**: *Ethiopian Grade 8 General Science Student Textbook (New Curriculum)*
- **Issuing Authority**: Ministry of Education (MoE), Federal Democratic Republic of Ethiopia
- **Authors**: Yonas Nibret, Sefiw Melesse, Abebe Habte
- **Educational Alignment**: Grade 8 General Science English National Edition (231 pages, 7 units)
- **Usage**: Referenced for curriculum mapping, learning objectives, sequence, and pedagogical terminology. All explanations and diagrams in Sciora are original works created specifically for mobile interactive learning.

---

## 3. Core Software Libraries

When installed in subsequent phases, standard open-source libraries (Expo, React Native, React Native SVG, Expo SQLite, Lucide Icons, etc.) will retain their respective MIT and Apache 2.0 licenses in this directory.
