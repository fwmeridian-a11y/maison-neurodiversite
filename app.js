// =====================================================================
// Stockage local
// =====================================================================
const STORAGE_KEY = "nd_responses_v1";

// Code d'accès simple pour l'espace Synthèse (modifiable ici).
const SYNTHESE_PASSCODE = "neurodiv2026";
const SYNTHESE_AUTH_KEY = "nd_synthese_auth";

function loadResponses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveResponses(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addResponse(questionnaireId, answers) {
  const list = loadResponses();
  list.push({
    id: "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    questionnaire: questionnaireId,
    date: new Date().toISOString(),
    answers
  });
  saveResponses(list);
}

// =====================================================================
// Aides
// =====================================================================
function getQuestionnaire(id) {
  return QUESTIONNAIRES.find((q) => q.id === id);
}

// Retourne la liste plate des questions (avec colonnes supplémentaires
// pour les types select_other / checkbox)
function flattenQuestions(qDef) {
  const out = [];
  qDef.sections.forEach((section) => {
    section.questions.forEach((question) => {
      out.push({ ...question, sectionTitle: section.title });
    });
  });
  return out;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// =====================================================================
// Routing
// =====================================================================
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function navigate(hash) {
  window.location.hash = hash;
}

function render() {
  const hash = window.location.hash || "#/";
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (hash === "#/" || hash === "") {
    renderHome(app);
  } else if (hash.startsWith("#/form/")) {
    const qid = hash.replace("#/form/", "");
    renderForm(app, qid);
  } else if (hash === "#/synthese") {
    if (sessionStorage.getItem(SYNTHESE_AUTH_KEY) === "1") {
      renderSynthese(app);
    } else {
      renderSyntheseGate(app);
    }
  } else {
    renderHome(app);
  }
  window.scrollTo(0, 0);
}

// =====================================================================
// Page d'accueil
// =====================================================================
function renderHome(app) {
  const responses = loadResponses();

  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
    <h1>Maison de la Neurodiversité<br><span style="font-size:0.95rem;color:var(--muted);font-weight:400;">Étude terrain — questionnaires</span></h1>
    <button class="btn" id="goSynthese">📊 Synthèse</button>
  `;
  app.appendChild(header);

  const intro = document.createElement("p");
  intro.style.color = "var(--muted)";
  intro.style.marginBottom = "4px";
  intro.textContent = "Choisissez le questionnaire correspondant à la personne interrogée. Les réponses sont enregistrées sur cet appareil.";
  app.appendChild(intro);

  const cards = document.createElement("div");
  cards.className = "cards";

  QUESTIONNAIRES.forEach((q) => {
    const count = responses.filter((r) => r.questionnaire === q.id).length;
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--accent-color", q.color);
    card.innerHTML = `
      <h2>${escapeHtml(q.title)}</h2>
      <p>${escapeHtml(q.description)}</p>
      <span class="card-count">${count} réponse${count === 1 ? "" : "s"} enregistrée${count === 1 ? "" : "s"}</span>
    `;
    card.addEventListener("click", () => navigate("#/form/" + q.id));
    cards.appendChild(card);
  });

  app.appendChild(cards);

  document.getElementById("goSynthese").addEventListener("click", () => navigate("#/synthese"));
}

// =====================================================================
// Formulaire
// =====================================================================
function renderForm(app, qid) {
  const qDef = getQuestionnaire(qid);
  if (!qDef) {
    renderHome(app);
    return;
  }

  app.style.setProperty("--accent-color", qDef.color);
  document.documentElement.style.setProperty("--accent-color", qDef.color);

  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
    <h1>${escapeHtml(qDef.title)}</h1>
    <button class="btn" id="backHome">← Accueil</button>
  `;
  app.appendChild(header);

  // Barre de progression
  const progressWrap = document.createElement("div");
  progressWrap.className = "progress-bar";
  progressWrap.innerHTML = `<div class="progress-track"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>`;
  app.appendChild(progressWrap);

  const form = document.createElement("form");
  form.id = "questForm";

  const allQuestions = flattenQuestions(qDef);

  qDef.sections.forEach((section) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "section";
    sectionEl.style.setProperty("--accent-color", qDef.color);

    const h3 = document.createElement("h3");
    h3.textContent = section.title;
    sectionEl.appendChild(h3);

    section.questions.forEach((question) => {
      sectionEl.appendChild(renderField(question, qDef.color));
    });

    form.appendChild(sectionEl);
  });

  const actions = document.createElement("div");
  actions.className = "form-actions";
  actions.innerHTML = `
    <button type="button" class="btn" id="cancelBtn">Annuler</button>
    <button type="submit" class="btn btn-primary">Enregistrer la réponse</button>
  `;
  form.appendChild(actions);

  app.appendChild(form);

  // Gestion des choix (radio / checkbox / select_other)
  form.addEventListener("click", (e) => {
    const opt = e.target.closest(".choice-option");
    if (!opt) return;
    const group = opt.closest(".choice-group");
    const mode = group.dataset.mode;
    if (mode === "single") {
      group.querySelectorAll(".choice-option").forEach((el) => el.classList.remove("selected"));
      opt.classList.add("selected");
    } else {
      opt.classList.toggle("selected");
    }
    updateProgress();
  });

  form.addEventListener("input", updateProgress);

  function updateProgress() {
    let filled = 0;
    let total = 0;
    allQuestions.forEach((q) => {
      total++;
      const val = getFieldValue(q.id, q.type);
      if (Array.isArray(val) ? val.length > 0 : (val !== "" && val !== null && val !== undefined)) {
        filled++;
      }
    });
    const pct = total ? Math.round((filled / total) * 100) : 0;
    const fill = document.getElementById("progressFill");
    if (fill) {
      fill.style.width = pct + "%";
      fill.style.background = qDef.color;
    }
  }

  function getFieldValue(id, type) {
    if (type === "checkbox") {
      const group = form.querySelector(`[data-qid="${id}"]`);
      if (!group) return [];
      return Array.from(group.querySelectorAll(".choice-option.selected")).map((el) => el.dataset.value);
    }
    if (type === "radio" || type === "select_other") {
      const group = form.querySelector(`[data-qid="${id}"]`);
      if (!group) return "";
      const sel = group.querySelector(".choice-option.selected");
      return sel ? sel.dataset.value : "";
    }
    const field = form.querySelector(`[name="${id}"]`);
    return field ? field.value.trim() : "";
  }

  updateProgress();

  document.getElementById("backHome").addEventListener("click", () => navigate("#/"));
  document.getElementById("cancelBtn").addEventListener("click", () => {
    if (confirm("Annuler la saisie ? Les réponses non enregistrées seront perdues.")) {
      navigate("#/");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const answers = {};
    allQuestions.forEach((q) => {
      answers[q.id] = getFieldValue(q.id, q.type);
      if (q.type === "select_other") {
        const otherField = form.querySelector(`[name="${q.id}__autre"]`);
        answers[q.id + "__autre"] = otherField ? otherField.value.trim() : "";
      }
    });
    addResponse(qid, answers);
    showToast("Réponse enregistrée ✔");
    form.reset();
    form.querySelectorAll(".choice-option.selected").forEach((el) => el.classList.remove("selected"));
    window.scrollTo(0, 0);
    updateProgress();
    // Retour à l'accueil après un court instant pour confirmer visuellement
    setTimeout(() => navigate("#/"), 700);
  });
}

function renderField(question, color) {
  const wrap = document.createElement("div");
  wrap.className = "field";

  const label = document.createElement("label");
  label.className = "field-label";
  label.textContent = question.label;
  wrap.appendChild(label);

  switch (question.type) {
    case "text":
    case "email":
    case "number":
    case "date": {
      const input = document.createElement("input");
      input.type = question.type;
      input.name = question.id;
      input.autocomplete = "off";
      wrap.appendChild(input);
      break;
    }
    case "textarea": {
      const ta = document.createElement("textarea");
      ta.name = question.id;
      wrap.appendChild(ta);
      break;
    }
    case "select": {
      const select = document.createElement("select");
      select.name = question.id;
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "— Choisir —";
      select.appendChild(blank);
      question.options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        select.appendChild(o);
      });
      wrap.appendChild(select);
      break;
    }
    case "radio":
    case "checkbox": {
      const group = document.createElement("div");
      group.className = "choice-group";
      group.dataset.qid = question.id;
      group.dataset.mode = question.type === "radio" ? "single" : "multi";
      group.style.setProperty("--accent-color", color);
      question.options.forEach((opt) => {
        const chip = document.createElement("div");
        chip.className = "choice-option";
        chip.dataset.value = opt;
        chip.textContent = opt;
        chip.style.setProperty("--accent-color", color);
        group.appendChild(chip);
      });
      wrap.appendChild(group);
      break;
    }
    case "select_other": {
      const group = document.createElement("div");
      group.className = "choice-group";
      group.dataset.qid = question.id;
      group.dataset.mode = "single";
      group.style.setProperty("--accent-color", color);
      question.options.concat(["Autre"]).forEach((opt) => {
        const chip = document.createElement("div");
        chip.className = "choice-option";
        chip.dataset.value = opt;
        chip.textContent = opt;
        chip.style.setProperty("--accent-color", color);
        group.appendChild(chip);
      });
      wrap.appendChild(group);

      const otherInput = document.createElement("input");
      otherInput.type = "text";
      otherInput.name = question.id + "__autre";
      otherInput.placeholder = "Précisions (si \"Autre\" ou complément)";
      otherInput.className = "other-input";
      wrap.appendChild(otherInput);
      break;
    }
    default: {
      const input = document.createElement("input");
      input.type = "text";
      input.name = question.id;
      wrap.appendChild(input);
    }
  }

  return wrap;
}

// =====================================================================
// Synthèse
// =====================================================================
let currentSyntheseTab = QUESTIONNAIRES[0].id;

function renderSyntheseGate(app) {
  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
    <h1>Synthèse des réponses</h1>
    <button class="btn" id="backHome">← Accueil</button>
  `;
  app.appendChild(header);

  const box = document.createElement("div");
  box.className = "section";
  box.style.maxWidth = "360px";
  box.innerHTML = `
    <h3>Accès protégé</h3>
    <div class="field">
      <label class="field-label">Code d'accès</label>
      <input type="password" id="passcode" inputmode="numeric" autocomplete="off">
    </div>
    <button class="btn btn-primary" id="unlockBtn">Accéder à la synthèse</button>
    <p id="passError" style="color:#C0392B;font-size:0.85rem;display:none;margin-top:10px;">Code incorrect.</p>
  `;
  app.appendChild(box);

  document.getElementById("backHome").addEventListener("click", () => navigate("#/"));

  const tryUnlock = () => {
    const val = document.getElementById("passcode").value;
    if (val === SYNTHESE_PASSCODE) {
      sessionStorage.setItem(SYNTHESE_AUTH_KEY, "1");
      render();
    } else {
      document.getElementById("passError").style.display = "block";
    }
  };

  document.getElementById("unlockBtn").addEventListener("click", tryUnlock);
  document.getElementById("passcode").addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });
}

function renderSynthese(app) {
  const responses = loadResponses();

  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
    <h1>Synthèse des réponses</h1>
    <button class="btn" id="backHome">← Accueil</button>
  `;
  app.appendChild(header);

  // Export / import global
  const exportBar = document.createElement("div");
  exportBar.className = "export-bar";
  exportBar.innerHTML = `
    <button class="btn" id="exportAllJson">⬇️ Exporter tout (JSON)</button>
    <label class="btn" style="cursor:pointer;">
      ⬆️ Importer / fusionner (JSON)
      <input type="file" id="importJson" accept="application/json" style="display:none;">
    </label>
    <button class="btn" id="resetAll" style="color:#C0392B;">🗑 Réinitialiser toutes les données</button>
  `;
  app.appendChild(exportBar);

  if (responses.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `<p>Aucune réponse enregistrée pour le moment.</p>`;
    app.appendChild(empty);
  } else {
    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    QUESTIONNAIRES.forEach((q) => {
      const count = responses.filter((r) => r.questionnaire === q.id).length;
      const tab = document.createElement("div");
      tab.className = "tab" + (q.id === currentSyntheseTab ? " active" : "");
      tab.textContent = `${q.title} (${count})`;
      tab.addEventListener("click", () => {
        currentSyntheseTab = q.id;
        render();
      });
      tabs.appendChild(tab);
    });
    app.appendChild(tabs);

    renderSyntheseForQuestionnaire(app, currentSyntheseTab, responses);
  }

  document.getElementById("backHome").addEventListener("click", () => navigate("#/"));
  document.getElementById("exportAllJson").addEventListener("click", () => exportJSON(responses));
  document.getElementById("importJson").addEventListener("change", handleImportJSON);
  document.getElementById("resetAll").addEventListener("click", () => {
    if (confirm("Supprimer DÉFINITIVEMENT toutes les réponses enregistrées sur cet appareil ?")) {
      saveResponses([]);
      render();
    }
  });
}

function renderSyntheseForQuestionnaire(app, qid, allResponses) {
  const qDef = getQuestionnaire(qid);
  const responses = allResponses.filter((r) => r.questionnaire === qid);
  const questions = flattenQuestions(qDef);

  // KPI
  const kpiRow = document.createElement("div");
  kpiRow.className = "kpi-row";
  kpiRow.innerHTML = `
    <div class="kpi"><div class="value">${responses.length}</div><div class="label">Réponses</div></div>
  `;
  app.appendChild(kpiRow);

  // Export CSV pour ce questionnaire
  const exportBar = document.createElement("div");
  exportBar.className = "export-bar";
  exportBar.innerHTML = `<button class="btn" id="exportCsv">⬇️ Exporter en CSV (${escapeHtml(qDef.title)})</button>`;
  app.appendChild(exportBar);
  exportBar.querySelector("#exportCsv").addEventListener("click", () => exportCSV(qDef, responses));

  if (responses.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `<p>Aucune réponse pour ce questionnaire.</p>`;
    app.appendChild(empty);
    return;
  }

  let currentSection = null;
  questions.forEach((q) => {
    if (q.sectionTitle !== currentSection) {
      currentSection = q.sectionTitle;
      const h3 = document.createElement("h3");
      h3.style.marginTop = "28px";
      h3.style.color = "var(--muted)";
      h3.style.fontSize = "0.85rem";
      h3.style.textTransform = "uppercase";
      h3.style.letterSpacing = "0.04em";
      h3.textContent = currentSection;
      app.appendChild(h3);
    }
    app.appendChild(renderQuestionStats(q, responses, qDef.color));
  });
}

function renderQuestionStats(question, responses, color) {
  const box = document.createElement("div");
  box.className = "section stat-question";
  box.style.setProperty("--accent-color", color);

  const h4 = document.createElement("h4");
  h4.textContent = question.label;
  box.appendChild(h4);

  const type = question.type;

  if (type === "radio" || type === "select" || type === "select_other") {
    const counts = {};
    let answered = 0;
    responses.forEach((r) => {
      const val = r.answers[question.id];
      if (val) {
        counts[val] = (counts[val] || 0) + 1;
        answered++;
      }
    });
    box.appendChild(renderBarChart(counts, answered, color));

    if (type === "select_other") {
      const others = responses
        .map((r) => r.answers[question.id + "__autre"])
        .filter((v) => v && v.trim());
      if (others.length) {
        box.appendChild(renderAnswerList("Précisions libres", others));
      }
    }
  } else if (type === "checkbox") {
    const counts = {};
    let answered = 0;
    responses.forEach((r) => {
      const val = r.answers[question.id];
      if (Array.isArray(val) && val.length) {
        answered++;
        val.forEach((v) => {
          counts[v] = (counts[v] || 0) + 1;
        });
      }
    });
    box.appendChild(renderBarChart(counts, answered, color, true));
  } else if (type === "number") {
    const nums = responses
      .map((r) => parseFloat(r.answers[question.id]))
      .filter((n) => !isNaN(n));
    if (nums.length) {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const kpis = document.createElement("div");
      kpis.className = "kpi-row";
      kpis.innerHTML = `
        <div class="kpi"><div class="value">${avg.toFixed(1)}</div><div class="label">Moyenne</div></div>
        <div class="kpi"><div class="value">${min}</div><div class="label">Min</div></div>
        <div class="kpi"><div class="value">${max}</div><div class="label">Max</div></div>
        <div class="kpi"><div class="value">${nums.length}</div><div class="label">Réponses</div></div>
      `;
      box.appendChild(kpis);
    } else {
      box.appendChild(emptyMsg());
    }
  } else {
    // text, email, textarea, date
    const answers = responses
      .map((r) => ({ value: r.answers[question.id], date: r.date }))
      .filter((a) => a.value && String(a.value).trim());
    if (answers.length) {
      box.appendChild(renderAnswerList(`${answers.length} réponse(s)`, answers.map((a) => a.value), answers.map((a) => a.date)));
    } else {
      box.appendChild(emptyMsg());
    }
  }

  return box;
}

function emptyMsg() {
  const p = document.createElement("p");
  p.style.color = "var(--muted)";
  p.style.fontSize = "0.85rem";
  p.style.margin = "0";
  p.textContent = "Aucune réponse pour cette question.";
  return p;
}

function renderBarChart(counts, total, color, multi) {
  const wrap = document.createElement("div");
  if (Object.keys(counts).length === 0) {
    wrap.appendChild(emptyMsg());
    return wrap;
  }
  const max = Math.max(...Object.values(counts));
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      const pct = total ? Math.round((count / max) * 100) : 0;
      row.innerHTML = `
        <div class="bar-label" title="${escapeHtml(label)}">${escapeHtml(label)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}">${count}</div></div>
      `;
      wrap.appendChild(row);
    });
  const note = document.createElement("div");
  note.style.fontSize = "0.75rem";
  note.style.color = "var(--muted)";
  note.style.marginTop = "4px";
  note.textContent = multi
    ? `${total} répondant(s) ont sélectionné au moins une option (plusieurs choix possibles).`
    : `${total} réponse(s) sur cette question.`;
  wrap.appendChild(note);
  return wrap;
}

function renderAnswerList(title, values, dates) {
  const details = document.createElement("details");
  details.className = "raw-answers";
  const summary = document.createElement("summary");
  summary.textContent = title;
  details.appendChild(summary);

  const ul = document.createElement("ul");
  ul.className = "answer-list";
  values.forEach((v, i) => {
    const li = document.createElement("li");
    let html = "";
    if (dates && dates[i]) {
      html += `<span class="meta">${new Date(dates[i]).toLocaleString("fr-FR")}</span>`;
    }
    html += escapeHtml(v);
    li.innerHTML = html;
    ul.appendChild(li);
  });
  details.appendChild(ul);
  return details;
}

// =====================================================================
// Export / Import
// =====================================================================
function exportJSON(responses) {
  const blob = new Blob([JSON.stringify(responses, null, 2)], { type: "application/json" });
  downloadBlob(blob, `neurodiversite_reponses_${dateStamp()}.json`);
}

function handleImportJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("Format invalide");
      const current = loadResponses();
      const existingIds = new Set(current.map((r) => r.id));
      let added = 0;
      imported.forEach((r) => {
        if (r && r.id && !existingIds.has(r.id)) {
          current.push(r);
          existingIds.add(r.id);
          added++;
        }
      });
      saveResponses(current);
      showToast(`${added} réponse(s) importée(s)`);
      render();
    } catch (err) {
      alert("Fichier invalide : " + err.message);
    }
  };
  reader.readAsText(file);
}

function exportCSV(qDef, responses) {
  const questions = flattenQuestions(qDef);
  const columns = [];
  questions.forEach((q) => {
    columns.push(q.id);
    if (q.type === "select_other") columns.push(q.id + "__autre");
  });

  const header = ["date", ...columns.map((c) => questionLabel(qDef, c))];
  const rows = responses.map((r) => {
    const row = [new Date(r.date).toLocaleString("fr-FR")];
    columns.forEach((c) => {
      const val = r.answers[c];
      if (Array.isArray(val)) {
        row.push(val.join("; "));
      } else {
        row.push(val ?? "");
      }
    });
    return row;
  });

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\r\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${qDef.id}_reponses_${dateStamp()}.csv`);
}

function questionLabel(qDef, columnId) {
  const isOther = columnId.endsWith("__autre");
  const baseId = isOther ? columnId.replace("__autre", "") : columnId;
  const q = flattenQuestions(qDef).find((x) => x.id === baseId);
  if (!q) return columnId;
  return isOther ? q.label + " (précisions)" : q.label;
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
