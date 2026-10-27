# BMEN 615: Bioengineered Cellular Systems

An interactive teaching presentation built around four papers that span 90 years of
trying to study living vascular and organ systems outside the body — from a 1937
whole-organ perfusion pump to a 2026 microfluidic chip with two independent,
communicating blood and lymphatic vessel networks.

Built for BMEN 615 (Texas A&M), presented by Justin Houck, PhD Student, Department
of Animal Science.

## What's in this repository

| Path | What it is |
|---|---|
| `app/` | The interactive web app: a browser-based presentation covering all four papers, a slide-deck "Presentation" mode with PDF export, a Q&A bank, and a live "presenter mode" for in-class use. |
| `paper_1/` – `paper_4/` | Each paper's source PDF, plus an OpenSCAD (`.scad`) source file and the exported `.stl` files for a 3D-printable physical teaching model of that paper's device. |
| `notes.md` | Documents what each printed model part represents, which figure/value in the source paper it's based on, and every place the model's geometry departs from the real device (scale, simplifications, fixes applied across revisions). |
| `BMEN615_Backup_Reference.pdf` | A 51-page, fully self-contained PDF covering everything in the web app (intro, all four papers, the evaluation/frontier comparison, the full 48-item Q&A bank, and the glossary) — a standalone backup in case the live app, a projector, or a network connection fails mid-class. |
| `intro.txt`, `questions.txt` | Working notes used to shape the app's Introduction tab and its Q&A bank. |
| `pictures/` | Reference photos and video clips of the printed models and source figures. |
| `extract_assets.py` | One-off script used to extract figure images directly from the source PDFs into `app/assets/`. |

## The four papers

1. **1937 — Carrel**, *Culture of Whole Organs I: Technique of the Culture of the
   Thyroid Gland*, *J. Exp. Med.* First demonstration that a whole mammalian organ
   could be kept alive outside the body via pulsatile perfusion (the Lindbergh
   apparatus).
2. **2022 — Selahi et al.**, *Lymphangion-chip*, *Lab Chip*. First in vitro model to
   co-culture a lymphatic vessel's lining and muscle cells together, showing the
   muscle layer protects the lining from inflammatory barrier breakdown.
3. **2024 — Tronolone, Mohamed & Jain**, *Engineering Lymphangiogenesis-on-Chip*,
   *Adv. Biol.* Identifies ESM-1 (endocan) as a lymphatic-specific driver of new
   vessel sprouting.
4. **2026 — Gray-Scherr et al.**, *A 3D microfluidic model of exchange between
   perfused blood and lymphatic microvascular networks*, *Lab Chip*. Two
   independently-fed human vessel networks sharing one gel, with live tracking of
   inflammation-driven immune-cell trafficking between them.

Full citations and DOIs are in `notes.md`.

## Running the app locally

**Quick, static-only** (no presenter mode / presence beacon):

```bash
cd app
./start.sh       # serves at http://localhost:8080
./stop.sh        # stops it
```

**Full stack**, matching production (adds the presenter-mode presence service):

```bash
cd app
docker-compose up --build   # serves at http://localhost:8080
```

Presenter mode is opt-in via `?present=1` (e.g. `http://localhost:8080/?present=1`),
gated by a passphrase set in `docker-compose.yml` (`PRESENTER_TOKEN` — change the
`change-me-before-deploying` placeholder before relying on it). Once unlocked, a
presenter can push students' browsers to follow along ("Push to Everyone") or
force a synchronized hard-reload ("Refresh Everyone").

## Deployment

See `app/DEPLOY_TO_DIGITALOCEAN.md` for the full guide (currently deployed at
`globalhawk.us`): two Docker containers (static site + presence service) behind a
host-level nginx handling TLS.

## The 3D-printed teaching kits

Each paper's `.scad` file is parametric OpenSCAD source; the shipped `.stl` files
are the exported, print-ready parts. `notes.md` documents, part by part, what each
piece represents, the exact figure/value it's based on, and every intentional
departure from the real device (e.g., scale isn't uniform where literal scale-ups
would be unprintable). Paper 4's kit is included for reference but was not revised
in the pass documented there.

## Status

This content has been independently fact-checked against the extracted text of all
four source PDFs. No fabricated statistics or invented findings were found; a
handful of minor wording-precision issues were identified and corrected (see
project history for details).

No license file is included yet — add one before treating any part of this as
reusable beyond the course it was built for.
