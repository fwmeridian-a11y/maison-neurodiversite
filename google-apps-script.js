// =====================================================================
// Script à coller dans Google Apps Script (script.google.com), lié à un
// Google Sheet dédié. Il reçoit les réponses envoyées par le site
// (doPost) et les restitue à la page Synthèse (doGet).
//
// Voir SETUP_GOOGLE_SHEETS.md pour les étapes de déploiement.
// =====================================================================

const SHEET_NAME = "Réponses";

function doPost(e) {
  const sheet = getSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.id || "",
    data.questionnaire || "",
    data.date || new Date().toISOString(),
    JSON.stringify(data.answers || {})
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [id, questionnaire, date, answersJson] = rows[i];
    if (!id) continue;
    let answers = {};
    try {
      answers = JSON.parse(answersJson);
    } catch (err) {
      answers = {};
    }
    out.push({ id: id, questionnaire: questionnaire, date: date, answers: answers });
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["id", "questionnaire", "date", "answers_json"]);
  }
  return sheet;
}
