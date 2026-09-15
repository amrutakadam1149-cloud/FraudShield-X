/* =========================================================
   FraudShield-X — Console Stylesheet
   Design language: security-ops console.
   Ink navy rail, paper surface, mono numerals for
   every ID / amount / score. Color = risk signal only.
========================================================= */

:root {
  --ink:        #0b1220;
  --ink-soft:   #1b2540;
  --paper:      #f7f8fb;
  --surface:    #ffffff;
  --line:       #dfe4ee;
  --line-soft:  #ebeef5;
  --text:       #0b1220;
  --text-mute:  #5b6478;
  --text-faint: #97a0b3;

  --accent:     #2e5aac;
  --accent-soft:#e8eefb;

  --fraud:      #dc2626;
  --fraud-soft: #fdecec;
  --suspicious: #d97706;
  --suspicious-soft: #fdf3e3;
  --safe:       #059669;
  --safe-soft:  #e7f6f0;

  --font-head: "Space Grotesk", "Inter", sans-serif;
  --font-body: "Inter", "Segoe UI", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --radius: 10px;
}

/* =========================================================
   APP SHELL — left rail + content
========================================================= */

.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--paper);
}

/* =========================================================
   RAIL (formerly header + nav)
========================================================= */

.app-header {
  position: sticky;
  top: 0;
  align-self: flex-start;

  width: 264px;
  min-width: 264px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  padding: 28px 22px;
  background: var(--ink);
  color: #eef1fa;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.app-header h1 {
  margin: 0;
  font-family: var(--font-head);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.app-header p {
  margin: 0;
  color: #97a3c4;
  font-size: 13px;
  line-height: 1.5;
}

.system-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;

  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);

  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #cdd6ee;
}

.online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.18);
}

/* =========================================================
   NAVIGATION
========================================================= */

.main-navigation {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 8px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 11px;

  padding: 11px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #b7c0dc;

  font-size: 13.5px;
  font-weight: 500;
  text-align: left;

  transition: background 0.15s ease, color 0.15s ease;
}

.nav-button span:first-child {
  font-size: 15px;
  width: 18px;
  text-align: center;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f2f4fb;
}

.nav-button.active {
  background: rgba(46, 90, 172, 0.35);
  color: #ffffff;
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.dashboard-page,
.investigation-page,
.network-page,
.attack-page {
  flex: 1;
  min-width: 0;
  padding: 34px 40px 60px;
  animation: pageFade 0.3s ease;
}

@keyframes pageFade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0;
  font-family: var(--font-head);
  font-size: 19px;
  font-weight: 700;
  color: var(--ink);
}

.section-heading p {
  margin: 5px 0 0;
  color: var(--text-mute);
  font-size: 13.5px;
}

/* =========================================================
   ERROR BANNER
========================================================= */

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 22px;
  padding: 12px 16px;

  background: var(--fraud-soft);
  border: 1px solid #f6c6c6;
  border-radius: var(--radius);

  color: #9f1c1c;
  font-size: 13.5px;
  font-weight: 500;
}

/* =========================================================
   STATS — ledger strip, not identical cards
========================================================= */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);

  margin-bottom: 26px;
}

.stat-card {
  padding: 20px 22px;
  border-right: 1px solid var(--line-soft);
  position: relative;
}

.stat-card:last-child {
  border-right: none;
}

.stat-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 3px;
  background: var(--text-faint);
}

.stat-card.total-card::before      { background: var(--accent); }
.stat-card.fraud-card::before      { background: var(--fraud); }
.stat-card.suspicious-card::before { background: var(--suspicious); }
.stat-card.safe-card::before       { background: var(--safe); }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-mute);
}

.stat-number {
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1;
}

.stat-description {
  font-size: 12px;
  color: var(--text-faint);
}

/* =========================================================
   CHARTS
========================================================= */

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 26px;
}

.dashboard-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px 24px;
}

.chart-card {
  min-height: 360px;
}

.chart-container {
  width: 100%;
  height: 270px;
}

.empty-chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 13.5px;
}

/* =========================================================
   ANALYTICS SUMMARY
========================================================= */

.analytics-summary {
  margin-bottom: 26px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.analytics-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
  background: var(--paper);
  border: 1px solid var(--line-soft);
  border-radius: 8px;
}

.analytics-item span {
  font-size: 12px;
  color: var(--text-mute);
  font-weight: 500;
}

.analytics-item strong {
  font-family: var(--font-mono);
  font-size: 19px;
  color: var(--ink);
}

/* =========================================================
   TRANSACTION FORM
========================================================= */

.transaction-form-card {
  margin-bottom: 26px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 6px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-mute);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.form-group input::placeholder {
  color: var(--text-faint);
  font-family: var(--font-mono);
}

.form-group input:focus,
.form-group select:focus {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.analyze-button {
  grid-column: 1 / -1;
  margin-top: 4px;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s ease, transform 0.1s ease;
}

.analyze-button:hover:not(:disabled) {
  background: var(--ink-soft);
}

.analyze-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================================
   FRAUD RESULT
========================================================= */

.fraud-result-card {
  margin-bottom: 26px;
  padding: 22px 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--text-faint);
  border-radius: var(--radius);
}

.fraud-result-card.status-fraud      { border-left-color: var(--fraud); }
.fraud-result-card.status-suspicious { border-left-color: var(--suspicious); }
.fraud-result-card.status-safe       { border-left-color: var(--safe); }

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line-soft);
}

.result-label {
  display: block;
  font-size: 12px;
  color: var(--text-mute);
  font-weight: 500;
  margin-bottom: 4px;
}

.result-header h2 {
  margin: 0;
  font-family: var(--font-head);
  font-size: 20px;
}

.risk-score-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.risk-score-box span {
  font-size: 11.5px;
  color: var(--text-mute);
}

.risk-score-box strong {
  font-family: var(--font-mono);
  font-size: 24px;
  color: var(--ink);
}

.result-status {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.risk-reasons h3 {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--text-mute);
  font-weight: 600;
}

.risk-reasons ul {
  margin: 0;
  padding-left: 18px;
  color: var(--text);
  font-size: 13.5px;
  line-height: 1.8;
}

/* =========================================================
   TABLES
========================================================= */

.recent-transactions {
  margin-bottom: 10px;
}

.transaction-heading {
  align-items: center;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  margin-top: 6px;
}

.transaction-table {
  min-width: 880px;
}

.transaction-table thead {
  background: var(--paper);
}

.transaction-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-mute);
  border-bottom: 1px solid var(--line);
}

.transaction-table td {
  padding: 13px 16px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text);
  border-bottom: 1px solid var(--line-soft);
}

.transaction-table tbody tr:last-child td {
  border-bottom: none;
}

.transaction-table tbody tr:hover {
  background: var(--paper);
}

/* =========================================================
   STATUS BADGES
========================================================= */

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
}

.status-fraud      { color: #9f1c1c; background: var(--fraud-soft); }
.status-suspicious { color: #92590a; background: var(--suspicious-soft); }
.status-safe       { color: #036b4c; background: var(--safe-soft); }

/* =========================================================
   BUTTONS
========================================================= */

.secondary-button {
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.secondary-button:hover:not(:disabled) {
  background: var(--paper);
  border-color: #c7cfdf;
}

.secondary-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================================
   LOADING / EMPTY
========================================================= */

.loading-state,
.empty-state {
  padding: 46px 20px;
  text-align: center;
  color: var(--text-faint);
  font-size: 13.5px;
}

/* =========================================================
   INVESTIGATION PAGE
========================================================= */

.search-card {
  margin-bottom: 22px;
}

.search-input-row {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.search-input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  font-family: var(--font-mono);
  font-size: 13.5px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.search-input:focus {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.filter-select {
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  font-size: 13.5px;
  color: var(--text);
}

.view-button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.view-button:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-soft);
}

.details-card {
  margin-top: 22px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.close-button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-mute);
}

.close-button:hover {
  color: var(--text);
  background: var(--paper);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.detail-item {
  padding: 16px 18px;
  background: var(--paper);
  border: 1px solid var(--line-soft);
  border-radius: 8px;
}

.detail-item span {
  display: block;
  margin-bottom: 8px;
  font-size: 11.5px;
  color: var(--text-mute);
  font-weight: 500;
}

.detail-item strong {
  display: block;
  font-family: var(--font-mono);
  font-size: 15px;
  color: var(--ink);
  word-break: break-word;
}

.detail-item.reasons-item {
  grid-column: 1 / -1;
}

.detail-item.reasons-item ul {
  margin: 0;
  padding-left: 18px;
  font-family: var(--font-body);
  font-size: 13.5px;
  color: var(--text);
  line-height: 1.8;
}

/* =========================================================
   FRAUD NETWORKS PAGE
========================================================= */

.network-graph-card {
  margin-bottom: 26px;
  min-height: 320px;
}

.network-graph {
  position: relative;
  min-height: 260px;
  border-radius: 8px;
  background-image:
    linear-gradient(90deg, var(--line-soft) 1px, transparent 1px),
    linear-gradient(var(--line-soft) 1px, transparent 1px);
  background-size: 34px 34px;
  overflow: auto;
  padding: 20px;
}

.network-empty {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 13.5px;
}

.network-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  margin: 5px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.network-node.user     { color: #3949ab; background: #eef0fd; border-color: #c5cbf5; }
.network-node.device   { color: #0369a1; background: #e6f4fd; border-color: #b7e0f7; }
.network-node.merchant { color: #036b4c; background: var(--safe-soft); border-color: #b7e6d3; }
.network-node.fraud    { color: #9f1c1c; background: var(--fraud-soft); border-color: #f2b8b8; }

/* =========================================================
   RELATIONSHIP GRAPH (SVG) — FraudNetworks page
========================================================= */

.network-graph-svg-wrap {
  width: 100%;
}

.network-graph-svg {
  width: 100%;
  display: block;
  background-image:
    linear-gradient(90deg, var(--line-soft) 1px, transparent 1px),
    linear-gradient(var(--line-soft) 1px, transparent 1px);
  background-size: 34px 34px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
}

.network-edge {
  stroke: #c7cfdf;
  stroke-width: 1.4;
}

.network-edge.fraud {
  stroke: var(--fraud);
  stroke-width: 2;
}

.network-graph-node {
  cursor: pointer;
}

.network-node-circle {
  stroke-width: 2;
  transition: r 0.12s ease;
}

.network-graph-node:hover .network-node-circle {
  r: 19;
}

.network-node-circle.user     { fill: #eef0fd; stroke: #7c86e0; }
.network-node-circle.device   { fill: #e6f4fd; stroke: #52a9dd; }
.network-node-circle.merchant { fill: var(--safe-soft); stroke: #4cb78a; }

.network-node-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--text-mute);
}

.network-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-mute);
}

.network-legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid;
}

.legend-dot.user     { background: #eef0fd; border-color: #7c86e0; }
.legend-dot.device   { background: #e6f4fd; border-color: #52a9dd; }
.legend-dot.merchant { background: var(--safe-soft); border-color: #4cb78a; }

.legend-line {
  display: inline-block;
  width: 18px;
  height: 2px;
  background: var(--fraud);
}

/* =========================================================
   ATTACK PREDICTION PAGE
========================================================= */

.attack-dashboard {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 26px;
}

.attack-card {
  position: relative;
  padding: 20px 22px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.attack-card::before {
  content: "";
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 3px;
  background: var(--accent);
}

.attack-card.danger::before  { background: var(--fraud); }
.attack-card.warning::before { background: var(--suspicious); }

.attack-card h3 {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-mute);
}

.attack-number {
  margin-top: 12px;
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 600;
  color: var(--ink);
}

.attack-card p {
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--text-faint);
}

.risk-meter-card {
  margin-bottom: 26px;
}

.risk-meter {
  width: 100%;
  height: 10px;
  background: var(--line-soft);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 14px;
}

.risk-meter-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--safe), var(--suspicious), var(--fraud));
  transition: width 0.5s ease;
}

.risk-meter-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-faint);
}

.attack-events-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.attack-events-card h2 {
  margin: 0 0 4px;
  font-family: var(--font-head);
  font-size: 16px;
  color: var(--ink);
}

.attack-events-card > p {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: var(--text-mute);
}

.attack-event {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line-soft);
}

.attack-event:last-child {
  border-bottom: none;
}

.attack-event-info strong {
  display: block;
  font-size: 13.5px;
  color: var(--text);
}

.attack-event-info span {
  display: block;
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-faint);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1150px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .charts-grid { grid-template-columns: 1fr; }
  .analytics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .details-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .attack-dashboard { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .attack-events-grid { grid-template-columns: 1fr; }
}

@media (max-width: 860px) {
  .app-container { flex-direction: column; }

  .app-header {
    position: static;
    width: 100%;
    min-width: 0;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .app-header p { display: none; }

  .main-navigation {
    flex-direction: row;
    overflow-x: auto;
    margin-top: 0;
  }

  .nav-button {
    white-space: nowrap;
  }

  .dashboard-page,
  .investigation-page,
  .network-page,
  .attack-page {
    padding: 24px 18px 44px;
  }
}

@media (max-width: 560px) {
  .stats-grid { grid-template-columns: 1fr; }
  .stat-card { border-right: none; border-bottom: 1px solid var(--line-soft); }
  .stat-card:last-child { border-bottom: none; }
  .analytics-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .details-grid { grid-template-columns: 1fr; }
  .attack-dashboard { grid-template-columns: 1fr; }
  .search-input-row { flex-direction: column; }
  .result-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
/* =========================================================
   FRAUDSHIELD-X
   SHARED PROFESSIONAL DESIGN SYSTEM
   Used by Dashboard, Investigation, Networks & Prediction
   ========================================================= */

/* ---------------------------------------------------------
   PAGE CONTAINER
   --------------------------------------------------------- */

.attack-prediction-page,
.investigation-page,
.fraud-networks-page,
.dashboard-page {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 32px;
}


/* ---------------------------------------------------------
   COMMON PAGE HEADER
   --------------------------------------------------------- */

.dashboard-intro {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 28px;
}

.page-kicker {
    margin-bottom: 8px;
    color: #2563eb;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.dashboard-intro h1 {
    margin: 0 0 10px;
    color: #0f172a;
    font-size: 36px;
    line-height: 1.15;
    font-weight: 800;
}

.dashboard-intro p {
    max-width: 780px;
    margin: 0;
    color: #64748b;
    font-size: 15px;
    line-height: 1.6;
}


/* ---------------------------------------------------------
   COMMON BUTTON
   --------------------------------------------------------- */

.refresh-button,
.primary-button,
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    min-height: 42px;
    padding: 0 17px;

    border: 1px solid #2563eb;
    border-radius: 10px;

    background: #2563eb;
    color: #ffffff;

    font-size: 13px;
    font-weight: 700;

    box-shadow: 0 5px 14px rgba(37, 99, 235, 0.18);

    transition:
        background 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.refresh-button:hover,
.primary-button:hover,
.btn-primary:hover {
    background: #1d4ed8;
    box-shadow: 0 7px 18px rgba(37, 99, 235, 0.25);
    transform: translateY(-1px);
}


/* ---------------------------------------------------------
   COMMON CARD
   --------------------------------------------------------- */

.analysis-card,
.dashboard-card,
.investigation-card,
.network-card,
.chart-card,
.panel-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 7px 24px rgba(15, 23, 42, 0.055);
}


/* ---------------------------------------------------------
   COMMON SECTION HEADER
   --------------------------------------------------------- */

.section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
}

.section-header h2 {
    margin: 0 0 7px;
    color: #0f172a;
    font-size: 21px;
    line-height: 1.3;
    font-weight: 800;
}

.section-header p {
    margin: 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.55;
}


/* ---------------------------------------------------------
   STAT GRID
   --------------------------------------------------------- */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 24px;
}

.stat-card {
    position: relative;
    overflow: hidden;

    min-height: 135px;
    padding: 21px 22px;

    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 15px;

    box-shadow: 0 7px 24px rgba(15, 23, 42, 0.055);
}

.stat-card::before {
    content: "";

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    width: 4px;
}

.stat-fraud::before {
    background: #ef4444;
}

.stat-suspicious::before {
    background: #f59e0b;
}

.stat-warning::before {
    background: #f97316;
}

.stat-info::before {
    background: #2563eb;
}

.stat-label {
    margin-bottom: 8px;

    color: #64748b;
    font-size: 12px;
    font-weight: 700;
}

.stat-value {
    margin-bottom: 7px;

    color: #0f172a;
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
}

.stat-subtitle {
    color: #94a3b8;
    font-size: 12px;
}


/* ---------------------------------------------------------
   ML CARD
   --------------------------------------------------------- */

.attack-prediction-page .analysis-card {
    padding: 26px;
    margin-bottom: 24px;
}

.ml-badge {
    display: inline-flex;
    align-items: center;

    padding: 7px 12px;

    border: 1px solid #bfdbfe;
    border-radius: 999px;

    background: #eff6ff;
    color: #2563eb;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
}

.ml-overview-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
}

.ml-metric {
    padding: 18px;

    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.ml-metric span {
    display: block;
    margin-bottom: 8px;

    color: #64748b;
    font-size: 12px;
    font-weight: 700;
}

.ml-metric strong {
    display: block;

    color: #0f172a;
    font-size: 25px;
    font-weight: 800;
}


/* ---------------------------------------------------------
   PROGRESS BAR
   --------------------------------------------------------- */

.ml-progress-section {
    margin-top: 23px;
}

.progress-label {
    display: flex;
    justify-content: space-between;

    margin-bottom: 8px;

    color: #475569;
    font-size: 12px;
    font-weight: 700;
}

.progress-bar {
    width: 100%;
    height: 9px;

    overflow: hidden;

    background: #e2e8f0;
    border-radius: 999px;
}

.progress-fill {
    height: 100%;

    background: #2563eb;
    border-radius: 999px;

    transition: width 0.5s ease;
}


/* ---------------------------------------------------------
   ATTACK CARD
   --------------------------------------------------------- */

.attack-card {
    border-top: 4px solid #2563eb !important;
}

.attack-score-container {
    display: flex;
    align-items: baseline;
    gap: 7px;

    margin: 8px 0 18px;
}

.attack-score {
    font-size: 58px;
    line-height: 1;
    font-weight: 900;
}

.attack-score-label {
    color: #94a3b8;
    font-size: 17px;
    font-weight: 700;
}

.attack-level {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 7px 13px;

    border-radius: 999px;

    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.7px;
}

.attack-critical {
    color: #dc2626;
    background: #fef2f2;
}

.attack-moderate {
    color: #d97706;
    background: #fffbeb;
}

.attack-low {
    color: #16a34a;
    background: #f0fdf4;
}

.attack-progress {
    width: 100%;
    height: 12px;

    overflow: hidden;

    background: #e2e8f0;
    border-radius: 999px;
}

.attack-progress-fill {
    height: 100%;

    border-radius: 999px;

    transition: width 0.5s ease;
}

.attack-progress-fill.attack-critical {
    background: #ef4444;
}

.attack-progress-fill.attack-moderate {
    background: #f59e0b;
}

.attack-progress-fill.attack-low {
    background: #22c55e;
}


/* ---------------------------------------------------------
   SIGNAL CARDS
   --------------------------------------------------------- */

.signal-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;

    margin-top: 22px;
}

.signal-grid > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 15px 17px;

    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
}

.signal-grid span {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
}

.signal-grid strong {
    color: #0f172a;
    font-size: 15px;
    font-weight: 800;
}


/* ---------------------------------------------------------
   COMMON TABLE
   --------------------------------------------------------- */

.risk-table-wrapper,
.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.risk-table,
.data-table {
    width: 100%;
    min-width: 700px;

    border-collapse: collapse;
}

.risk-table th,
.data-table th {
    padding: 13px 14px;

    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;

    color: #64748b;

    text-align: left;

    font-size: 11px;
    font-weight: 800;

    text-transform: uppercase;
    letter-spacing: 0.45px;
}

.risk-table td,
.data-table td {
    padding: 14px;

    border-bottom: 1px solid #eef2f7;

    color: #475569;

    font-size: 13px;
}

.risk-table tbody tr:hover,
.data-table tbody tr:hover {
    background: #f8fafc;
}

.risk-table td strong,
.data-table td strong {
    color: #0f172a;
}


/* ---------------------------------------------------------
   STATUS BADGES
   --------------------------------------------------------- */

.status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 5px 10px;

    border-radius: 999px;

    font-size: 10px;
    font-weight: 800;
}

.status-fraud {
    color: #dc2626;
    background: #fef2f2;
}

.status-suspicious {
    color: #d97706;
    background: #fffbeb;
}

.status-safe {
    color: #16a34a;
    background: #f0fdf4;
}


/* ---------------------------------------------------------
   RISK PILLS
   --------------------------------------------------------- */

.risk-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 45px;
    padding: 5px 9px;

    border-radius: 999px;

    font-size: 11px;
    font-weight: 800;
}

.risk-danger {
    color: #dc2626;
    background: #fef2f2;
}

.risk-warning {
    color: #d97706;
    background: #fffbeb;
}

.risk-safe {
    color: #16a34a;
    background: #f0fdf4;
}


/* ---------------------------------------------------------
   VELOCITY CARDS
   --------------------------------------------------------- */

.velocity-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

.velocity-card {
    display: flex;
    align-items: center;
    gap: 14px;

    padding: 17px;

    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.velocity-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 18px rgba(15, 23, 42, 0.08);
}

.velocity-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;
    flex-shrink: 0;

    border-radius: 10px;

    background: #fff7ed;
    color: #f97316;

    font-size: 19px;
}

.velocity-card strong {
    display: block;
    margin-bottom: 4px;

    color: #0f172a;
    font-size: 13px;
}

.velocity-card p {
    margin: 0 0 3px;

    color: #64748b;
    font-size: 12px;
}

.velocity-card small {
    color: #ef4444;
    font-size: 11px;
    font-weight: 700;
}


/* ---------------------------------------------------------
   EMPTY STATE
   --------------------------------------------------------- */

.empty-state {
    padding: 35px 20px;

    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;

    color: #94a3b8;

    text-align: center;

    font-size: 13px;
}


/* =========================================================
   INVESTIGATION PAGE COMMON STYLES
   ========================================================= */

.investigation-page .analysis-card,
.investigation-page .investigation-card {
    padding: 24px;
    margin-bottom: 22px;
}

.investigation-page input,
.investigation-page select {
    min-height: 42px;
    padding: 0 12px;

    border: 1px solid #cbd5e1;
    border-radius: 9px;

    background: #ffffff;
    color: #334155;

    outline: none;

    font-size: 13px;

    transition: border 0.2s ease, box-shadow 0.2s ease;
}

.investigation-page input:focus,
.investigation-page select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
}


/* =========================================================
   FRAUD NETWORKS PAGE
   ========================================================= */

.fraud-networks-page .analysis-card,
.fraud-networks-page .network-card {
    padding: 24px;
    margin-bottom: 22px;
}

.network-card {
    overflow: hidden;
}

.network-node {
    transition: transform 0.2s ease;
}

.network-node:hover {
    transform: scale(1.03);
}


/* =========================================================
   COMMON CARD HOVER
   ========================================================= */

.dashboard-card,
.investigation-card,
.network-card,
.chart-card,
.panel-card {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.dashboard-card:hover,
.investigation-card:hover,
.network-card:hover,
.chart-card:hover,
.panel-card:hover {
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.075);
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1100px) {

    .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ml-overview-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .velocity-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}


@media (max-width: 760px) {

    .attack-prediction-page,
    .investigation-page,
    .fraud-networks-page,
    .dashboard-page {
        padding: 20px 14px;
    }

    .dashboard-intro {
        flex-direction: column;
        align-items: flex-start;
    }

    .dashboard-intro h1 {
        font-size: 29px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .ml-overview-grid {
        grid-template-columns: 1fr;
    }

    .signal-grid {
        grid-template-columns: 1fr;
    }

    .velocity-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
    }

    .attack-prediction-page .analysis-card {
        padding: 18px;
    }

    .attack-score {
        font-size: 48px;
    }
}
/* =========================================================
   FRAUDSHIELD-X - INVESTIGATION PAGE
   ========================================================= */

.investigation-page {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 32px;
    color: #14213d;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 24px;
}

.page-header h1 {
    margin: 4px 0 8px;
    font-size: 32px;
    font-weight: 800;
    color: #10213f;
}

.page-header p {
    margin: 0;
    color: #64748b;
    font-size: 15px;
    line-height: 1.6;
}

.page-kicker {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #2563eb;
    text-transform: uppercase;
}


/* =========================================================
   BUTTONS
   ========================================================= */

.primary-button,
.secondary-button,
.view-button,
.close-button {
    border: none;
    border-radius: 10px;
    font-weight: 700;
    transition: 0.2s ease;
}

.primary-button {
    padding: 12px 18px;
    background: #2563eb;
    color: white;
    box-shadow: 0 5px 15px rgba(37, 99, 235, 0.20);
}

.primary-button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
}

.secondary-button {
    padding: 11px 18px;
    background: #e8eef8;
    color: #1e3a5f;
}

.secondary-button:hover {
    background: #dce5f3;
}

.view-button {
    padding: 8px 13px;
    background: #eff6ff;
    color: #2563eb;
}

.view-button:hover {
    background: #dbeafe;
}

.close-button {
    padding: 9px 14px;
    background: #f1f5f9;
    color: #334155;
}

.close-button:hover {
    background: #e2e8f0;
}


/* =========================================================
   SEARCH / FILTER
   ========================================================= */

.investigation-toolbar {
    display: flex;
    align-items: center;
    gap: 14px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 18px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.search-box {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 46px;
    padding: 0 14px;
    background: #f8fafc;
    border: 1px solid #dbe3ef;
    border-radius: 10px;
}

.search-box span {
    font-size: 22px;
    color: #64748b;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #172033;
    font-size: 14px;
}

.search-box input::placeholder {
    color: #94a3b8;
}

.investigation-toolbar select {
    height: 46px;
    min-width: 160px;
    padding: 0 12px;
    border: 1px solid #dbe3ef;
    border-radius: 10px;
    background: white;
    color: #334155;
    outline: none;
    font-weight: 600;
}


/* =========================================================
   SUMMARY CARDS
   ========================================================= */

.investigation-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 22px;
}

.investigation-summary > div {
    min-height: 105px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 22px;
    background: white;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #2563eb;
    border-radius: 14px;
    box-shadow: 0 7px 20px rgba(15, 23, 42, 0.06);
}

.investigation-summary > div:nth-child(2) {
    border-left-color: #ef4444;
}

.investigation-summary > div:nth-child(3) {
    border-left-color: #f59e0b;
}

.investigation-summary strong {
    display: block;
    font-size: 30px;
    line-height: 1;
    color: #0f172a;
    margin-bottom: 8px;
}

.investigation-summary span {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
}


/* =========================================================
   TRANSACTION QUEUE
   ========================================================= */

.investigation-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
    overflow: hidden;
}

.section-heading {
    padding: 22px 24px;
    border-bottom: 1px solid #e5eaf1;
}

.section-heading h2 {
    margin: 0 0 6px;
    color: #10213f;
    font-size: 21px;
    font-weight: 800;
}

.section-heading p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}


/* =========================================================
   TABLE
   ========================================================= */

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.investigation-table {
    width: 100%;
    min-width: 1050px;
    border-collapse: collapse;
}

.investigation-table th {
    padding: 15px 16px;
    text-align: left;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    color: #475569;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.investigation-table td {
    padding: 16px;
    border-bottom: 1px solid #edf1f6;
    color: #172033;
    font-size: 14px;
    white-space: nowrap;
}

.investigation-table tbody tr {
    transition: background 0.15s ease;
}

.investigation-table tbody tr:hover {
    background: #f8fbff;
}

.transaction-id {
    color: #2563eb;
    font-family: Consolas, monospace;
    font-weight: 700;
}

.ml-value {
    font-weight: 800;
    color: #7c3aed;
}


/* =========================================================
   STATUS / RISK
   ========================================================= */

.status-badge,
.risk-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 82px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.3px;
}

.status-fraud,
.risk-high {
    background: #fee2e2;
    color: #b91c1c;
}

.status-suspicious,
.risk-medium {
    background: #fef3c7;
    color: #b45309;
}

.status-safe,
.risk-low {
    background: #dcfce7;
    color: #15803d;
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.empty-state {
    padding: 60px 20px;
    text-align: center;
}

.empty-icon {
    font-size: 42px;
    margin-bottom: 10px;
}

.empty-state h3 {
    margin: 0 0 7px;
    color: #1e293b;
}

.empty-state p {
    margin: 0;
    color: #64748b;
}


/* =========================================================
   INVESTIGATION MODAL
   ========================================================= */

.investigation-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px;
    background: rgba(15, 23, 42, 0.62);
    backdrop-filter: blur(5px);
}

.investigation-modal {
    width: min(1100px, 100%);
    max-height: 92vh;
    overflow-y: auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(15, 23, 42, 0.30);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 25px;
    border-bottom: 1px solid #e5eaf1;
}

.modal-header h2 {
    margin: 5px 0 5px;
    font-size: 25px;
    color: #10213f;
}

.modal-header p {
    margin: 0;
    color: #64748b;
    font-family: Consolas, monospace;
    font-size: 12px;
}


/* =========================================================
   RISK HERO
   ========================================================= */

.risk-hero {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 20px 25px;
    background: #f8fafc;
    border-bottom: 1px solid #e5eaf1;
}

.risk-hero > div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.risk-hero span {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
}

.risk-hero strong {
    font-size: 25px;
    color: #0f172a;
}

.risk-hero .status-fraud {
    color: #b91c1c;
    background: transparent;
    padding: 0;
    justify-content: flex-start;
}


/* =========================================================
   TRANSACTION DETAILS
   ========================================================= */

.transaction-detail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    margin: 22px 25px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #e2e8f0;
}

.transaction-detail-grid > div {
    min-width: 0;
    padding: 16px;
    background: white;
}

.transaction-detail-grid span {
    display: block;
    margin-bottom: 6px;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

.transaction-detail-grid strong {
    display: block;
    overflow-wrap: anywhere;
    color: #172033;
    font-size: 14px;
}


/* =========================================================
   RISK ANALYSIS
   ========================================================= */

.risk-analysis {
    margin: 22px 25px;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
}

.risk-analysis .section-heading {
    background: #f8fafc;
}

.risk-analysis-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
}

.analysis-card {
    padding: 18px;
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    background: white;
}

.analysis-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 13px;
}

.analysis-card-header span {
    color: #475569;
    font-size: 13px;
    font-weight: 700;
}

.analysis-card-header strong {
    font-size: 22px;
    color: #172033;
}

.progress-track {
    width: 100%;
    height: 9px;
    overflow: hidden;
    border-radius: 99px;
    background: #e9eef5;
}

.progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s ease;
}

.rule-progress {
    background: #ef4444;
}

.ml-progress {
    background: #7c3aed;
}

.analysis-label {
    margin-top: 9px;
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
}


/* =========================================================
   FINAL DECISION
   ========================================================= */

.final-decision {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 0 20px 20px;
    padding: 18px;
    border-radius: 13px;
    background: #f8fafc;
}

.final-decision > div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.final-decision span {
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
}

.final-decision strong {
    font-size: 18px;
}

.final-decision .status-fraud {
    padding: 0;
    background: transparent;
    justify-content: flex-start;
}


/* =========================================================
   DETECTION ANALYSIS
   ========================================================= */

.detection-analysis {
    margin: 22px 25px;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
}

.reason-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.reason-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 15px;
    border: 1px solid #fde68a;
    border-radius: 10px;
    background: #fffbeb;
}

.reason-item span {
    flex-shrink: 0;
}

.reason-item strong {
    color: #713f12;
    font-size: 13px;
}

.reason-item.ml-reason {
    border-color: #ddd6fe;
    background: #f5f3ff;
}

.reason-item.ml-reason strong {
    color: #5b21b6;
}


/* =========================================================
   ML ASSESSMENT
   ========================================================= */

.ml-model-assessment {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 22px 25px;
    padding: 18px;
    border: 1px solid #ddd6fe;
    border-radius: 14px;
    background: #f5f3ff;
}

.ml-model-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #ede9fe;
    font-size: 24px;
}

.ml-model-assessment h3 {
    margin: 0 0 5px;
    color: #4c1d95;
    font-size: 16px;
}

.ml-model-assessment p {
    margin: 0;
    color: #6d5b8c;
    font-size: 13px;
    line-height: 1.5;
}


/* =========================================================
   MODAL FOOTER
   ========================================================= */

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px 25px;
    border-top: 1px solid #e5eaf1;
}


/* =========================================================
   RESPONSIVE DESIGN
   ========================================================= */

@media (max-width: 900px) {

    .investigation-page {
        padding: 20px;
    }

    .page-header {
        flex-direction: column;
    }

    .investigation-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .investigation-toolbar select {
        width: 100%;
    }

    .investigation-summary {
        grid-template-columns: 1fr;
    }

    .risk-hero {
        grid-template-columns: 1fr;
    }

    .transaction-detail-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .risk-analysis-grid {
        grid-template-columns: 1fr;
    }

    .final-decision {
        grid-template-columns: 1fr;
    }
}


@media (max-width: 600px) {

    .investigation-page {
        padding: 14px;
    }

    .page-header h1 {
        font-size: 25px;
    }

    .section-heading {
        padding: 18px;
    }

    .transaction-detail-grid {
        grid-template-columns: 1fr;
        margin: 18px;
    }

    .risk-analysis,
    .detection-analysis {
        margin: 18px;
    }

    .ml-model-assessment {
        margin: 18px;
    }

    .modal-header {
        flex-direction: column;
        padding: 18px;
    }

    .investigation-overlay {
        padding: 10px;
    }

    .investigation-modal {
        max-height: 96vh;
        border-radius: 14px;
    }

}
/* =========================================================
   FRAUDSHIELD-X FINAL LAYOUT FIX
   Fix old sidebar/header CSS overriding new dashboard
   ========================================================= */

.app-shell {
    min-height: 100vh;
    width: 100%;
    background: #f4f7fb;
    overflow-x: hidden;
}


/* =========================================================
   TOP HEADER
   ========================================================= */

.app-header {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;

    width: 100% !important;
    height: 76px !important;

    background: linear-gradient(
        135deg,
        #0f172a,
        #172554
    ) !important;

    color: white;

    z-index: 1000;

    box-shadow:
        0 4px 18px rgba(15, 23, 42, 0.15);
}


.header-content {
    width: 100%;
    max-width: 1500px;
    height: 100%;

    margin: 0 auto;
    padding: 0 32px;

    display: flex;
    align-items: center;
    justify-content: space-between;
}


.brand-section {
    display: flex;
    align-items: center;
    gap: 13px;
}


.brand-icon {
    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: rgba(255, 255, 255, 0.12);

    font-size: 22px;
}


.brand-section h2 {
    margin: 0;

    color: white;

    font-size: 21px;
    font-weight: 800;
}


.brand-section span {
    display: block;

    margin-top: 2px;

    color: #cbd5e1;

    font-size: 11px;
    font-weight: 600;
}


.header-status {
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 8px 13px;

    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;

    background: rgba(255,255,255,0.07);

    color: #e2e8f0;

    font-size: 12px;
    font-weight: 700;
}


/* =========================================================
   LIVE DOT
   ========================================================= */

.live-dot {
    width: 8px;
    height: 8px;

    display: inline-block;

    border-radius: 50%;

    background: #22c55e;

    box-shadow:
        0 0 0 4px rgba(34,197,94,0.12);
}


/* =========================================================
   NAVIGATION
   ========================================================= */

.main-navigation {
    position: relative !important;

    top: auto !important;
    left: auto !important;
    right: auto !important;

    width: 100% !important;
    height: 58px;

    background: white !important;

    border-bottom: 1px solid #e2e8f0;

    z-index: 900;

    box-shadow:
        0 2px 8px rgba(15,23,42,0.04);
}


.navigation-inner {
    width: 100%;
    max-width: 1500px;

    height: 100%;

    margin: 0 auto;
    padding: 0 32px;

    display: flex;
    align-items: stretch;
    gap: 6px;
}


.nav-item {
    position: relative;

    border: none !important;

    background: transparent !important;

    color: #64748b;

    padding: 0 18px;

    font-size: 13px;
    font-weight: 700;

    transition: 0.2s ease;
}


.nav-item:hover {
    color: #2563eb;
    background: #f8fafc !important;
}


.nav-item.active {
    color: #2563eb !important;
}


.nav-item.active::after {
    content: "";

    position: absolute;

    left: 14px;
    right: 14px;
    bottom: 0;

    height: 3px;

    border-radius: 3px 3px 0 0;

    background: #2563eb;
}


/* =========================================================
   MAIN CONTENT
   ========================================================= */

main {
    width: 100% !important;

    margin: 0 !important;
    padding: 0 !important;

    min-height: calc(100vh - 134px);
}


/* =========================================================
   DASHBOARD
   ========================================================= */

.dashboard-page {
    width: 100%;
    max-width: 1500px;

    margin: 0 auto;

    padding: 30px 32px 50px;
}


.dashboard-intro {
    display: flex;

    justify-content: space-between;
    align-items: flex-start;

    gap: 20px;

    margin-bottom: 24px;
}


.dashboard-intro h1 {
    margin: 5px 0 7px;

    color: #10213f;

    font-size: 31px;
    font-weight: 800;
}


.dashboard-intro p {
    margin: 0;

    color: #64748b;

    font-size: 14px;

    line-height: 1.6;
}


.dashboard-live {
    display: flex;
    align-items: center;
    gap: 9px;

    padding: 9px 14px;

    border: 1px solid #bbf7d0;
    border-radius: 999px;

    background: #f0fdf4;

    color: #15803d;

    font-size: 12px;
    font-weight: 800;

    white-space: nowrap;
}


/* =========================================================
   DASHBOARD ACTIONS
   ========================================================= */

.dashboard-actions {
    display: flex;

    justify-content: flex-end;

    gap: 10px;

    margin-bottom: 20px;
}


/* =========================================================
   STAT CARDS
   ========================================================= */

.stats-grid {
    display: grid;

    grid-template-columns:
        repeat(6, minmax(0, 1fr));

    gap: 14px;

    margin-bottom: 22px;
}


.stat-card {
    position: relative;

    min-height: 125px;

    display: flex;
    align-items: center;

    gap: 13px;

    padding: 18px;

    background: white;

    border: 1px solid #e2e8f0;

    border-left: 5px solid #2563eb;

    border-radius: 14px;

    box-shadow:
        0 7px 20px rgba(15,23,42,0.06);

    transition: 0.2s ease;
}


.stat-card:hover {
    transform: translateY(-2px);

    box-shadow:
        0 12px 26px rgba(15,23,42,0.09);
}


.stat-blue {
    border-left-color: #2563eb;
}


.stat-red {
    border-left-color: #ef4444;
}


.stat-orange {
    border-left-color: #f59e0b;
}


.stat-green {
    border-left-color: #22c55e;
}


.stat-purple {
    border-left-color: #7c3aed;
}


.stat-dark {
    border-left-color: #334155;
}


.stat-icon {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: #f1f5f9;

    font-size: 20px;
}


.stat-card > div {
    min-width: 0;
}


.stat-card span:not(.stat-icon) {
    display: block;

    color: #64748b;

    font-size: 11px;
    font-weight: 700;

    line-height: 1.4;
}


.stat-card strong {
    display: block;

    margin-top: 7px;

    color: #0f172a;

    font-size: 25px;
    font-weight: 800;
}


/* =========================================================
   DASHBOARD GRID
   ========================================================= */

.dashboard-grid {
    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 20px;

    margin-bottom: 20px;
}


.dashboard-card {
    min-width: 0;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 17px;

    box-shadow:
        0 9px 26px rgba(15,23,42,0.06);

    overflow: hidden;
}


.card-heading {
    display: flex;

    justify-content: space-between;
    align-items: flex-start;

    gap: 15px;

    padding: 21px 22px;

    border-bottom: 1px solid #e5eaf1;
}


.card-heading h2 {
    margin: 0 0 5px;

    color: #10213f;

    font-size: 18px;
    font-weight: 800;
}


.card-heading p {
    margin: 0;

    color: #64748b;

    font-size: 12px;
    line-height: 1.5;
}


.chart-container {
    width: 100%;

    padding: 16px;

    min-height: 330px;
}


.empty-chart {
    height: 300px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #94a3b8;

    font-size: 14px;
}


/* =========================================================
   ML INTELLIGENCE
   ========================================================= */

.ml-overview-card {
    min-height: 390px;
}


.ml-dashboard-content {
    padding: 24px;
}


.ml-big-number {
    color: #7c3aed;

    font-size: 42px;
    font-weight: 900;
}


.ml-big-number span {
    display: block;

    margin-top: 4px;

    color: #64748b;

    font-size: 12px;
    font-weight: 600;
}


.ml-progress-wrapper {
    margin-top: 28px;
}


.ml-progress-header {
    display: flex;

    justify-content: space-between;

    margin-bottom: 9px;

    color: #475569;

    font-size: 12px;
    font-weight: 700;
}


.ml-progress-track {
    width: 100%;
    height: 10px;

    overflow: hidden;

    border-radius: 99px;

    background: #ede9fe;
}


.ml-progress-bar {
    height: 100%;

    border-radius: 99px;

    background: #7c3aed;

    transition: width 0.5s ease;
}


.ml-info-grid {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 12px;

    margin-top: 25px;
}


.ml-info-grid > div {
    padding: 16px;

    border: 1px solid #e2e8f0;

    border-radius: 12px;

    background: #f8fafc;
}


.ml-info-grid strong {
    display: block;

    color: #172033;

    font-size: 23px;
}


.ml-info-grid span {
    display: block;

    margin-top: 4px;

    color: #64748b;

    font-size: 11px;
}


/* =========================================================
   DASHBOARD TABLE
   ========================================================= */

.recent-card {
    margin-bottom: 20px;
}


.dashboard-table {
    min-width: 800px;

    width: 100%;

    border-collapse: collapse;
}


.dashboard-table th {
    padding: 14px 16px;

    background: #f8fafc;

    border-bottom: 1px solid #e2e8f0;

    color: #475569;

    font-size: 11px;
    font-weight: 800;

    text-align: left;

    text-transform: uppercase;
}


.dashboard-table td {
    padding: 14px 16px;

    border-bottom: 1px solid #edf1f6;

    color: #172033;

    font-size: 13px;

    white-space: nowrap;
}


.dashboard-table tbody tr:hover {
    background: #f8fbff;
}


.empty-table {
    padding: 40px !important;

    text-align: center;

    color: #94a3b8 !important;
}


/* =========================================================
   ERROR
   ========================================================= */

.error-banner {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    margin-bottom: 18px;

    padding: 13px 16px;

    border: 1px solid #fecaca;

    border-radius: 10px;

    background: #fef2f2;

    color: #b91c1c;

    font-size: 13px;
    font-weight: 700;
}


.error-banner button {
    border: none;

    border-radius: 7px;

    padding: 7px 12px;

    background: #dc2626;

    color: white;

    font-size: 12px;

    font-weight: 700;
}


/* =========================================================
   LOADING
   ========================================================= */

.loading-card {
    width: min(500px, calc(100% - 40px));

    margin: 100px auto;

    padding: 45px;

    text-align: center;

    background: white;

    border: 1px solid #e2e8f0;

    border-radius: 18px;

    box-shadow:
        0 10px 30px rgba(15,23,42,0.07);
}


.loading-spinner {
    font-size: 40px;

    color: #2563eb;

    animation: spin 1s linear infinite;
}


.loading-card h2 {
    margin: 12px 0 7px;

    color: #10213f;
}


.loading-card p {
    margin: 0;

    color: #64748b;

    font-size: 13px;
}


@keyframes spin {

    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }

}


/* =========================================================
   FORM MODAL
   ========================================================= */

.form-overlay {
    position: fixed;

    inset: 0;

    z-index: 9999;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 20px;

    background: rgba(15,23,42,0.62);

    backdrop-filter: blur(5px);
}


.transaction-form-modal {
    width: min(800px, 100%);

    max-height: 90vh;

    overflow-y: auto;

    background: white;

    border-radius: 18px;

    box-shadow:
        0 25px 80px rgba(15,23,42,0.30);
}


.transaction-form {
    padding: 24px;
}


.form-grid {
    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 16px;
}


.form-group {
    display: flex;

    flex-direction: column;

    gap: 7px;
}


.form-group label {
    color: #334155;

    font-size: 12px;

    font-weight: 800;
}


.form-group input,
.form-group select {
    width: 100%;

    height: 44px;

    padding: 0 12px;

    border: 1px solid #dbe3ef;

    border-radius: 9px;

    outline: none;

    background: #f8fafc;

    color: #172033;

    font-size: 13px;
}


.form-group input:focus,
.form-group select:focus {
    border-color: #2563eb;

    background: white;

    box-shadow:
        0 0 0 3px rgba(37,99,235,0.10);
}


.form-actions {
    display: flex;

    justify-content: flex-end;

    gap: 10px;

    margin-top: 24px;

    padding-top: 18px;

    border-top: 1px solid #e5eaf1;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1200px) {

    .stats-grid {
        grid-template-columns:
            repeat(3, minmax(0, 1fr));
    }

}


@media (max-width: 900px) {

    .header-content,
    .navigation-inner,
    .dashboard-page {
        padding-left: 20px;
        padding-right: 20px;
    }


    .dashboard-grid {
        grid-template-columns: 1fr;
    }


    .dashboard-intro {
        flex-direction: column;
    }


    .stats-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }


    .navigation-inner {
        overflow-x: auto;
    }


    .nav-item {
        flex-shrink: 0;
    }

}


@media (max-width: 600px) {

    .app-header {
        height: 68px !important;
    }


    .header-content {
        padding: 0 14px;
    }


    .brand-section span,
    .header-status {
        display: none;
    }


    .brand-section h2 {
        font-size: 18px;
    }


    .navigation-inner {
        padding: 0 10px;
    }


    .nav-item {
        padding: 0 12px;

        font-size: 11px;
    }


    .dashboard-page {
        padding: 20px 14px 35px;
    }


    .dashboard-intro h1 {
        font-size: 25px;
    }


    .stats-grid {
        grid-template-columns: 1fr;
    }


    .dashboard-actions {
        justify-content: stretch;
    }


    .dashboard-actions button {
        flex: 1;
    }


    .ml-info-grid {
        grid-template-columns: 1fr;
    }


    .form-grid {
        grid-template-columns: 1fr;
    }

}
/* =========================================================
   FRAUD NETWORKS - PROFESSIONAL UI
   ========================================================= */

.network-page {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 32px;
    background: #f4f7fb;
}

.network-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 28px;
}

.network-kicker {
    color: #2563eb;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.4px;
    margin-bottom: 8px;
}

.network-page-header h1 {
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 34px;
    font-weight: 800;
}

.network-page-header p {
    margin: 0;
    color: #64748b;
    font-size: 15px;
    line-height: 1.6;
}

.network-refresh-button,
.network-primary-button {
    border: 0;
    border-radius: 10px;
    padding: 12px 18px;
    background: #2563eb;
    color: white;
    font-weight: 700;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.18);
}

.network-refresh-button:hover,
.network-primary-button:hover {
    background: #1d4ed8;
}


/* STATS */

.network-stats-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.network-stat-card {
    min-height: 110px;
    background: white;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #2563eb;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.network-stat-card > div {
    min-width: 0;
}

.network-stat-card span:not(.network-stat-icon) {
    display: block;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 6px;
}

.network-stat-card strong {
    display: block;
    color: #0f172a;
    font-size: 27px;
    font-weight: 800;
}

.network-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #f1f5f9;
    display: grid;
    place-items: center;
    font-size: 21px;
    flex-shrink: 0;
}

.network-stat-blue {
    border-left-color: #2563eb;
}

.network-stat-purple {
    border-left-color: #7c3aed;
}

.network-stat-orange {
    border-left-color: #f59e0b;
}

.network-stat-green {
    border-left-color: #16a34a;
}

.network-stat-red {
    border-left-color: #ef4444;
}

.network-stat-yellow {
    border-left-color: #eab308;
}


/* SECTIONS */

.network-section-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 8px 26px rgba(15, 23, 42, 0.05);
}

.network-section-header {
    min-height: 92px;
    padding: 24px 28px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.network-section-header h2 {
    margin: 0 0 7px;
    color: #0f172a;
    font-size: 21px;
    font-weight: 800;
}

.network-section-header p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}

.network-count-badge {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
}


/* TABLE */

.network-table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.network-table {
    width: 100%;
    min-width: 1100px;
    border-collapse: collapse;
}

.network-table th {
    background: #f8fafc;
    color: #64748b;
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.6px;
    font-weight: 800;
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
}

.network-table td {
    color: #1e293b;
    padding: 16px 20px;
    border-bottom: 1px solid #eef2f7;
    font-size: 13px;
    vertical-align: middle;
}

.network-table tbody tr:hover {
    background: #f8fbff;
}

.network-table td strong {
    color: #0f172a;
}

.network-user-list,
.network-merchant-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.network-user-chip,
.network-merchant-chip {
    display: inline-flex;
    align-items: center;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 600;
}

.network-device-text {
    color: #475569;
    font-family: Consolas, monospace;
    font-size: 12px;
}

.network-time {
    color: #64748b;
    white-space: nowrap;
    font-size: 11px;
}


/* RISK */

.network-risk-high,
.network-risk-medium,
.network-risk-low {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    padding: 6px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
}

.network-risk-high {
    color: #b91c1c;
    background: #fee2e2;
}

.network-risk-medium {
    color: #b45309;
    background: #fef3c7;
}

.network-risk-low {
    color: #15803d;
    background: #dcfce7;
}


/* STATUS */

.network-status-fraud,
.network-status-suspicious,
.network-status-safe,
.network-fraud-badge,
.network-safe-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 800;
}

.network-status-fraud,
.network-fraud-badge {
    color: #b91c1c;
    background: #fee2e2;
}

.network-status-suspicious {
    color: #b45309;
    background: #fef3c7;
}

.network-status-safe,
.network-safe-badge {
    color: #15803d;
    background: #dcfce7;
}

.network-ml-value {
    color: #7c3aed;
    font-weight: 800;
}


/* MERCHANT CARDS */

.network-merchant-grid {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.network-merchant-card {
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    padding: 18px;
    background: #fbfdff;
}

.network-merchant-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.network-small-label {
    display: block;
    color: #94a3b8;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    margin-bottom: 5px;
}

.network-merchant-card h3 {
    margin: 0;
    color: #0f172a;
    font-size: 16px;
}

.network-merchant-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 20px;
}

.network-merchant-metrics div {
    padding: 10px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
}

.network-merchant-metrics strong {
    display: block;
    color: #0f172a;
    font-size: 17px;
}

.network-merchant-metrics span {
    display: block;
    color: #64748b;
    font-size: 10px;
    margin-top: 3px;
}


/* INFO */

.network-info-card {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 26px;
    background: linear-gradient(
        135deg,
        #eff6ff,
        #ffffff
    );
    border: 1px solid #bfdbfe;
    border-radius: 16px;
    margin-bottom: 30px;
}

.network-info-icon {
    width: 48px;
    height: 48px;
    border-radius: 13px;
    background: #dbeafe;
    display: grid;
    place-items: center;
    font-size: 23px;
    flex-shrink: 0;
}

.network-info-card h2 {
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 19px;
}

.network-info-card p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    line-height: 1.7;
}

.network-flow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 17px;
}

.network-flow span {
    background: white;
    border: 1px solid #dbeafe;
    border-radius: 8px;
    padding: 8px 11px;
    color: #1e3a8a;
    font-size: 12px;
    font-weight: 700;
}

.network-flow b {
    color: #64748b;
}


/* EMPTY / LOADING */

.network-empty {
    padding: 50px 24px;
    text-align: center;
    color: #64748b;
}

.network-empty > div {
    font-size: 32px;
    margin-bottom: 10px;
}

.network-empty h3 {
    margin: 0 0 6px;
    color: #334155;
}

.network-empty p {
    margin: 0;
}

.network-loading,
.network-error {
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.network-loading h2,
.network-error h2 {
    color: #0f172a;
    margin: 12px 0 8px;
}

.network-loading p,
.network-error p {
    color: #64748b;
    max-width: 500px;
}

.network-spinner {
    font-size: 42px;
    color: #2563eb;
    animation: network-spin 1s linear infinite;
}

.network-error-icon {
    font-size: 42px;
}

@keyframes network-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}


/* RESPONSIVE */

@media (max-width: 1200px) {

    .network-stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .network-merchant-grid {
        grid-template-columns: repeat(2, 1fr);
    }

}


@media (max-width: 800px) {

    .network-page {
        padding: 20px 14px;
    }

    .network-page-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .network-stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .network-section-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .network-merchant-grid {
        grid-template-columns: 1fr;
        padding: 16px;
    }

}


@media (max-width: 520px) {

    .network-stats-grid {
        grid-template-columns: 1fr;
    }

    .network-page-header h1 {
        font-size: 27px;
    }

    .network-stat-card {
        min-height: 90px;
    }

    .network-info-card {
        flex-direction: column;
    }

}
/* =========================================================
   FRAUD NETWORKS
   ========================================================= */

.network-page {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 32px;
    color: #14213d;
}

.network-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 26px;
}

.network-page-header h1 {
    margin: 6px 0 8px;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.7px;
}

.network-page-header p {
    margin: 0;
    color: #60708a;
    font-size: 15px;
}

.network-stats-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 22px;
}

.network-stat-card {
    min-height: 112px;
    background: #ffffff;
    border: 1px solid #e1e8f2;
    border-radius: 16px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 8px 24px rgba(15, 35, 70, 0.06);
    border-left: 5px solid #2563eb;
}

.network-stat-card.red {
    border-left-color: #ef4444;
}

.network-stat-card.orange {
    border-left-color: #f59e0b;
}

.network-stat-card.green {
    border-left-color: #16a34a;
}

.network-stat-card.purple {
    border-left-color: #7c3aed;
}

.network-stat-card.dark {
    border-left-color: #334155;
}

.network-stat-card.blue {
    border-left-color: #2563eb;
}

.network-stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.network-stat-card > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.network-stat-card span:not(.network-stat-icon) {
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
}

.network-stat-card strong {
    font-size: 26px;
    color: #0f172a;
}

.network-card {
    background: #ffffff;
    border: 1px solid #e1e8f2;
    border-radius: 18px;
    margin-bottom: 22px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(15, 35, 70, 0.06);
}

.network-section-header {
    min-height: 92px;
    padding: 22px 26px;
    border-bottom: 1px solid #e5ebf3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.network-section-header h2 {
    margin: 0 0 7px;
    font-size: 21px;
    font-weight: 800;
}

.network-section-header p {
    margin: 0;
    color: #60708a;
    font-size: 14px;
}

.network-count-badge {
    padding: 8px 13px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
}

.network-table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.network-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 850px;
}

.network-table th {
    padding: 14px 20px;
    background: #f7f9fc;
    border-bottom: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 11px;
    font-weight: 800;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.network-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #edf1f6;
    color: #172033;
    font-size: 14px;
    vertical-align: middle;
}

.network-table tbody tr {
    transition: background 0.2s ease;
}

.network-table tbody tr:hover {
    background: #f8fbff;
}

.network-table tbody tr:last-child td {
    border-bottom: none;
}

.linked-users {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.user-chip {
    display: inline-flex;
    padding: 5px 9px;
    border-radius: 7px;
    background: #eef4ff;
    color: #2854b8;
    font-size: 12px;
    font-weight: 700;
}

.fraud-count-badge,
.safe-count-badge {
    min-width: 28px;
    display: inline-flex;
    justify-content: center;
    padding: 5px 9px;
    border-radius: 7px;
    font-weight: 800;
}

.fraud-count-badge {
    background: #fee2e2;
    color: #b91c1c;
}

.safe-count-badge {
    background: #dcfce7;
    color: #15803d;
}

.network-empty {
    text-align: center;
    padding: 55px 20px;
}

.network-empty > span {
    font-size: 38px;
}

.network-empty h3 {
    margin: 12px 0 6px;
    font-size: 18px;
}

.network-empty p {
    margin: 0;
    color: #64748b;
}

/* GRAPH */

.network-legend {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.network-legend span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
}

.network-legend i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
}

.legend-user {
    background: #6478e8;
}

.legend-device {
    background: #38a6df;
}

.legend-merchant {
    background: #38b982;
}

.legend-fraud {
    background: #ef4444;
}

.legend-normal {
    background: #cbd5e1;
}

.network-graph-container {
    width: 100%;
    height: 680px;
    overflow: auto;
    background: #fbfdff;
}

.network-svg {
    width: 100%;
    min-width: 1000px;
    height: 680px;
    display: block;
}

.network-column-title {
    font-size: 15px;
    font-weight: 800;
    fill: #334155;
    letter-spacing: 1.5px;
}

.network-node-group {
    cursor: pointer;
}

.network-node-group:hover circle {
    filter: drop-shadow(
        0 5px 9px rgba(30, 64, 175, 0.25)
    );
}

.network-node-icon {
    font-size: 13px;
    font-weight: 900;
    fill: #334155;
}

.network-node-label {
    font-size: 11px;
    font-weight: 700;
    fill: #64748b;
}

.selected-node-card {
    border: 1px solid #bfdbfe;
}

.selected-node-grid {
    padding: 24px 26px;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 16px;
    align-items: stretch;
}

.selected-node-main {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
}

.selected-node-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #eaf2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.selected-node-type {
    font-size: 10px;
    font-weight: 800;
    color: #64748b;
    letter-spacing: 1px;
}

.selected-node-main h3 {
    margin: 4px 0 0;
    font-size: 18px;
}

.node-detail-item {
    padding: 17px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
}

.node-detail-item span {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
}

.node-detail-item strong {
    color: #0f172a;
    font-size: 23px;
}

.node-fraud-number {
    color: #dc2626 !important;
}

.relationship-badge {
    display: inline-flex;
    padding: 5px 9px;
    border-radius: 7px;
    background: #eef4ff;
    color: #3155a6;
    font-size: 10px;
    font-weight: 800;
}

.target-label {
    display: block;
    font-weight: 700;
}

.network-table td small {
    display: block;
    margin-top: 3px;
    color: #94a3b8;
    font-size: 11px;
}

.network-risk-high {
    background: #fee2e2;
    color: #b91c1c;
}

.network-risk-medium {
    background: #fef3c7;
    color: #b45309;
}

.network-risk-low {
    background: #dcfce7;
    color: #15803d;
}

.network-risk-high,
.network-risk-medium,
.network-risk-low {
    padding: 5px 9px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 800;
}

.network-loading-card,
.network-error-card {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 8px;
}

.network-loading-card h2,
.network-error-card h2 {
    margin: 8px 0 0;
}

.network-loading-card p,
.network-error-card p {
    color: #64748b;
    margin: 0 0 15px;
}

.network-spinner {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    animation: networkSpin 1s linear infinite;
}

.network-error-icon {
    font-size: 42px;
}

@keyframes networkSpin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* RESPONSIVE */

@media (max-width: 1200px) {
    .network-stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .selected-node-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .selected-node-main {
        grid-column: span 2;
    }
}

@media (max-width: 800px) {
    .network-page {
        padding: 20px 14px;
    }

    .network-page-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .network-page-header h1 {
        font-size: 26px;
    }

    .network-stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .network-section-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .network-graph-container {
        height: 580px;
    }

    .network-svg {
        height: 580px;
    }

    .selected-node-grid {
        grid-template-columns: 1fr;
    }

    .selected-node-main {
        grid-column: auto;
    }
}

@media (max-width: 520px) {
    .network-stats-grid {
        grid-template-columns: 1fr;
    }

    .network-stat-card {
        min-height: 95px;
    }
}
/* =========================================================
   FRAUDSHIELD-X DASHBOARD POLISH
   ========================================================= */

.dashboard-page {
    max-width: 1500px;
    margin: 0 auto;
    padding: 32px;
}

.dashboard-intro {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 24px;
}

.dashboard-intro h1 {
    margin: 6px 0 8px;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.7px;
    color: #14213d;
}

.dashboard-intro p {
    margin: 0;
    color: #64748b;
    font-size: 15px;
}

.page-kicker {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.4px;
    color: #2563eb;
}

.dashboard-live {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #15803d;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
}

.live-dot {
    width: 9px;
    height: 9px;
    display: inline-block;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 4px #dcfce7;
}

.dashboard-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 22px;
}

.primary-button,
.secondary-button,
.view-button {
    border: none;
    border-radius: 10px;
    padding: 10px 16px;
    font-weight: 700;
    transition: 0.2s ease;
}

.primary-button {
    background: #2563eb;
    color: white;
    box-shadow: 0 5px 14px rgba(37, 99, 235, 0.2);
}

.primary-button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
}

.secondary-button {
    background: #ffffff;
    color: #334155;
    border: 1px solid #dbe3ee;
}

.secondary-button:hover {
    background: #f8fafc;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 15px;
    margin-bottom: 22px;
}

.stat-card {
    min-height: 115px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #2563eb;
    border-radius: 15px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 13px;
    box-shadow: 0 8px 25px rgba(15, 35, 70, 0.06);
}

.stat-blue {
    border-left-color: #2563eb;
}

.stat-red {
    border-left-color: #ef4444;
}

.stat-orange {
    border-left-color: #f59e0b;
}

.stat-green {
    border-left-color: #16a34a;
}

.stat-purple {
    border-left-color: #7c3aed;
}

.stat-dark {
    border-left-color: #334155;
}

.stat-icon {
    width: 43px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border-radius: 12px;
    font-size: 20px;
    flex-shrink: 0;
}

.stat-card > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stat-card span:not(.stat-icon) {
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
}

.stat-card strong {
    color: #0f172a;
    font-size: 25px;
    font-weight: 800;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.dashboard-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 17px;
    overflow: hidden;
    box-shadow: 0 9px 28px rgba(15, 35, 70, 0.06);
}

.card-heading {
    padding: 21px 24px;
    border-bottom: 1px solid #e8edf4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.card-heading h2 {
    margin: 0 0 5px;
    color: #172033;
    font-size: 19px;
    font-weight: 800;
}

.card-heading p {
    margin: 0;
    color: #718096;
    font-size: 13px;
}

.chart-container {
    padding: 18px;
    min-height: 320px;
}

.empty-chart {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
}

.ml-overview-card {
    min-height: 360px;
}

.ml-dashboard-content {
    padding: 26px;
}

.ml-big-number {
    color: #7c3aed;
    font-size: 42px;
    font-weight: 850;
    line-height: 1;
    margin-bottom: 28px;
}

.ml-big-number span {
    display: block;
    margin-top: 8px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
}

.ml-progress-wrapper {
    margin-bottom: 25px;
}

.ml-progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #475569;
    font-size: 13px;
}

.ml-progress-header strong {
    color: #7c3aed;
}

.ml-progress-track {
    width: 100%;
    height: 10px;
    border-radius: 999px;
    background: #ede9fe;
    overflow: hidden;
}

.ml-progress-bar {
    height: 100%;
    border-radius: inherit;
    background: #7c3aed;
    transition: width 0.5s ease;
}

.ml-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.ml-info-grid > div {
    padding: 16px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.ml-info-grid strong {
    display: block;
    font-size: 23px;
    color: #172033;
}

.ml-info-grid span {
    display: block;
    margin-top: 4px;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
}

.recent-card {
    margin-bottom: 35px;
}

.view-button {
    background: #eff6ff;
    color: #2563eb;
}

.view-button:hover {
    background: #dbeafe;
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.dashboard-table {
    min-width: 800px;
}

.dashboard-table th {
    padding: 14px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    color: #64748b;
    text-align: left;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
}

.dashboard-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #edf1f6;
    color: #334155;
    font-size: 13px;
}

.dashboard-table tbody tr:hover {
    background: #f8fbff;
}

.status-badge,
.risk-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px 9px;
    border-radius: 7px;
    font-size: 10px;
    font-weight: 800;
}

.status-fraud,
.risk-high {
    background: #fee2e2;
    color: #b91c1c;
}

.status-suspicious,
.risk-medium {
    background: #fef3c7;
    color: #b45309;
}

.status-safe,
.risk-low {
    background: #dcfce7;
    color: #15803d;
}

.empty-table {
    padding: 35px !important;
    text-align: center;
    color: #94a3b8 !important;
}

.loading-card {
    min-height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.loading-card h2 {
    margin: 12px 0 6px;
}

.loading-card p {
    margin: 0;
    color: #64748b;
}

.loading-spinner {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
}

/* Dashboard responsive */

@media (max-width: 1250px) {
    .stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 850px) {
    .dashboard-page {
        padding: 20px 14px;
    }

    .dashboard-intro {
        align-items: flex-start;
        flex-direction: column;
    }

    .dashboard-intro h1 {
        font-size: 27px;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 520px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-actions {
        flex-direction: column;
    }

    .dashboard-actions button {
        width: 100%;
    }

    .ml-info-grid {
        grid-template-columns: 1fr;
    }
}
/* =========================================================
   FRAUD INVESTIGATION - FINAL PROFESSIONAL UI
   ========================================================= */

.investigation-page {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 32px;
}

.investigation-page .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 28px;
}

.investigation-page .page-header h1 {
    margin: 6px 0 8px;
    font-size: 34px;
    font-weight: 800;
    color: #14213d;
}

.investigation-page .page-header p {
    margin: 0;
    max-width: 720px;
    color: #64748b;
    font-size: 15px;
    line-height: 1.6;
}

/* Toolbar */

.investigation-toolbar {
    display: flex;
    gap: 14px;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    padding: 0 16px;
    border: 1px solid #dbe3ee;
    border-radius: 10px;
    background: #f8fafc;
}

.search-box span {
    font-size: 22px;
    color: #64748b;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #14213d;
    font-size: 14px;
}

.investigation-toolbar select {
    min-width: 160px;
    height: 48px;
    padding: 0 14px;
    border: 1px solid #dbe3ee;
    border-radius: 10px;
    background: #ffffff;
    color: #14213d;
    outline: none;
}

/* Summary */

.investigation-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 22px;
}

.investigation-summary > div {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
}

.investigation-summary strong {
    display: block;
    font-size: 28px;
    font-weight: 800;
    color: #14213d;
    margin-bottom: 5px;
}

.investigation-summary span {
    color: #64748b;
    font-size: 13px;
}

/* Main investigation card */

.investigation-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.investigation-card .section-heading {
    padding: 24px;
    border-bottom: 1px solid #e8edf4;
}

.section-heading h2 {
    margin: 0 0 6px;
    color: #14213d;
    font-size: 20px;
    font-weight: 800;
}

.section-heading p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
}

/* Table */

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.investigation-table {
    min-width: 1050px;
}

.investigation-table th {
    background: #f8fafc;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 15px 18px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.investigation-table td {
    padding: 17px 18px;
    color: #334155;
    font-size: 14px;
    border-bottom: 1px solid #eef2f7;
    white-space: nowrap;
}

.investigation-table tbody tr {
    transition: background 0.2s ease;
}

.investigation-table tbody tr:hover {
    background: #f8fbff;
}

.transaction-id {
    font-family: monospace;
    color: #2563eb;
    font-weight: 700;
}

.ml-value {
    font-weight: 700;
    color: #7c3aed;
}

/* Risk pills */

.risk-pill,
.status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 72px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
}

.risk-high {
    color: #b91c1c;
    background: #fee2e2;
}

.risk-medium {
    color: #b45309;
    background: #fef3c7;
}

.risk-low {
    color: #15803d;
    background: #dcfce7;
}

.status-fraud {
    color: #b91c1c;
    background: #fee2e2;
}

.status-suspicious {
    color: #b45309;
    background: #fef3c7;
}

.status-safe {
    color: #15803d;
    background: #dcfce7;
}

.view-button {
    border: none;
    border-radius: 8px;
    padding: 8px 13px;
    background: #2563eb;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    transition: 0.2s ease;
}

.view-button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
}

/* =========================================================
   INVESTIGATION MODAL
   ========================================================= */

.investigation-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.68);
    backdrop-filter: blur(5px);
}

.investigation-modal {
    width: min(1100px, 100%);
    max-height: 94vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.30);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 26px 30px;
    border-bottom: 1px solid #e5eaf1;
}

.modal-header h2 {
    margin: 5px 0 5px;
    font-size: 25px;
    color: #14213d;
}

.modal-header p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
    word-break: break-all;
}

.close-button {
    height: 40px;
    padding: 0 15px;
    border: 1px solid #dbe3ee;
    border-radius: 9px;
    background: #ffffff;
    color: #475569;
    font-weight: 700;
}

.close-button:hover {
    background: #f1f5f9;
}

/* Risk hero */

.risk-hero {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 22px 30px;
    background: #f8fafc;
}

.risk-hero > div {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
}

.risk-hero span {
    display: block;
    margin-bottom: 7px;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
}

.risk-hero strong {
    font-size: 21px;
    color: #14213d;
}

/* Transaction details */

.transaction-detail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #e2e8f0;
    margin: 0 30px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
}

.transaction-detail-grid > div {
    background: #ffffff;
    padding: 17px;
}

.transaction-detail-grid span {
    display: block;
    color: #64748b;
    font-size: 11px;
    margin-bottom: 7px;
    text-transform: uppercase;
    font-weight: 700;
}

.transaction-detail-grid strong {
    display: block;
    color: #14213d;
    font-size: 14px;
    word-break: break-word;
}

/* =========================================================
   RISK ANALYSIS
   ========================================================= */

.risk-analysis,
.detection-analysis {
    margin: 28px 30px 0;
    padding: 22px;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: #ffffff;
}

.risk-analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 20px;
}

.analysis-card {
    padding: 20px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
}

.analysis-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 14px;
}

.analysis-card-header span {
    color: #475569;
    font-size: 13px;
    font-weight: 700;
}

.analysis-card-header strong {
    color: #14213d;
    font-size: 22px;
}

.progress-track {
    width: 100%;
    height: 10px;
    overflow: hidden;
    border-radius: 999px;
    background: #e2e8f0;
}

.progress-fill {
    height: 100%;
    border-radius: inherit;
    transition: width 0.5s ease;
}

.rule-progress {
    background: #ef4444;
}

.ml-progress {
    background: #7c3aed;
}

.analysis-label {
    margin-top: 10px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #64748b;
}

/* Final decision */

.final-decision {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 16px;
}

.final-decision > div {
    padding: 18px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.final-decision span {
    display: block;
    color: #64748b;
    font-size: 12px;
    margin-bottom: 8px;
    font-weight: 600;
}

.final-decision strong {
    font-size: 18px;
}

/* Detection reasons */

.reason-list {
    display: grid;
    gap: 10px;
    margin-top: 18px;
}

.reason-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 15px;
    border-radius: 10px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #9a3412;
}

.reason-item span {
    font-size: 16px;
}

.reason-item strong {
    font-size: 13px;
}

.reason-item.ml-reason {
    background: #f5f3ff;
    border-color: #ddd6fe;
    color: #6d28d9;
}

/* ML assessment */

.ml-model-assessment {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 24px 30px 0;
    padding: 20px;
    border: 1px solid #ddd6fe;
    border-radius: 14px;
    background: #f5f3ff;
}

.ml-model-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #ede9fe;
    font-size: 23px;
}

.ml-model-assessment h3 {
    margin: 0 0 5px;
    color: #4c1d95;
    font-size: 16px;
}

.ml-model-assessment p {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.6;
}

/* Footer */

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 22px 30px;
    margin-top: 25px;
    border-top: 1px solid #e5eaf1;
}

.secondary-button {
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    padding: 10px 17px;
    background: #ffffff;
    color: #334155;
    font-weight: 700;
}

.secondary-button:hover {
    background: #f8fafc;
}

/* Empty state */

.empty-state {
    text-align: center;
    padding: 70px 20px;
}

.empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
}

.empty-state h3 {
    margin: 0 0 6px;
    color: #14213d;
}

.empty-state p {
    margin: 0;
    color: #64748b;
}

/* Responsive */

@media (max-width: 900px) {

    .investigation-page {
        padding: 20px;
    }

    .investigation-page .page-header {
        flex-direction: column;
    }

    .investigation-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .investigation-toolbar select {
        width: 100%;
    }

    .investigation-summary {
        grid-template-columns: 1fr;
    }

    .risk-hero {
        grid-template-columns: 1fr;
    }

    .transaction-detail-grid {
        grid-template-columns: 1fr 1fr;
    }

    .risk-analysis-grid {
        grid-template-columns: 1fr;
    }

}

@media (max-width: 600px) {

    .investigation-page {
        padding: 14px;
    }

    .investigation-page .page-header h1 {
        font-size: 27px;
    }

    .transaction-detail-grid {
        grid-template-columns: 1fr;
        margin: 0 16px;
    }

    .risk-analysis,
    .detection-analysis {
        margin-left: 16px;
        margin-right: 16px;
    }

    .ml-model-assessment {
        margin-left: 16px;
        margin-right: 16px;
    }

    .modal-header {
        padding: 20px;
    }

    .final-decision {
        grid-template-columns: 1fr;
    }

}