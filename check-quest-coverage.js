/**
 * Skrypt weryfikujący pokrycie zadań w dokumentacji Markdown
 * Porównuje zadania z parser/quests.json z zadaniami w plikach docs/sekcje/zadania/*.md
 */

const fs = require("fs");
const path = require("path");

// Ścieżki
const QUESTS_JSON = path.join(__dirname, "parser", "quests.json");
const DOCS_DIR = path.join(__dirname, "docs", "sekcje", "zadania");
const OUTPUT_HTML = path.join(__dirname, "quest-coverage-report.html");

// Wczytaj wszystkie zadania z parser/quests.json
function loadAllQuests() {
  const data = fs.readFileSync(QUESTS_JSON, "utf-8");
  const json = JSON.parse(data);
  return json.quests || json; // obsługa różnych formatów
}

// Pobierz listę plików markdown
function getMarkdownFiles() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ Katalog ${DOCS_DIR} nie istnieje!`);
    return [];
  }

  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(DOCS_DIR, file));
}

// Wyciągnij nagłówki zadań z pliku markdown
function extractQuestTitlesFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const questTitles = new Set();

  // Użyj globalnego regex zamiast split na linie
  const matches = content.match(/^####\s+(.+)$/gm);

  if (matches) {
    for (const match of matches) {
      const title = match.replace(/^####\s+/, "").trim();
      questTitles.add(title);
    }
  }

  return questTitles;
}

// Normalizuj nazwę zadania (usuń znaki specjalne, małe litery)
function normalizeQuestName(name) {
  return name
    .toLowerCase()
    .replace(/[^\wąćęłńóśźż\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Sprawdź które zadania są udokumentowane
function checkQuestCoverage(allQuests, documentedQuests) {
  const documented = [];
  const missing = [];

  // Utwórz mapę znormalizowanych nazw zadań z dokumentacji
  const normalizedDocs = new Map();
  for (const questTitle of documentedQuests) {
    const normalized = normalizeQuestName(questTitle);
    normalizedDocs.set(normalized, questTitle);
  }

  for (const quest of allQuests) {
    const questName = quest.name;
    const normalized = normalizeQuestName(questName);

    if (normalizedDocs.has(normalized)) {
      documented.push({
        ...quest,
        documentedAs: normalizedDocs.get(normalized),
      });
    } else {
      missing.push(quest);
    }
  }

  return { documented, missing };
}

// Generuj raport HTML
function generateHtmlReport(allQuests, documented, missing) {
  const totalQuests = allQuests.length;
  const documentedCount = documented.length;
  const missingCount = missing.length;
  const coveragePercent = ((documentedCount / totalQuests) * 100).toFixed(2);

  // Statystyki aktywnych zadań
  const activeQuests = allQuests.filter((q) => q.isActive);
  const inactiveQuests = allQuests.filter((q) => !q.isActive);
  const activeDocumented = documented.filter((q) => q.isActive);
  const activeMissing = missing.filter((q) => q.isActive);
  const inactiveMissing = missing.filter((q) => !q.isActive);

  const activeCoveragePercent =
    activeQuests.length > 0
      ? ((activeDocumented.length / activeQuests.length) * 100).toFixed(2)
      : 0;

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport Pokrycia Zadań - Gothic 2: Odyseja</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 32px;
    }
    
    .subtitle {
      color: #7f8c8d;
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-card.success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    
    .stat-card.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .progress-bar {
      background: #ecf0f1;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 40px;
      position: relative;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
      height: 100%;
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    h2 {
      color: #2c3e50;
      margin: 40px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #3498db;
      font-size: 24px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 14px;
    }
    
    thead {
      background: #34495e;
      color: white;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    tbody tr:hover {
      background: #f8f9fa;
    }
    
    .quest-name {
      font-weight: 500;
      color: #2c3e50;
    }
    
    .quest-constant {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #7f8c8d;
      background: #ecf0f1;
      padding: 2px 6px;
      border-radius: 3px;
    }
    
    .quest-giver {
      color: #16a085;
      font-size: 13px;
    }
    
    .quest-reward {
      font-size: 13px;
      line-height: 1.6;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: #95a5a6;
      font-style: italic;
    }
    
    .timestamp {
      text-align: center;
      color: #95a5a6;
      margin-top: 40px;
      font-size: 14px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #e74c3c;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Raport Pokrycia Zadań</h1>
    <p class="subtitle">Gothic 2: Odyseja - Dokumentacja Wiki</p>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${totalQuests}</div>
        <div class="stat-label">Wszystkie zadania</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
          ✅ ${activeQuests.length} aktywnych | ❌ ${
    inactiveQuests.length
  } nieaktywnych
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-value">${documentedCount}</div>
        <div class="stat-label">Udokumentowane</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
          ✅ ${activeDocumented.length} aktywnych
        </div>
      </div>
      
      <div class="stat-card warning">
        <div class="stat-value">${missingCount}</div>
        <div class="stat-label">Brakujące</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">
          ✅ ${activeMissing.length} aktywnych | ❌ ${
    inactiveMissing.length
  } nieaktywnych
        </div>
      </div>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${coveragePercent}%">
        ${coveragePercent}% pokrycia (wszystkie)
      </div>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${activeCoveragePercent}%; background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);">
        ${activeCoveragePercent}% pokrycia (tylko aktywne zadania)
      </div>
    </div>
    
    ${
      activeMissing.length > 0
        ? `
    <h2>❌ Brakujące zadania (${activeMissing.length})</h2>
    <p style="color: #7f8c8d; margin-bottom: 20px;">Zadania aktywne w grze, które wymagają dokumentacji</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 25%">Nazwa zadania</th>
          <th style="width: 20%">Stała</th>
          <th style="width: 25%">Zleceniodawca</th>
          <th style="width: 30%">Nagroda</th>
        </tr>
      </thead>
      <tbody>
        ${activeMissing
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (quest) => `
          <tr>
            <td class="quest-name">${quest.name}</td>
            <td><code class="quest-constant">${quest.topicConstant}</code></td>
            <td class="quest-giver">${formatQuestGiver(quest)}</td>
            <td class="quest-reward">${formatRewards(quest)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : ""
    }
    
    ${
      activeDocumented.length > 0
        ? `
    <h2>✅ Zadania pokryte (${activeDocumented.length})</h2>
    <p style="color: #7f8c8d; margin-bottom: 20px;">Zadania aktywne w grze, które są już udokumentowane</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 25%">Nazwa zadania</th>
          <th style="width: 18%">Stała</th>
          <th style="width: 22%">Udokumentowane jako</th>
          <th style="width: 35%">Nagroda</th>
        </tr>
      </thead>
      <tbody>
        ${activeDocumented
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (quest) => `
          <tr style="background: #f0fdf4;">
            <td class="quest-name">${quest.name}</td>
            <td><code class="quest-constant">${quest.topicConstant}</code></td>
            <td style="color: #059669;">${quest.documentedAs}</td>
            <td class="quest-reward">${formatRewards(quest)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : ""
    }
    
    ${
      inactiveMissing.length > 0
        ? `
    <h2>💤 Zdeklarowane zadania, lecz nieistniejące w grze (${
      inactiveMissing.length
    })</h2>
    <p style="color: #7f8c8d; margin-bottom: 20px;">Zadania tylko w LOG_Constants, bez Log_CreateTopic - prawdopodobnie wycięte z gry</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 25%">Nazwa zadania</th>
          <th style="width: 20%">Stała</th>
          <th style="width: 25%">Zleceniodawca</th>
          <th style="width: 30%">Nagroda</th>
        </tr>
      </thead>
      <tbody>
        ${inactiveMissing
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (quest) => `
          <tr style="opacity: 0.6;">
            <td class="quest-name">${quest.name}</td>
            <td><code class="quest-constant">${quest.topicConstant}</code></td>
            <td class="quest-giver">${formatQuestGiver(quest)}</td>
            <td class="quest-reward">${formatRewards(quest)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : ""
    }
    
    ${
      activeMissing.length === 0 && inactiveMissing.length === 0
        ? `
    <div class="no-data">
      <h2>🎉 Gratulacje!</h2>
      <p>Wszystkie zadania są udokumentowane!</p>
    </div>
    `
        : ""
    }
    
    <div class="timestamp">
      Wygenerowano: ${new Date().toLocaleString("pl-PL")}
    </div>
  </div>
  
  <script>
    // Skrypt nie jest potrzebny - formatowanie dzieje się po stronie Node.js
  </script>
</body>
</html>`;

  return html;
}

// Pomocnicza funkcja do formatowania quest givera w HTML
function formatQuestGiver(quest) {
  if (!quest.questGiver) return "<em>brak danych</em>";

  if (Array.isArray(quest.questGiver)) {
    return quest.questGiver.join(", ");
  }

  return quest.questGiver;
}

// Pomocnicza funkcja do formatowania nagród w HTML
function formatRewards(quest) {
  if (!quest.rewards) return "<em>brak danych</em>";

  const parts = [];

  if (quest.rewards.xp) {
    parts.push(`<strong>${quest.rewards.xp} XP</strong>`);
  }

  if (quest.rewards.gold) {
    parts.push(`<strong>${quest.rewards.gold} złota</strong>`);
  }

  if (quest.rewards.items && quest.rewards.items.length > 0) {
    const itemNames = quest.rewards.itemNames || quest.rewards.items;
    itemNames.forEach((itemName) => {
      parts.push(`<span style="color: #8e44ad;">🎁 ${itemName}</span>`);
    });
  }

  return parts.length > 0 ? parts.join("<br>") : "<em>brak nagród</em>";
}

// Główna funkcja
function main() {
  console.log("🚀 Sprawdzanie pokrycia zadań w dokumentacji...\n");

  // Wczytaj zadania z JSON
  console.log("📦 Ładowanie zadań z parser/quests.json...");
  const allQuests = loadAllQuests();
  console.log(`   ✅ Znaleziono ${allQuests.length} zadań\n`);

  // Wczytaj pliki markdown
  console.log("📄 Skanowanie plików markdown...");
  const mdFiles = getMarkdownFiles();
  console.log(`   ✅ Znaleziono ${mdFiles.length} plików\n`);

  // Wyciągnij wszystkie nazwy zadań z dokumentacji
  console.log("🔍 Wyodrębnianie zadań z dokumentacji...");
  const allDocumentedQuests = new Set();

  for (const mdFile of mdFiles) {
    const fileName = path.basename(mdFile);
    const questTitles = extractQuestTitlesFromMarkdown(mdFile);
    console.log(`   📝 ${fileName}: ${questTitles.size} zadań`);

    for (const title of questTitles) {
      allDocumentedQuests.add(title);
    }
  }

  console.log(
    `\n   ✅ Łącznie udokumentowanych: ${allDocumentedQuests.size} zadań\n`
  );

  // Porównaj zadania
  console.log("📊 Analiza pokrycia...");
  const { documented, missing } = checkQuestCoverage(
    allQuests,
    allDocumentedQuests
  );

  // Statystyki aktywnych zadań
  const activeQuests = allQuests.filter((q) => q.isActive);
  const activeDocumented = documented.filter((q) => q.isActive);
  const activeMissing = missing.filter((q) => q.isActive);
  const inactiveMissing = missing.filter((q) => !q.isActive);

  console.log(
    `   ✅ Udokumentowane: ${documented.length} (${activeDocumented.length} aktywnych)`
  );
  console.log(
    `   ❌ Brakujące: ${missing.length} (${activeMissing.length} aktywnych, ${inactiveMissing.length} nieaktywnych)`
  );
  console.log(
    `   📈 Pokrycie wszystkich: ${(
      (documented.length / allQuests.length) *
      100
    ).toFixed(2)}%`
  );
  console.log(
    `   📈 Pokrycie aktywnych: ${(
      (activeDocumented.length / activeQuests.length) *
      100
    ).toFixed(2)}%\n`
  );

  // Generuj raport HTML
  console.log("💾 Generowanie raportu HTML...");
  const html = generateHtmlReport(allQuests, documented, missing);
  fs.writeFileSync(OUTPUT_HTML, html, "utf-8");
  console.log(`   ✅ Zapisano: ${OUTPUT_HTML}\n`);

  console.log("✅ Gotowe!\n");
}

// Uruchom skrypt
main();
