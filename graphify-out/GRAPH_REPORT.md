# Graph Report - .  (2026-06-04)

## Corpus Check
- Corpus is ~37,992 words - fits in a single context window. You may not need a graph.

## Summary
- 243 nodes · 289 edges · 31 communities (20 shown, 11 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Stock Research & Analysis|Stock Research & Analysis]]
- [[_COMMUNITY_Content & Markdown Rendering|Content & Markdown Rendering]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Layout & Navigation|Layout & Navigation]]
- [[_COMMUNITY_Speckit Configuration|Speckit Configuration]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_Speckit Skills & Agents|Speckit Skills & Agents]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Core UI Components|Core UI Components]]
- [[_COMMUNITY_Skills Lock|Skills Lock]]
- [[_COMMUNITY_Content Functions|Content Functions]]
- [[_COMMUNITY_Speckit Schema|Speckit Schema]]
- [[_COMMUNITY_OpenCode Config|OpenCode Config]]
- [[_COMMUNITY_Markdown Pages|Markdown Pages]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_OpenCode Plugin|OpenCode Plugin]]
- [[_COMMUNITY_Static Assets|Static Assets]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Brand Images|Brand Images]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_UI Icons|UI Icons]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Speckit Schema|Speckit Schema]]
- [[_COMMUNITY_OpenCode Plugin Package|OpenCode Plugin Package]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Frontend Design Skill|Frontend Design Skill]]
- [[_COMMUNITY_File Icon|File Icon]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Spec Super Agent` - 13 edges
3. `Spec Skill Catalog` - 10 edges
4. `BRPT Deep Research` - 8 edges
5. `MarkdownRenderer()` - 7 edges
6. `WIFI Deep Research` - 7 edges
7. `SUPA Deep Research` - 7 edges
8. `Smart Money Flow Analysis` - 7 edges
9. `getReportFiles()` - 6 edges
10. `RootLayout` - 6 edges

## Surprising Connections (you probably didn't know these)
- `InstallPrompt` --shares_data_with--> `PWA Manifest`  [INFERRED]
  src/components/install-prompt.tsx → public/manifest.json
- `speckit-planner Agent` --references--> `spec-graph Skill`  [INFERRED]
  .opencode/agent/speckit-planner.md → .speckit/skills/spec-graph.md
- `speckit-tdd-developer Agent` --references--> `Spec Skill Catalog`  [EXTRACTED]
  .opencode/agent/speckit-tdd-developer.md → .speckit/skills/catalog.md
- `speckit-planner Agent` --references--> `Spec Skill Catalog`  [EXTRACTED]
  .opencode/agent/speckit-planner.md → .speckit/skills/catalog.md
- `speckit-reviewer Agent` --references--> `Spec Skill Catalog`  [EXTRACTED]
  .opencode/agent/speckit-reviewer.md → .speckit/skills/catalog.md

## Hyperedges (group relationships)
- **PWA System** — service_worker, pwa_manifest, sw_registration, install_prompt [INFERRED 0.85]
- **Markdown Rendering Pipeline** — markdown_lib, markdown_renderer, report_page, deep_research_page [INFERRED 0.80]
- **Sidebar Navigation System** — sidebar_component, sidebar_context, navigation_lib, root_layout [INFERRED 0.85]
- **File Access Pattern** — getReportFiles, getDeepResearchFiles, getReportContent, getDeepResearchContent [INFERRED 0.85]
- **Speckit Skill Routing via Super Agent** — super_agent, skill_spec_test, skill_spec_docs, skill_spec_session, skill_spec_research, skill_spec_shape, skill_spec_plan [INFERRED 0.80]
- **Daily Stock Report Plan Artifacts** — daily_stock_report_prd, daily_stock_report_architecture, daily_stock_report_story, daily_stock_report_tdd_evidence [EXTRACTED 1.00]
- **Speckit Skill Workflow Phases** — spec-debug_skill, spec-graph_skill, spec-ship_skill, spec-review_skill, spec-tdd_skill, spec-context_skill [EXTRACTED 0.95]
- **Barito Empire Corporate Structure** — BRPT_company, BREN_company, TPIA_company, CUAN_company, Prajogo_Pangestu [EXTRACTED 1.00]
- **Smart Money Broker Flow Analysis Pattern** — RATU_deep-research, BRPT_deep-research, WIFI_deep-research, SUPA_deep-research, BUMI_deep-research [INFERRED 0.90]
- **Next.js Starter Template Static Assets** — public_vercel_svg, public_next_svg, public_globe_svg, public_window_svg [INFERRED 0.85]

## Communities (31 total, 11 thin omitted)

### Community 0 - "Stock Research & Analysis"
Cohesion: 0.11
Nodes (30): PT Arutmin Indonesia, Barito Renewables (BREN), PT Barito Pacific Tbk (BRPT), BRPT Deep Research, PT Bumi Resources Tbk (BUMI), BUMI Deep Research, Broker Net Position Analysis, Petrindo Jaya Kreasi (CUAN) (+22 more)

### Community 1 - "Content & Markdown Rendering"
Cohesion: 0.15
Nodes (18): Home(), colorizeStatusSymbols(), fixExternalLinks(), MarkdownRenderer(), wrapTables(), generateStaticParams(), PageProps, ReportPage() (+10 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.08
Nodes (21): dependencies, date-fns, gray-matter, lucide-react, next, react, react-dom, remark (+13 more)

### Community 3 - "Layout & Navigation"
Cohesion: 0.13
Nodes (15): jetbrains, metadata, RootLayout(), BeforeInstallPromptEvent, InstallPrompt(), ServiceWorkerRegistration(), SidebarContext, SidebarContextType (+7 more)

### Community 4 - "Speckit Configuration"
Cohesion: 0.13
Nodes (21): Speckit Config, Daily Stock Report Architecture, Daily Stock Report PRD, Daily Stock Report Story, Daily Stock Report TDD Evidence, Speckit Permissions Config, Agile Policy, Enterprise Safety Policy (+13 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "PWA Manifest"
Cohesion: 0.15
Nodes (12): background_color, categories, description, display, icons, lang, name, orientation (+4 more)

### Community 7 - "Speckit Skills & Agents"
Cohesion: 0.25
Nodes (11): Spec Skill Catalog, spec-context Skill, spec-debug Skill, spec-graph Skill, spec-review Skill, spec-ship Skill, spec-tdd Skill, speckit-docs Agent (+3 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @trieungoctam/speckit, @types/node, @types/react (+2 more)

### Community 9 - "Core UI Components"
Cohesion: 0.36
Nodes (9): InstallPrompt, NavItem Interface, Navigation Lib, PWA Manifest, RootLayout, Service Worker, Sidebar, SidebarProvider (+1 more)

### Community 10 - "Skills Lock"
Cohesion: 0.25
Nodes (7): computedHash, skillPath, source, sourceType, skills, frontend-design, version

### Community 11 - "Content Functions"
Cohesion: 0.53
Nodes (5): getDeepResearchContent, getDeepResearchFiles, getLatestReportFilename, getReportContent, getReportFiles

### Community 12 - "Speckit Schema"
Cohesion: 0.33
Nodes (5): required, selected_from, statuses, version, x-speckit-managed

### Community 13 - "OpenCode Config"
Cohesion: 0.33
Nodes (5): instructions, permission, bash, edit, $schema

### Community 14 - "Markdown Pages"
Cohesion: 0.67
Nodes (4): DeepResearchPage, Markdown Lib, MarkdownRenderer, ReportPage

### Community 15 - "Service Worker"
Cohesion: 0.50
Nodes (3): clone, STATIC_ASSETS, url

### Community 17 - "Static Assets"
Cohesion: 0.67
Nodes (3): Mr. Supri Spinach Mascot, Next.js Logo, Vercel Logo

## Knowledge Gaps
- **120 isolated node(s):** `version`, `source`, `sourceType`, `skillPath`, `computedHash` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Dependencies`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `Spec Super Agent` (e.g. with `Speckit Shape Workflow` and `Speckit TDD Run Workflow`) actually correct?**
  _`Spec Super Agent` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `version`, `source`, `sourceType` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Stock Research & Analysis` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Layout & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Speckit Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._