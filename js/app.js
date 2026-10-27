// Main Application Controller

let currentPaperId = 'paper1';
let glossaryData = [];

// Presenter-beacon state (see presence/presence_server.py)
let presenterModeActive = false;
let presenterToken = null;
let lastSeenPresenceTs = 0;
let beaconDismissedTs = 0;

const paperLabels = {
  paper4: '1937: Whole-Organ',
  paper2: '2022: Lymphangion',
  paper3: '2024: L-Chip Sprouting',
  paper1: '2026: Blood-Lymph',
  frontier: 'Evaluation & Frontier'
};

// Paper Data Configuration
const papersData = {
  paper1: {
    badge: 'Lab Chip 2026',
    title: '3D Microfluidic Model of Blood & Lymphatic Exchange',
    authors: 'Delaney Gray-Scherr, Terry Ching, Christopher S. Chen, et al.',
    video: {
      src: 'assets/videos/paper1_blood_lymph.mp4',
      caption: 'Illustration of the blood (magenta) and lymphatic (green) vessel networks exchanging T-cells and dissolved molecules across the shared gel — the mechanism this paper\'s chip reproduces.'
    },
    splitSlider: {
      leftImg: 'assets/paper_1/fig6_tcell_trafficking.png',
      rightImg: 'assets/paper_1/fig4_independent_perfusion.png',
      leftLabel: 'T-Cells Moving (+TNF-alpha)',
      rightLabel: 'Dye Flowing Through the Chip'
    },
    figures: [
      { id: 'p1_f1', title: 'Fig 1: Design & Assembly', img: 'assets/paper_1/fig1_design_and_assembly.jpeg', desc: 'Separate blood and lymphatic sections, each fed with fluid on its own, with a gel between them.' },
      { id: 'p1_f2', title: 'Fig 2: Vessel Morphology', img: 'assets/paper_1/fig2_network_morphology.png', desc: 'Blood vs. lymphatic vessel cell-junction protein (VE-cadherin) and channel widths.' },
      { id: 'p1_f3', title: 'Fig 3: Morphometric Analysis', img: 'assets/paper_1/fig3_vessel_characterization.jpeg', desc: 'Charts of vessel width and how densely packed the cell junctions are.' },
      { id: 'p1_f4', title: 'Fig 4: Independent Perfusion', img: 'assets/paper_1/fig4_independent_perfusion.png', desc: 'Fluid staying within the blood vs. lymph channels under normal flow.' },
      { id: 'p1_f5', title: 'Fig 5: Size Solute Transport', img: 'assets/paper_1/fig5_solute_transport_size.jpeg', desc: 'Small tracer molecules (10 and 70 kilodaltons) cross the gel barrier; a much larger one (2000 kilodaltons) is blocked.' },
      { id: 'p1_f6', title: 'Fig 6: T-Cell Trafficking', img: 'assets/paper_1/fig6_tcell_trafficking.png', desc: 'TNF-alpha increases T-cell crossing into the lymphatic network: 3.31-fold for resting T-cells, 5.89-fold for already-activated ones.' }
    ],
    whyItMatters: {
      badge: 'First Dual-Network Exchange Chip',
      discovery: 'This is the first chip to grow two separate, self-assembled human vessel networks — one blood, one lymphatic — side by side in one shared gel, each fed independently, that stay distinct (never fusing into one network) while still exchanging molecules and immune cells across the gel between them. Using that setup, the paper watched, in real time, how an inflammatory signal (TNF-alpha) increases how many T-cells cross from the blood network into the lymphatic network (3.31-fold for resting T-cells, 5.89-fold for already-activated ones).',
      significance: 'Before this, studying how immune cells move from blood into lymphatic vessels meant using whole animals or much simpler single-vessel setups. Having both vessel types side by side, built from human cells, with live imaging, gives researchers a way to directly test drugs that affect immune-cell trafficking (e.g., anti-inflammatories) or study how tumors exploit lymphatic drainage to spread — without leaving the dish.'
    },
    lifespan: {
      badge: 'Day 5 Standard Timepoint',
      window: 'Day 5 (established timepoint; not reported beyond this)',
      assayTime: '3 hrs (drainage test) / 4 hrs (T-cell movement test)',
      limitingFactor: 'Not reported in the paper',
      mainDesc: 'The paper settles on Day 5 as its standard testing point, once both vessel networks have finished forming on their own over 5 days. From there, individual tests run a few hours each (drainage: 3 hours; T-cell movement: 4 hours). The paper does not report what happens to the networks after Day 5, and gives no reason they would eventually stop working or how long they could keep going — a specific multi-day "failure timeline" cannot be grounded in fact in this paper.',
      bioDegradation: 'This cannot be grounded in fact in the paper. It does not report a biological reason the system would eventually fail (for example, the gel breaking down, or effects from the missing support cells called pericytes).',
      physDegradation: 'This cannot be grounded in fact in the paper beyond the stated test durations. The small pressure difference (9.6 Pa, created by 40 microliters on the blood side vs. 10 on the lymph side) drives the reported 3-4 hour tests; the paper doesn\'t say how long it would take for the reservoirs to run out.',
      workaround: 'This cannot be grounded in fact as a stated fix in the paper. The paper\'s own discussion names different future directions: adding a recirculating pump or a more controlled pressure source, together with computer flow simulations, to better define and control the flow.'
    }
  },
  paper2: {
    badge: 'Lab Chip 2022',
    title: 'Lymphangion-Chip: Co-Culture & Bidirectional Signaling',
    authors: 'Amirali Selahi, Teshan Fernando, Abhishek Jain, et al.',
    video: {
      src: 'assets/videos/paper2_lymphangion.mp4',
      caption: 'Illustration of a single lymphangion: the lymphatic-vessel lining (red) wrapped in a muscle sheath (green), with a tracer molecule passing through — the structure this paper\'s chip reconstructs.'
    },
    splitSlider: {
      leftImg: 'assets/paper_2/fig6_cell_alignment_shear.jpeg',
      rightImg: 'assets/paper_2/fig4_reconstitution_endothelial_muscle.jpeg',
      leftLabel: 'Cells Realigning Under Shear (Fig 6)',
      rightLabel: 'Lining & Muscle Cells Together (Fig 4)'
    },
    figures: [
      { id: 'p2_f1', title: 'Fig 1: Lymphangion Model', img: 'assets/paper_2/fig1_lymphangion_model.jpeg', desc: 'The lymphangion (vessel segment between two valves) recreated in a lab channel.' },
      { id: 'p2_f2', title: 'Fig 2: GLP Technique', img: 'assets/paper_2/fig2_glp_lumen_technique.jpeg', desc: 'Turning the channel vertical during fabrication prevents it from sagging unevenly.' },
      { id: 'p2_f3', title: 'Fig 3: Tuning Diameters', img: 'assets/paper_2/fig3_tuning_diameters.jpeg', desc: 'Controlling channel width using fluid pressure and how concentrated the collagen gel is.' },
      { id: 'p2_f4', title: 'Fig 4: Dual-Layer Reconstitution', img: 'assets/paper_2/fig4_reconstitution_endothelial_muscle.jpeg', desc: '3D microscope image showing a complete layer of lymphatic-vessel lining cells surrounded by muscle cells.' },
      { id: 'p2_f5', title: 'Fig 5: Cellular Cross-Section', img: 'assets/paper_2/fig5_cellular_assessment_cross_section.jpeg', desc: 'How the gap between the vessel lining and the muscle layer changes over 96 hours.' },
      { id: 'p2_f6', title: 'Fig 6: Shear & Alignment', img: 'assets/paper_2/fig6_cell_alignment_shear.jpeg', desc: 'The muscle cells shift from mostly lengthwise (~31°) toward wrapping more around the vessel (~61°), but only when grown together with lining cells under fluid shear — never reaching a literal 90°.' },
      { id: 'p2_f7', title: 'Fig 7: Barrier Function', img: 'assets/paper_2/fig7_barrier_function_fitc_diffusion.jpeg', desc: 'A test measuring how much a labeled tracer molecule leaks through the vessel wall.' }
    ],
    whyItMatters: {
      badge: 'First LEC-LMC Crosstalk Model',
      discovery: 'No prior lab model had ever grown lymphatic lining cells (LECs) and lymphatic muscle cells (LMCs) together around one vessel. This paper did, and found that doing so changes the biology: the two cell types align differently under flow when grown together vs. alone, and — in the paper\'s own words — when the muscle cells were co-cultured with the lining cells, "the lymphatic endothelial barrier function was relatively conserved" after exposure to the inflammatory signal TNF-alpha (Fig. 7D), where the lining cells leaked much more when grown without the muscle layer.',
      significance: 'This is the first direct evidence that lymphatic muscle cells actively protect the vessel lining during inflammation, not just squeeze lymph along mechanically. That points to LMC health, not just LEC health, as a possible target for treating lymphedema and inflammatory vessel leakiness. The fabrication method itself (gravitational lumen patterning) is also a reusable toolbox for building other tunable, round, multi-layered vessel models.'
    },
    lifespan: {
      badge: 'Up to 96 hr (5 Days) Tracked',
      window: 'Up to 96 hr / 5 Days (tracked range)',
      assayTime: 'Continuous fluid flow from a pump; no stated time limit',
      limitingFactor: 'Not reported in the paper',
      mainDesc: 'The paper\'s own experiments track the system for up to 5 days: the vessel lining becomes a complete layer within 60 hours, and the gap between the two cell layers is followed through 96 hours. The paper does not report what happens to the device after Day 5, and does not name a specific reason it would eventually fail — a multi-day "collapse" timeline cannot be grounded in fact in this paper.',
      bioDegradation: 'This cannot be grounded in fact in the paper. It does not report a specific biological reason for failure, such as the gel shrinking or the cell layers coming apart.',
      physDegradation: 'This cannot be grounded in fact in the paper. It makes no claim about the vessel wearing out from fluid friction, or cell-junction proteins declining, beyond Day 5.',
      workaround: 'This cannot be grounded in fact as a lifespan fix in the paper. The paper\'s stated next steps are about adding valves inside the vessel, a pulsing expansion-and-contraction motion, and linking several vessel segments together — not about extending how long the device lasts.'
    }
  },
  paper3: {
    badge: 'Adv Biol 2024',
    title: 'Engineering Lymphangiogenesis-on-Chip (L-Chip)',
    authors: 'James J. Tronolone, Nadin Mohamed, Abhishek Jain',
    video: {
      src: 'assets/videos/paper3_lchip_sprouting.mp4',
      caption: 'Illustration of a lymphatic capillary sprouting from a parent vessel — the process this paper\'s chip studies under combined fluid flow and chemical growth signals.'
    },
    splitSlider: {
      leftImg: 'assets/paper_3/fig2_conditioning_gradients_flow.jpeg',
      rightImg: 'assets/paper_3/fig1_lchip_sprout_dynamics.jpeg',
      leftLabel: 'Combinations of Conditions Tested (Fig 2)',
      rightLabel: 'Sprouting Over Time (Fig 1)'
    },
    figures: [
      { id: 'p3_f1', title: 'Fig 1: Sprout Dynamics (Day 1-4)', img: 'assets/paper_3/fig1_lchip_sprout_dynamics.jpeg', desc: 'New capillaries sprout past the tiny retaining pillars, reaching about 1 mm by Day 4.' },
      { id: 'p3_f2', title: 'Fig 2: Conditioning & Gradients', img: 'assets/paper_3/fig2_conditioning_gradients_flow.jpeg', desc: 'How chemical gradients and fluid flow through the gel work together.' },
      { id: 'p3_f3', title: 'Fig 3: Interstitial Flow Interactions', img: 'assets/paper_3/fig3_interstitial_flow_interactions.jpeg', desc: 'Sprouts grow fastest when growing against the direction of fluid flow.' },
      { id: 'p3_f4', title: 'Fig 4: Conditioning Duration', img: 'assets/paper_3/fig4_conditioning_duration.jpeg', desc: 'How pre-treating cells with growth-signaling proteins affects how far sprouts grow.' },
      { id: 'p3_f5', title: 'Fig 5: Endocan (ESM-1) Role', img: 'assets/paper_3/fig5_endocan_esm1_determinant.jpeg', desc: 'ESM-1 alone is enough to strongly drive new lymphatic-vessel growth.' }
    ],
    whyItMatters: {
      badge: 'ESM-1 Identified as a Lymphatic-Specific Driver',
      discovery: 'The paper found that endocan (ESM-1) alone — without the rest of the growth-factor cocktail normally used — is enough to strongly drive new lymphatic sprouting, and that this effect is specific to lymphatic vessels: the same factor did not drive sprouting the same way in a matched blood-vessel (angiogenesis) chip.',
      significance: 'ESM-1 was already known as a marker linked to blood-vessel growth and cancer, but it was under-explored as a driver specifically of lymphatic-vessel growth. Pinning down one specific, lymphatic-selective molecular trigger gives researchers a concrete target for drugs meant to encourage new lymphatic growth (e.g., after lymph node removal or in lymphedema) or block it (e.g., to slow tumor-associated lymphatic spread) — without also disturbing blood vessels.'
    },
    lifespan: {
      badge: 'Fixed 96 hr (4-Day) Endpoint',
      window: '96 hr / 4 Days (fixed experimental endpoint)',
      assayTime: '96-hour fixed growth period before the tissue is preserved and imaged',
      limitingFactor: 'Not reported in the paper',
      mainDesc: 'Every experiment in this paper uses a fixed 96-hour (4-day) growth and measurement period, by which sprouts reach up to ~1 mm. The paper does not report what happens to sprouts after Day 4 and makes no claim about them breaking down, shrinking back, or any limit past that point — a specific "Day 5-6 regression" timeline cannot be grounded in fact in this paper.',
      bioDegradation: 'This cannot be grounded in fact in the paper. It does not report sprouts shrinking back, internal structures collapsing, or cell death beyond Day 4.',
      physDegradation: 'This cannot be grounded in fact in the paper. It does not report how long the chemical gradient would keep working beyond the fixed 96-hour endpoint.',
      workaround: 'This cannot be grounded in fact as a lifespan fix in the paper. The paper\'s own stated next steps are studying exactly how ESM-1 works, and adding supporting cell types currently missing from the model (muscle cells, connective-tissue cells, pericytes, macrophages).'
    }
  },
  paper4: {
    badge: 'J Exp Med 1937',
    title: 'The Culture of Whole Organs (Lindbergh Apparatus)',
    authors: 'Alexis Carrel (perfused with the Lindbergh pump)',
    video: {
      src: 'assets/videos/paper4_pump_organ.mp4',
      caption: 'The organ chamber of the Lindbergh apparatus, with the perfused thyroid gland visible inside the glass — illustrating the pulsatile perfusion this paper\'s pump performs.'
    },
    splitSlider: {
      leftImg: 'assets/paper_4/plate18_hyperplasia_follicles.png',
      rightImg: 'assets/paper_4/plate17_control_and_perfused_thyroid.png',
      leftLabel: 'Hyperplasia (+Peptone)',
      rightLabel: 'Control Follicles (Serum)'
    },
    figures: [
      { id: 'p4_f1', title: 'Plate 17: Control & 6-Day Perfusion', img: 'assets/paper_4/plate17_control_and_perfused_thyroid.png', desc: 'Normal follicle structure maintained after 6 days outside the body.' },
      { id: 'p4_f2', title: 'Plate 18: Hyperplasia under Peptone', img: 'assets/paper_4/plate18_hyperplasia_follicles.png', desc: 'Extra cell growth lining the follicles, with visible signs of the stored colloid substance being reabsorbed.' },
      { id: 'p4_f3', title: 'Plate 19: Explant Viability Outgrowth', img: 'assets/paper_4/plate19_epithelial_outgrowth.png', desc: 'Clusters of cells still actively growing after 8–18 days of whole-organ culture outside the body.' }
    ],
    whyItMatters: {
      badge: 'First Whole-Organ Culture Outside the Body',
      discovery: 'This paper demonstrated that a whole mammalian (or bird) organ — not just isolated cells, but an intact gland with its own blood vessels — could be kept alive, metabolically active, and even growing new cells for days to weeks entirely outside the body, using nothing but pulsatile fluid pressure (the Lindbergh pump) and a nutrient fluid with no actual blood cells in it. The paper also pinned down a specific cause-and-effect: adding Witte\'s peptone to that fluid, not perfusion itself, is what drove the glands to grow new cells (hyperplasia).',
      significance: 'This was 90 years before organ-on-a-chip devices, and it first proved that an organ\'s physiology — not just its cells in a dish — could be sustained and studied outside the body at all. It is a direct conceptual ancestor of the organ-preservation and ex vivo perfusion techniques used today to keep donor organs viable for transplant, and it was an early demonstration that a single, defined ingredient in a nutrient medium could trigger a specific, controllable growth response in living tissue.'
    },
    lifespan: {
      badge: '3–21 Days (pH-Limited)',
      window: '3–21 Days reported; 6 days used for most main figures',
      assayTime: 'Continuous pulsing, gas-driven perfusion',
      limitingFactor: 'Fluid pH decline (stopping rule: pH below 7)',
      mainDesc: 'Carrel reports perfusion runs lasting from 3 to 21 days, though 6 days is the duration used for most of the paper\'s main histology comparisons (Plates 17-18). The paper\'s own explicit stopping rule is pH-based: the fluid\'s pH starts around 7.5 and falls progressively over about a week toward roughly 7.0-7.1, and "when the pH goes below 7, the experiment is interrupted."',
      bioDegradation: 'A gradual drop in the fluid\'s pH (becoming more acidic) is the paper\'s own stated limiting factor — pH falls from about 7.5 toward 7.0-7.1 over about a week. The paper does not attribute this to a named modern diagnosis (like "metabolic acidosis") — that label is a present-day gloss, not the paper\'s own language.',
      physDegradation: 'This cannot be grounded in fact as stated. The paper notes small side-vessels are deliberately left open rather than tied off, bleeding into the surrounding tissue and causing swelling — but it states directly that this swelling "has no ill effect on the gland," which contradicts treating it as a reason for failure. No claim about blocked vessels or tissue death from lack of blood appears in the paper.',
      workaround: 'This cannot be grounded in fact in the paper itself. Modern organ-preservation technology (continuous oxygen supply, fluid filtering, and automatic pH control) is a reasonable present-day point of comparison, but it is not something the 1937 paper discusses.'
    }
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // 2. Load Glossary Data
  fetch('assets/data/glossary.json')
    .then(r => r.json())
    .then(data => {
      glossaryData = data.terms || [];
      renderGlossaryDrawer();
    })
    .catch(err => console.error('Error loading glossary:', err));

  // 3. Setup Navigation Tabs (desktop tab row + mobile dropdown, kept in sync)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.paper));
  });

  const mobileNavSelect = document.getElementById('mobile-nav-select');
  mobileNavSelect?.addEventListener('change', (e) => setActiveTab(e.target.value));

  // 5. Setup Split Slider ("Curtain Wipe")
  initSplitSlider();

  // 6. Setup Scrubber
  initScrubber();

  // 7. Setup Lightbox
  initLightbox();

  // 8. Setup Glossary Drawer
  initGlossaryDrawer();

  // 9. Setup QA Filter Tabs
  initQAFilterTabs();

  // 10. Presenter Mode (hidden, opt-in via ?present=1) & student Presence Beacon
  initPresenterMode();
  initPresenceBeacon();

  // Land on whatever tab a presenter-triggered "Refresh Everyone" sent us
  // to (see pushPresenterRefresh / doForcedRefresh), or Introduction by
  // default. Clean the URL afterward so a later manual refresh doesn't
  // keep re-landing here.
  const landingParams = new URLSearchParams(window.location.search);
  const gotoPaper = landingParams.get('goto');
  const gotoCategory = landingParams.get('gotoCategory');
  if (gotoPaper) {
    setActiveTab(gotoPaper);
    if (gotoCategory && gotoCategory !== 'all') {
      const filterBtn = document.querySelector(`.qa-filter-btn[data-cat="${gotoCategory}"]`);
      if (filterBtn) filterBtn.click();
    }
    landingParams.delete('goto');
    landingParams.delete('gotoCategory');
    const cleanedSearch = landingParams.toString();
    const cleanedUrl = window.location.pathname + (cleanedSearch ? `?${cleanedSearch}` : '') + window.location.hash;
    window.history.replaceState({}, '', cleanedUrl);
  } else {
    setActiveTab('intro');
  }
});

// Switch the active section: syncs the desktop tab row, the mobile
// dropdown, and loads the paper/view itself. Used by tab clicks, the
// mobile <select>, and the presenter-beacon "Jump there" handler so all
// three entry points always agree on what's showing.
function setActiveTab(paperId) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.paper === paperId);
  });
  const mobileNavSelect = document.getElementById('mobile-nav-select');
  if (mobileNavSelect) mobileNavSelect.value = paperId;
  loadPaper(paperId);
}

// Load Paper Data into UI
function loadPaper(paperId) {
  currentPaperId = paperId;
  broadcastPresence(paperId);
  const singleView = document.getElementById('single-paper-view');
  const frontierView = document.getElementById('frontier-view');
  const introView = document.getElementById('intro-view');
  const newQuestionsView = document.getElementById('newquestions-view');
  const presentationView = document.getElementById('presentation-view');

  // Hide every special full-page view by default; each branch below re-shows its own.
  if (singleView) singleView.style.display = 'none';
  if (frontierView) frontierView.style.display = 'none';
  if (introView) introView.style.display = 'none';
  if (newQuestionsView) newQuestionsView.style.display = 'none';
  if (presentationView) presentationView.style.display = 'none';

  if (paperId === 'intro') {
    if (introView) introView.style.display = 'flex';
    initIntroGallery();
    return;
  }

  if (paperId === 'presentation') {
    if (presentationView) presentationView.style.display = 'flex';
    initPresentationDeck();
    return;
  }

  if (paperId === 'newquestions') {
    if (newQuestionsView) newQuestionsView.style.display = 'flex';
    return;
  }

  if (paperId === 'frontier') {
    if (frontierView) frontierView.style.display = 'flex';
    loadFrontierData();
    return;
  }

  if (singleView) singleView.style.display = 'block';

  const paper = papersData[paperId];
  if (!paper) return;

  // Update Header Banner
  document.getElementById('paper-badge').textContent = paper.badge;
  document.getElementById('paper-title').textContent = paper.title;
  document.getElementById('paper-authors').textContent = paper.authors;

  // Load the paper's "System in Action" video
  if (paper.video) {
    const videoEl = document.getElementById('paper-video');
    const captionEl = document.getElementById('viewport-caption');
    if (videoEl && videoEl.getAttribute('src') !== paper.video.src) {
      videoEl.setAttribute('src', paper.video.src);
      videoEl.load();
      videoEl.play().catch(() => { /* autoplay may be blocked until user interacts; fine */ });
    }
    if (captionEl) captionEl.textContent = paper.video.caption;
  }

  // Update Split Slider Images
  if (paper.splitSlider) {
    document.getElementById('split-img-left').src = paper.splitSlider.leftImg;
    document.getElementById('split-img-right').src = paper.splitSlider.rightImg;
    document.getElementById('split-label-left').textContent = paper.splitSlider.leftLabel;
    document.getElementById('split-label-right').textContent = paper.splitSlider.rightLabel;
  }

  // Populate Figures Gallery
  const gallery = document.getElementById('figures-gallery');
  if (gallery) {
    gallery.innerHTML = '';
    paper.figures.forEach(fig => {
      const card = document.createElement('div');
      card.className = 'figure-thumb-card';
      card.innerHTML = `
        <div class="figure-thumb-img">
          <img src="${fig.img}" alt="${fig.title}" loading="lazy">
        </div>
        <div class="figure-thumb-info">
          <div class="figure-thumb-title">${fig.title}</div>
          <div class="figure-thumb-desc">${fig.desc}</div>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(fig.title, fig.img, fig.desc));
      gallery.appendChild(card);
    });
  }

  // Configure Special Experimental Features per Paper
  const p3Feature = document.getElementById('paper3-scrubber-box');
  const p1Feature = document.getElementById('paper1-tcell-box');
  if (p3Feature) p3Feature.style.display = (paperId === 'paper3') ? 'block' : 'none';
  if (p1Feature) p1Feature.style.display = (paperId === 'paper1') ? 'block' : 'none';

  // Update "Why This Paper Matters" Card
  if (paper.whyItMatters) {
    const wmBadgeEl = document.getElementById('why-matters-badge');
    const wmDiscoveryEl = document.getElementById('why-matters-discovery');
    const wmSignificanceEl = document.getElementById('why-matters-significance');

    if (wmBadgeEl) wmBadgeEl.textContent = paper.whyItMatters.badge;
    if (wmDiscoveryEl) wmDiscoveryEl.textContent = paper.whyItMatters.discovery;
    if (wmSignificanceEl) wmSignificanceEl.textContent = paper.whyItMatters.significance;
  }

  // Update Lifespan & Degradation Card
  if (paper.lifespan) {
    const badgeEl = document.getElementById('lifespan-badge');
    const windowEl = document.getElementById('lifespan-window');
    const assayTimeEl = document.getElementById('lifespan-assay-time');
    const limitingFactorEl = document.getElementById('lifespan-limiting-factor');
    const mainDescEl = document.getElementById('lifespan-main-desc');
    const bioTextEl = document.getElementById('lifespan-bio-text');
    const physTextEl = document.getElementById('lifespan-phys-text');
    const workaroundTextEl = document.getElementById('lifespan-workaround-text');

    if (badgeEl) badgeEl.textContent = paper.lifespan.badge;
    if (windowEl) windowEl.textContent = paper.lifespan.window;
    if (assayTimeEl) assayTimeEl.textContent = paper.lifespan.assayTime;
    if (limitingFactorEl) limitingFactorEl.textContent = paper.lifespan.limitingFactor;
    if (mainDescEl) mainDescEl.textContent = paper.lifespan.mainDesc;
    if (bioTextEl) bioTextEl.textContent = paper.lifespan.bioDegradation;
    if (physTextEl) physTextEl.textContent = paper.lifespan.physDegradation;
    if (workaroundTextEl) workaroundTextEl.textContent = paper.lifespan.workaround;
  }

  // Update Paper Q&A Interrogation
  renderPaperQA(paperId, 'all');
  document.querySelectorAll('.qa-filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === 'all');
  });
}

// Introduction Tab: historical figure gallery
// Source: Maximow, A.A. & Bloom, W. "A Textbook of Histology," 7th ed.,
// W.B. Saunders, 1957, Chapter 11 "The Lymphatic System." The `desc` field
// on each entry is the book's own original caption, transcribed directly
// from the photographed plates, not paraphrased. The `story` field is new
// teaching narrative (not from the book) explaining what the lymphatic
// system is doing at that point, using the plate as the illustration --
// read in order, the 10 stories trace one continuous journey: fluid
// leaving the bloodstream, picked up by a lacteal, traveling the vessels,
// passing an organ, arriving at a node, filtering through it, and finally
// how the whole system gets built in the first place.
const introFigures = [
  {
    id: 'intro_f0', title: 'Chapter 11 Opening (p. 252)', img: 'assets/intro/fig0_chapter_opening.jpg',
    story: 'Every lymph node, every vessel, every cell you\'re about to see exists because of one basic leak: blood capillaries constantly push more fluid out into the tissues than they pull back in. Something has to recover that extra fluid, or tissues would swell indefinitely. That "something" is the entire system this chapter describes.',
    desc: 'Opening page of "The Lymphatic System." Maximow & Bloom, 1957, p. 252.'
  },
  {
    id: 'intro_f1', title: 'Fig. 11-1: Lacteals of an Intestinal Villus', img: 'assets/intro/fig1_lacteals.jpg',
    story: 'This is where lymph is born. Tucked inside each finger-like intestinal villus is a single blind-ended tube -- a lacteal -- with no opening at its tip, just a dead end that quietly drinks in whatever the blood capillaries can\'t take: excess tissue fluid, large proteins, and (here in the gut specifically) absorbed dietary fat. Once fluid enters, there\'s no going back out the way it came -- it can only move onward, deeper into the network.',
    desc: 'Fig. 11-1: "Lymphatic capillaries (lacteals) filled with Berlin blue in the villi of the intestine of a rat. (Redrawn after Ranvier.)" Maximow & Bloom, 1957, p. 252.'
  },
  {
    id: 'intro_f2', title: 'Fig. 11-2: Vital Injection, Rabbit Mesentery', img: 'assets/intro/fig2_vital_injection.jpg',
    story: 'From thousands of blind-ended lacteals, the fluid flows into larger collecting vessels -- and here you can see them running right alongside an artery and a vein, as a completely separate, third network. Dye injected into the lymphatics (dark) stays out of the blood vessels (pale) and vice versa: two parallel plumbing systems traveling together through the same tissue, never mixing.',
    desc: 'Fig. 11-2: "Vital injection of lymphatic vessels with alpha-azurine F.G. and of the blood vessels with colloidal mercuric sulfide. Mesentery of rabbit. About 20x." Maximow & Bloom, 1957, p. 253.'
  },
  {
    id: 'intro_f3', title: 'Fig. 11-3: Liver, Periportal Lymphatic', img: 'assets/intro/fig3_liver_periportal_lymphatic.jpg',
    story: 'That parallel network threads through every organ in the body. Here, inside the liver, a lymphatic vessel sits shoulder to shoulder with a branch of the hepatic artery, the portal vein, and a bile duct -- all bundled together at the same junction. Wherever blood flows and fluid leaks out, a lymphatic vessel is positioned nearby to pick up the overflow.',
    desc: 'Fig. 11-3: "Section of periportal area of a human liver. 480x." Maximow & Bloom, 1957, p. 254.'
  },
  {
    id: 'intro_f4', title: 'Fig. 11-4: Jugular Lymph Node Section', img: 'assets/intro/fig4_jugular_lymph_node_section.jpg',
    story: 'Before lymph is allowed back into the bloodstream, it has to pass through a checkpoint: a lymph node. Afferent vessels pierce the capsule at many points all over the node\'s surface -- lymph can get in almost anywhere -- but there is only one way out, a single hilus where the (far fewer) efferent vessels leave. Everything that enters gets funneled past the immune tissue packed into the cortex and medulla before it\'s allowed to exit.',
    desc: 'Fig. 11-4: "Section through small jugular lymph node of man." Capsule, nodules, medullary cords, sinuses, trabeculae, and hilus labeled. (Redrawn and slightly modified from Sobotta.) Maximow & Bloom, 1957, p. 255.'
  },
  {
    id: 'intro_f5', title: 'Fig. 11-5: Lymph Node Cortex (Dog)', img: 'assets/intro/fig5_lymph_node_cortex_dog.jpg',
    story: 'This is the first stop inside the node: the cortex, packed densely with lymphocytes clustered into nodules. Think of it as a guard post -- lymph fluid percolates slowly through this tissue, and any lymphocyte here that recognizes something dangerous in that fluid can begin multiplying on the spot (the pale "lymphocytopoietic center" is exactly that: a nodule actively manufacturing more immune cells in response).',
    desc: 'Fig. 11-5: "Portion of cortex of lymph node of a dog. Hematoxylin-eosin-azure stain. 187x." Maximow & Bloom, 1957, p. 256.'
  },
  {
    id: 'intro_f6', title: 'Fig. 11-6: Lymph Node Medulla (Dog)', img: 'assets/intro/fig6_lymph_node_medulla_dog.jpg',
    story: 'Past the cortex, the tissue reorganizes into cord-like strands -- the medulla -- separated by wide, open medullary sinuses. The dense screening of the cortex gives way here to broad channels built for one job: gathering the now-filtered lymph from every direction and funneling it toward a single exit.',
    desc: 'Fig. 11-6: "Portion of medulla of a dog\'s lymph node. Hematoxylin-eosin-azure stain. 187x." Maximow & Bloom, 1957, p. 257.'
  },
  {
    id: 'intro_f7', title: 'Fig. 11-7: Lymph Node Diagram', img: 'assets/intro/fig7_lymph_node_diagram.jpg',
    story: 'This diagram lays out the whole circuit at once: afferent vessels (a) entering all over the convex surface, one-way valves keeping the flow moving in a single direction, lymph working inward through cortical sinuses (Sr) and medullary sinuses (Sm), and finally leaving through efferent vessels (e) at the hilus. Every lymph node in the body repeats this exact circuit -- and most lymph passes through several nodes in series before it ever reaches a vein.',
    desc: 'Fig. 11-7: "Diagram of lymph node." Afferent/efferent vessels with valves and direction of lymph flow, cortical tissue, capsule, medullary cords, sinuses, and trabeculae. Maximow & Bloom, 1957, p. 258.'
  },
  {
    id: 'intro_f9', title: 'Fig. 11-9: Lymphatic Capillary Bud Growth', img: 'assets/intro/fig9_lymphatic_capillary_bud_tadpole.jpg',
    story: 'Step back from the adult anatomy for a moment: how does any of this get built? Watched live in a frog tadpole over three days, a single lymphatic capillary visibly buds and extends outward, stage by stage -- the same basic growth process that laid down the entire network you\'ve just toured, vessel by vessel, during development.',
    desc: 'Fig. 11-9: "Successive stages (1-4) during three days of growth of bud of a lymphatic capillary of frog tadpole. 180x. (Redrawn after E. R. Clark.)" Maximow & Bloom, 1957, Ch. 11 (Histogenesis).'
  },
  {
    id: 'intro_f10', title: 'Fig. 11-10: Lymph Node Primordium (Human Embryo)', img: 'assets/intro/fig10_lymph_node_primordium_embryo.jpg',
    story: 'And here is a lymph node itself under construction. In a 37mm human embryo, mesenchyme cells have invaded the hollow interior of a primary lymph sac and are carving it up into cavernous spaces with partitions -- while small lymphocytes and free macrophages already begin to colonize the unstructured tissue. Keep dividing those spaces and organizing those cells, and this becomes the cortex and medulla you saw fully formed in Figs. 11-4 through 11-7.',
    desc: 'Fig. 11-10: "Primordium of lymph node in the wall of cervical lymph sac of a human embryo of 37 mm. Lumen of the sac is divided into cavernous spaces by partitions of mesenchyme. Eosin-azure stain. About 400x." Maximow & Bloom, 1957, Ch. 11 (Histogenesis).'
  }
];

let introGalleryLoaded = false;
function initIntroGallery() {
  if (introGalleryLoaded) return;
  const gallery = document.getElementById('intro-figures-gallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  introFigures.forEach(fig => {
    const card = document.createElement('div');
    card.className = 'figure-thumb-card';
    card.innerHTML = `
      <div class="figure-thumb-img">
        <img src="${fig.img}" alt="${fig.title}" loading="lazy">
      </div>
      <div class="figure-thumb-info">
        <div class="figure-thumb-title">${fig.title}</div>
        <div class="figure-thumb-story">${fig.story}</div>
        <div class="figure-thumb-desc">${fig.desc}</div>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(fig.title, fig.img, `${fig.story} — ${fig.desc}`));
    gallery.appendChild(card);
  });
  introGalleryLoaded = true;
}

// Split Slider Controller
function initSplitSlider() {
  const container = document.getElementById('split-slider-container');
  const topLayer = document.getElementById('split-top-layer');
  const handle = document.getElementById('split-handle');
  if (!container || !topLayer || !handle) return;

  let isDragging = false;

  const setDivider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    topLayer.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setDivider(e.clientX);
  });
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) setDivider(e.clientX);
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setDivider(e.touches[0].clientX);
  });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging) setDivider(e.touches[0].clientX);
  });
}

// Time-Lapse Scrubber Controller (Day 1 - Day 4)
function initScrubber() {
  const slider = document.getElementById('timeline-slider');
  const caption = document.getElementById('scrubber-caption');
  if (!slider || !caption) return;

  // Days 1-3 are illustrative (the paper shows images, not measured lengths,
  // for these days); only the Day 4 endpoint (~1 mm) is a value the paper
  // actually reports. See notes.md.
  const stages = [
    { day: 1, desc: 'Day 1 (illustrative): A single lead cell starts budding out from the parent vessel.' },
    { day: 2, desc: 'Day 2 (illustrative): The new stalk grows longer but still has few branches.' },
    { day: 3, desc: 'Day 3 (illustrative): Branching begins as the stalk extends further along the chemical gradient.' },
    { day: 4, desc: 'Day 4: Tube-shaped capillaries up to ~1 mm long — the paper\'s reported Day-4 endpoint.' }
  ];

  slider.addEventListener('input', (e) => {
    const idx = parseInt(e.target.value);
    caption.textContent = stages[idx].desc;
  });

  // T-cell Stepper (Paper 1)
  document.querySelectorAll('.step-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.step-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const stage = chip.dataset.stage;
      const descElem = document.getElementById('tcell-stage-desc');
      if (stage === '1') {
        descElem.textContent = 'Stage 1: T-cells flow through the blood vessels (crimson) and start sticking to the vessel wall.';
      } else if (stage === '2') {
        descElem.textContent = 'Stage 2: T-cells squeeze out of the vessel and crawl through the continuous gel barrier (amber) — not through pores, since there aren\'t any.';
      } else if (stage === '3') {
        descElem.textContent = 'Stage 3: T-cells enter the lymphatic vessels (green), where they\'re carried onward for drainage.';
      }
    });
  });
}

// Lightbox Deep Zoom Modal
let lightboxZoom = 1;
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const imgWrapper = document.getElementById('lightbox-wrapper');

  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
    lightboxZoom = 1;
    if (imgWrapper) imgWrapper.style.transform = `scale(1)`;
  });

  document.getElementById('lightbox-zoom-in')?.addEventListener('click', () => {
    lightboxZoom = Math.min(lightboxZoom + 0.3, 4);
    if (imgWrapper) imgWrapper.style.transform = `scale(${lightboxZoom})`;
  });

  document.getElementById('lightbox-zoom-out')?.addEventListener('click', () => {
    lightboxZoom = Math.max(lightboxZoom - 0.3, 0.6);
    if (imgWrapper) imgWrapper.style.transform = `scale(${lightboxZoom})`;
  });

  document.getElementById('lightbox-reset')?.addEventListener('click', () => {
    lightboxZoom = 1;
    if (imgWrapper) imgWrapper.style.transform = `scale(1)`;
  });
}

function openLightbox(title, imgSrc, desc) {
  const modal = document.getElementById('lightbox-modal');
  const titleElem = document.getElementById('lightbox-title');
  const imgElem = document.getElementById('lightbox-img');
  const descElem = document.getElementById('lightbox-desc');
  if (!modal || !imgElem) return;

  lightboxZoom = 1;
  document.getElementById('lightbox-wrapper').style.transform = `scale(1)`;
  titleElem.textContent = title;
  imgElem.src = imgSrc;
  descElem.textContent = desc;
  modal.style.display = 'flex';
}

// Glossary Drawer
function initGlossaryDrawer() {
  const drawer = document.getElementById('glossary-drawer');
  const openBtn = document.getElementById('btn-open-glossary');
  const closeBtn = document.getElementById('drawer-close');
  const searchInput = document.getElementById('glossary-search');

  openBtn?.addEventListener('click', () => drawer.classList.add('open'));
  closeBtn?.addEventListener('click', () => drawer.classList.remove('open'));

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderGlossaryDrawer(q);
  });
}

function renderGlossaryDrawer(query = '') {
  const list = document.getElementById('drawer-list');
  if (!list) return;

  list.innerHTML = '';
  const filtered = glossaryData.filter(t => 
    t.term.toLowerCase().includes(query) || 
    t.summary.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query)
  );

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'term-card';
    card.innerHTML = `
      <div class="term-title-row">
        <span class="term-name">${item.term}</span>
        <span class="term-category">${item.category}</span>
      </div>
      <div style="font-size: 0.75rem; color: var(--accent-gold); margin-bottom: 0.2rem;">${item.phonetic} • ${item.paper}</div>
      <div class="term-summary">${item.summary}</div>
      <div class="term-detail">${item.detail}</div>
    `;
    list.appendChild(card);
  });
}

// Paper Interrogation & Q&A Controller
let currentQACategory = 'all';

function initQAFilterTabs() {
  document.querySelectorAll('.qa-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qa-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPaperQA(currentPaperId, btn.dataset.cat);
      broadcastPresence(currentPaperId, btn.dataset.cat);
    });
  });
}

function renderPaperQA(paperId, category = 'all') {
  currentQACategory = category;
  const listEl = document.getElementById('paper-qa-list');
  if (!listEl) return;

  const doRender = (data) => {
    const questions = (data.paperQuestions && data.paperQuestions[paperId]) || [];
    listEl.innerHTML = '';

    const filtered = category === 'all' 
      ? questions 
      : questions.filter(q => q.category === category);

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="color: var(--text-muted); padding: 1.5rem; text-align: center;">No questions match this category.</div>';
      return;
    }

    filtered.forEach(item => {
      const qCard = document.createElement('div');
      qCard.className = 'qa-item-card';
      qCard.innerHTML = `
        <div class="qa-item-header">
          <div class="qa-item-meta">
            <span class="qa-category-badge">${item.category}</span>
          </div>
          <div class="qa-item-question">${item.q}</div>
        </div>
        <div class="qa-item-answer">${item.a}</div>
        ${item.citation ? `<div class="qa-item-citation">Source: ${item.citation}</div>` : ''}
      `;
      listEl.appendChild(qCard);
    });
  };

  if (evaluationData) {
    doRender(evaluationData);
  } else {
    fetch('assets/data/evaluation.json')
      .then(r => r.json())
      .then(data => {
        evaluationData = data;
        doRender(data);
      })
      .catch(err => console.error('Error loading QA data:', err));
  }
}

// Frontier Evaluation Data Loader & Renderer
let evaluationData = null;

function loadFrontierData() {
  if (evaluationData) {
    renderFrontierView(evaluationData);
    return;
  }
  fetch('assets/data/evaluation.json')
    .then(r => r.json())
    .then(data => {
      evaluationData = data;
      renderFrontierView(data);
    })
    .catch(err => console.error('Error loading evaluation data:', err));
}

function renderFrontierView(data) {
  // 1. Executive Overall Summary
  const execSummaryEl = document.getElementById('overall-exec-summary');
  if (execSummaryEl && data.overallEvaluation?.executiveSummary) {
    execSummaryEl.textContent = data.overallEvaluation.executiveSummary;
  }

  // 2. Scorecard Matrix Table
  const scorecardTbody = document.getElementById('scorecard-tbody');
  if (scorecardTbody && data.overallEvaluation?.scorecard) {
    scorecardTbody.innerHTML = '';
    data.overallEvaluation.scorecard.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="scorecard-dim-cell"><strong>${row.dimension}</strong></td>
        <td>${row.paper1}</td>
        <td>${row.paper2}</td>
        <td>${row.paper3}</td>
        <td>${row.paper4}</td>
      `;
      scorecardTbody.appendChild(tr);
    });
  }

  // 3. Historical Evolution Timeline Track
  const timelineEl = document.getElementById('timeline-container');
  if (timelineEl && data.timeline) {
    timelineEl.innerHTML = '';
    data.timeline.forEach(item => {
      const card = document.createElement('div');
      card.className = 'timeline-card';
      card.innerHTML = `
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-paper-title">${item.title}</div>
        <div style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 700; margin-bottom: 0.2rem;">${item.paper} • ${item.badge}</div>
        <div class="timeline-scale">Scale: ${item.scale}</div>
        <div class="timeline-milestone">${item.milestone}</div>
        <div class="timeline-limitation"><strong>Constraint:</strong> ${item.limitation}</div>
      `;
      timelineEl.appendChild(card);
    });
  }

  // 4. Macro vs Micro Bioengineering Trade-Offs
  const gainedList = document.getElementById('tradeoffs-gained-list');
  const sacrificedList = document.getElementById('tradeoffs-sacrificed-list');
  if (gainedList && data.overallEvaluation?.macroVsMicroTradeoffs?.gained) {
    gainedList.innerHTML = '';
    data.overallEvaluation.macroVsMicroTradeoffs.gained.forEach(g => {
      const li = document.createElement('li');
      li.textContent = g;
      gainedList.appendChild(li);
    });
  }
  if (sacrificedList && data.overallEvaluation?.macroVsMicroTradeoffs?.sacrificed) {
    sacrificedList.innerHTML = '';
    data.overallEvaluation.macroVsMicroTradeoffs.sacrificed.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      sacrificedList.appendChild(li);
    });
  }

  // 5. The Proposed Frontier: 5 Predictions
  const predsEl = document.getElementById('predictions-container');
  if (predsEl && data.frontierPredictions) {
    predsEl.innerHTML = '';
    data.frontierPredictions.forEach(pred => {
      const predCard = document.createElement('div');
      predCard.className = 'prediction-card';
      predCard.innerHTML = `
        <div class="prediction-title">${pred.title}</div>
        <div class="prediction-summary">${pred.summary}</div>
        <div class="prediction-detail">${pred.detail}</div>
      `;
      predsEl.appendChild(predCard);
    });
  }
}

// ============================================================================
// Presenter Mode & Presence Beacon
//
// No user accounts: a single shared "what is the presenter showing" state
// lives in a tiny backend (presence/presence_server.py). Anyone can read it;
// only someone who enters the presenter passphrase can write it. Students
// always keep independent browsing -- the beacon only offers a jump, it
// never forces navigation.
// ============================================================================

// Presenter side: visit the site with ?present=1 to unlock. The passphrase
// is asked once per browser session (sessionStorage) and is never shown to
// students -- it's just a shared classroom secret, not a login system.
function initPresenterMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('present') !== '1') return;

  let token = sessionStorage.getItem('presenterToken');
  if (!token) {
    token = window.prompt('Presenter passphrase:');
    if (!token) return;
    sessionStorage.setItem('presenterToken', token);
  }

  presenterToken = token;
  presenterModeActive = true;

  const indicator = document.getElementById('presenter-mode-indicator');
  if (indicator) indicator.style.display = 'inline-block';

  const pushBtn = document.getElementById('btn-push-everyone');
  if (pushBtn) {
    pushBtn.style.display = 'inline-flex';
    pushBtn.addEventListener('click', pushPresenterJump);
  }

  const refreshBtn = document.getElementById('btn-refresh-everyone');
  if (refreshBtn) {
    refreshBtn.style.display = 'inline-flex';
    refreshBtn.addEventListener('click', () => {
      if (!window.confirm('Hard-reload every connected student\'s page in 5 seconds? Use this after deploying a new version, or if something looks broken.')) return;
      pushPresenterRefresh();
    });
  }
}

// Fire-and-forget: post the presenter's current view so students' beacons
// can pick it up. Silently does nothing if presenter mode isn't active, the
// presence service isn't reachable, or the token is wrong (e.g. typo) --
// never interrupts the presenter's own navigation.
function broadcastPresence(paperId, category) {
  if (!presenterModeActive || !presenterToken) return;
  fetch('api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: presenterToken,
      paper: paperId,
      category: category || 'all',
      label: paperLabels[paperId] || paperId
    })
  }).catch(() => { /* presence service unreachable -- ignore */ });
}

// Presenter action: explicitly push the presenter's current screen to every
// connected student, who will auto-navigate (after a brief toast) instead of
// just seeing a dismissible beacon. Separate from the passive per-navigation
// broadcastPresence() above -- this only fires on a deliberate button click.
function pushPresenterJump() {
  if (!presenterModeActive || !presenterToken) return;
  fetch('api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: presenterToken,
      paper: currentPaperId,
      category: currentQACategory || 'all',
      label: paperLabels[currentPaperId] || currentPaperId,
      forceJump: true
    })
  }).catch(() => { /* presence service unreachable -- ignore */ });
}

// Presenter action: hard-reload every connected student's browser (picking
// up newly-deployed JS/CSS/HTML, or clearing any stuck client-side state),
// landing them back on the presenter's current screen via a "goto" URL param
// consumed on the next page load. See initPresenterMode()'s confirm() dialog
// -- this is more disruptive than pushPresenterJump() above, so it's gated.
function pushPresenterRefresh() {
  if (!presenterModeActive || !presenterToken) return;
  fetch('api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: presenterToken,
      paper: currentPaperId,
      category: currentQACategory || 'all',
      label: paperLabels[currentPaperId] || currentPaperId,
      forceRefresh: true
    })
  }).catch(() => { /* presence service unreachable -- ignore */ });
}

// Student side: poll for the presenter's current view. Normally this just
// shows an unobtrusive, dismissible "Jump there" beacon -- browsing stays
// independent. If the presenter explicitly pushes (a new jumpId arrives),
// this browser shows a brief toast and then auto-navigates.
function initPresenceBeacon() {
  const beacon = document.getElementById('presenter-beacon');
  const textEl = document.getElementById('presenter-beacon-text');
  const jumpBtn = document.getElementById('presenter-beacon-jump');
  const dismissBtn = document.getElementById('presenter-beacon-dismiss');
  const toast = document.getElementById('jump-toast');
  const toastTextEl = document.getElementById('jump-toast-text');
  if (!beacon || !textEl || !jumpBtn || !dismissBtn) return;

  let latestState = null;
  let lastSeenJumpId = null;    // null = baseline not yet set; first poll just syncs, never force-jumps
  let lastSeenRefreshId = null; // same baseline pattern for forced hard-reloads

  const doForcedJump = (state) => {
    lastSeenPresenceTs = state.ts; // also suppress the passive beacon for this same update
    beacon.style.display = 'none';

    if (toast && toastTextEl) {
      toastTextEl.textContent = `Presenter is moving you to: ${state.label || paperLabels[state.paper] || state.paper}`;
      toast.style.display = 'flex';
    }

    setTimeout(() => {
      setActiveTab(state.paper);
      if (state.category && state.category !== 'all') {
        const filterBtn = document.querySelector(`.qa-filter-btn[data-cat="${state.category}"]`);
        if (filterBtn) filterBtn.click();
      }
      setTimeout(() => { if (toast) toast.style.display = 'none'; }, 1200);
    }, 900);
  };

  // Hard-reload this tab 5 seconds after the presenter clicks "Refresh
  // Everyone," landing back on the presenter's current screen via a "goto"
  // URL param that the next page load reads (see DOMContentLoaded below).
  const doForcedRefresh = (state) => {
    lastSeenPresenceTs = state.ts;
    beacon.style.display = 'none';

    let remaining = 5;
    const setCountdownText = () => {
      if (toastTextEl) toastTextEl.textContent = `Presenter is refreshing this page in ${remaining}s to: ${state.label || paperLabels[state.paper] || state.paper}`;
    };
    if (toast) { setCountdownText(); toast.style.display = 'flex'; }

    const countdown = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) setCountdownText();
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      const url = new URL(window.location.href);
      url.searchParams.set('goto', state.paper);
      if (state.category && state.category !== 'all') {
        url.searchParams.set('gotoCategory', state.category);
      } else {
        url.searchParams.delete('gotoCategory');
      }
      window.location.href = url.toString(); // full navigation -- a real reload, picks up new JS/CSS/HTML
    }, 5000);
  };

  const poll = () => {
    fetch('api/state')
      .then(r => r.ok ? r.json() : null)
      .then(state => {
        if (!state || !state.paper || !state.ts) return;
        latestState = state;

        if (lastSeenRefreshId === null) {
          lastSeenRefreshId = state.refreshId || 0; // first poll: just record the baseline, never reload
        } else if (!presenterModeActive && (state.refreshId || 0) > lastSeenRefreshId) {
          lastSeenRefreshId = state.refreshId;
          doForcedRefresh(state);
          return;
        }

        if (lastSeenJumpId === null) {
          lastSeenJumpId = state.jumpId || 0; // first poll: just record the baseline, never jump
        } else if (!presenterModeActive && (state.jumpId || 0) > lastSeenJumpId) {
          lastSeenJumpId = state.jumpId;
          doForcedJump(state);
          return;
        }

        if (state.ts <= lastSeenPresenceTs) return; // nothing new
        if (state.ts <= beaconDismissedTs) return;   // student already dismissed this exact update
        if (presenterModeActive) return;             // the presenter doesn't need their own beacon
        if (state.paper === currentPaperId) return;   // already here

        textEl.textContent = `Presenter is viewing: ${state.label || paperLabels[state.paper] || state.paper}`;
        beacon.style.display = 'flex';
      })
      .catch(() => { /* presence service unreachable -- stay silent, independent browsing is unaffected */ });
  };

  jumpBtn.addEventListener('click', () => {
    if (!latestState || !latestState.paper) return;
    lastSeenPresenceTs = latestState.ts;
    beacon.style.display = 'none';
    setActiveTab(latestState.paper);
    if (latestState.category && latestState.category !== 'all') {
      const filterBtn = document.querySelector(`.qa-filter-btn[data-cat="${latestState.category}"]`);
      if (filterBtn) filterBtn.click();
    }
  });

  dismissBtn.addEventListener('click', () => {
    if (latestState) beaconDismissedTs = latestState.ts;
    beacon.style.display = 'none';
  });

  poll();
  setInterval(poll, 4000);
}

// ===================== Presentation Mode (Slide Deck) =====================
let presentationSlides = [];
let currentSlideIndex = 0;
let presentationInitialized = false;

function initPresentationDeck() {
  if (!presentationInitialized) {
    presentationSlides = Array.from(document.querySelectorAll('#slide-stage .slide'));

    document.getElementById('slide-prev')?.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    document.getElementById('slide-next')?.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
    document.getElementById('btn-print-pdf')?.addEventListener('click', () => window.print());

    document.addEventListener('keydown', (e) => {
      if (currentPaperId !== 'presentation') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goToSlide(currentSlideIndex + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goToSlide(currentSlideIndex - 1); }
    });

    presentationInitialized = true;
  }
  renderSlide();
}

function goToSlide(index) {
  const clamped = Math.max(0, Math.min(presentationSlides.length - 1, index));
  if (clamped === currentSlideIndex) return;
  currentSlideIndex = clamped;
  renderSlide();
}

function renderSlide() {
  if (presentationSlides.length === 0) return;

  presentationSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlideIndex);
  });

  const total = presentationSlides.length;
  const current = presentationSlides[currentSlideIndex];

  const counterEl = document.getElementById('slide-counter');
  if (counterEl) counterEl.textContent = `Slide ${currentSlideIndex + 1} / ${total}`;

  const labelEl = document.getElementById('slide-section-label');
  if (labelEl) labelEl.textContent = current.dataset.section || '';

  const progressEl = document.getElementById('slide-progress-fill');
  if (progressEl) progressEl.style.width = `${((currentSlideIndex + 1) / total) * 100}%`;

  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  if (prevBtn) prevBtn.disabled = (currentSlideIndex === 0);
  if (nextBtn) nextBtn.disabled = (currentSlideIndex === total - 1);
}
