import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { removeComments, findFilesRecursive } from "./utils";
import { getInstancesCache } from "./instancesCache";
import { Quest, InstancesCache, GameInstance } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ścieżka do katalogu ze skryptami moda Gothic 2 Odyseja
 * TODO: Przekazać jako argument CLI
 */
const MOD_SCRIPTS_PATH =
  "C:\\Users\\seba1\\Documents\\Projects\\sefaris\\odyseja-pl\\mod\\Scripts\\Content";

const STORY_PATH = path.join(MOD_SCRIPTS_PATH, "Story");
const CACHE_FILE_PATH = path.join(__dirname, "..", ".instances-cache.json");
const OUTPUT_FILE = path.join(__dirname, "..", "quests.json");

/**
 * Cache dla wartości XP
 */
const xpValuesCache = new Map<string, number>();

/**
 * Parsuje plik XP_Constants.d i wyciąga wszystkie wartości XP
 */
function parseXPConstants(): Map<string, number> {
  if (xpValuesCache.size > 0) {
    return xpValuesCache;
  }

  const xpFilePath = path.join(STORY_PATH, "XP_Constants.d");

  if (!fs.existsSync(xpFilePath)) {
    console.warn("⚠️  Nie znaleziono pliku XP_Constants.d");
    return xpValuesCache;
  }

  try {
    const rawContent = fs.readFileSync(xpFilePath, "utf-8");
    const content = removeComments(rawContent);

    // Wzorzec: const int XP_NazwaQuestu = wartość;
    const xpPattern = /const\s+int\s+XP_(\w+)\s*=\s*(\d+)\s*;/gi;
    let match;

    while ((match = xpPattern.exec(content)) !== null) {
      const questName = match[1];
      const xpValue = parseInt(match[2], 10);
      xpValuesCache.set(questName, xpValue);
    }

    console.log(`   📊 Załadowano ${xpValuesCache.size} wartości XP\n`);
  } catch (error) {
    console.error("   ❌ Błąd parsowania XP_Constants.d:", error);
  }

  return xpValuesCache;
}

/**
 * Parsuje plik LOG_Constants_*.d i wyciąga wszystkie definicje zadań
 */
function parseLogConstantsFile(filePath: string): Quest[] {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const content = removeComments(rawContent);
  const quests: Quest[] = [];

  // Wzorzec dla definicji zadania: const string TOPIC_NazwaZmiennej = "Polska Nazwa";
  const questPattern = /const\s+string\s+TOPIC_(\w+)\s*=\s*"([^"]+)";/g;

  // Wzorzec dla rozdziałów: // ------ Kapitel X ------ (zachowamy bo to nagłówki)
  const chapterPattern = /------\s*Kapitel\s+(\d+)\s*------/g;

  const lines = content.split("\n");
  let currentChapter: number | undefined = undefined;
  const sourceFile = path.basename(filePath);

  for (const line of lines) {
    // Sprawdź czy to nagłówek rozdziału
    const chapterMatch = chapterPattern.exec(line);
    if (chapterMatch) {
      currentChapter = parseInt(chapterMatch[1], 10);
      continue;
    }

    // Sprawdź czy to definicja zadania
    const questMatch = questPattern.exec(line);
    if (questMatch) {
      quests.push({
        topicConstant: questMatch[1],
        name: questMatch[2],
        chapter: currentChapter,
        sourceFile,
      });
    }

    // Reset regex lastIndex dla kolejnej linii
    chapterPattern.lastIndex = 0;
    questPattern.lastIndex = 0;
  }

  return quests;
}

/**
 * Buduje index: quest topic -> pliki które go tworzą (Log_CreateTopic)
 */
function buildQuestToFilesIndex(): Map<string, string[]> {
  console.log("🗂️  Budowanie indexu quest -> pliki...");

  const index = new Map<string, string[]>();

  const dialogPath = path.join(STORY_PATH, "Dialoge");
  const itemsPath = path.join(MOD_SCRIPTS_PATH, "Items");

  const dialogFiles = fs.existsSync(dialogPath)
    ? findFilesRecursive(dialogPath, ".d")
    : [];
  const itemFiles = fs.existsSync(itemsPath)
    ? findFilesRecursive(itemsPath, ".d")
    : [];

  const allFiles = [...dialogFiles, ...itemFiles];

  for (const file of allFiles) {
    const rawContent = fs.readFileSync(file, "utf-8");
    const content = removeComments(rawContent);

    // Znajdź wszystkie Log_CreateTopic(TOPIC_*, LOG_MISSION)
    const createTopicPattern =
      /\bLog_CreateTopic\s*\(\s*TOPIC_(\w+)\s*,\s*LOG_MISSION\s*\)/gi;
    let match;

    while ((match = createTopicPattern.exec(content)) !== null) {
      const questTopic = match[1];

      if (!index.has(questTopic)) {
        index.set(questTopic, []);
      }
      index.get(questTopic)!.push(file);
    }
  }

  console.log(`   ✅ Index zawiera ${index.size} questów\n`);
  return index;
}

/**
 * Znajduje quest givera używając indexu i cache
 */
function findQuestGiver(
  questTopic: string,
  questToFilesIndex: Map<string, string[]>,
  instancesCache: InstancesCache
): {
  questGiverId?: string | string[];
  questGiver?: string | string[];
  questSourceType?: "NPC" | "ITEM";
  dialogFile?: string;
} {
  const files = questToFilesIndex.get(questTopic);
  if (!files || files.length === 0) {
    return {};
  }

  // Usuń duplikaty plików (quest może być tworzony wielokrotnie w tym samym pliku)
  const uniqueFiles = [...new Set(files)];

  // Jeśli quest jest tworzony w wielu plikach, zbierz wszystkich giverów
  const giverIds: string[] = [];
  const giverNames: string[] = [];
  let questSourceType: "NPC" | "ITEM" | undefined;
  const dialogFiles: string[] = [];

  for (const file of uniqueFiles) {
    const fileName = path.basename(file);

    // Dla dialogów NPC: DIA_[TYPE]_[ID]_[Name].d
    const npcDialogMatch = fileName.match(/DIA_([A-Z]+)_(\d+)_(\w+)\.d/i);
    if (npcDialogMatch) {
      const npcType = npcDialogMatch[1];
      const npcId = npcDialogMatch[2];
      const npcName = npcDialogMatch[3];
      const fullNpcId = `${npcType}_${npcId}_${npcName}`;

      // Pobierz polską nazwę z cache
      const npcInstance = instancesCache.instances.get(fullNpcId);
      const displayName = npcInstance?.fields?.name || npcName;

      giverIds.push(fullNpcId);
      giverNames.push(displayName as string);
      questSourceType = "NPC";
      dialogFiles.push(fileName);
      continue;
    }

    // Dla itemów: ItMi_*.d lub podobne (jeden item na plik)
    // UWAGA: Wykluczamy pliki typu IT_Mod_* które zawierają wiele itemów
    const itemMatch = fileName.match(/^(It\w+_\w+)\.d$/i);
    if (itemMatch && !fileName.match(/_Mod_/i)) {
      const itemId = itemMatch[1];

      // Pobierz polską nazwę z cache
      const itemInstance = instancesCache.instances.get(itemId);
      const displayName = itemInstance?.fields?.name || itemId;

      giverIds.push(itemId);
      giverNames.push(displayName as string);
      questSourceType = "ITEM";
      dialogFiles.push(fileName);
      continue;
    }

    // Dla plików z wieloma itemami (np. IT_Mod_Written.d):
    const rawContent = fs.readFileSync(file, "utf-8");
    const content = removeComments(rawContent);

    // Szukaj wszystkich Log_CreateTopic dla tego questa w pliku
    const createTopicPattern = new RegExp(
      `\\bLog_CreateTopic\\s*\\(\\s*TOPIC_${questTopic}\\s*,\\s*LOG_MISSION\\s*\\)`,
      "gi"
    );

    let match;
    while ((match = createTopicPattern.exec(content)) !== null) {
      if (match.index === undefined) continue;

      // Znajdź najbliższą funkcję FUNC VOID Use* przed tym Log_CreateTopic
      const beforeMatch = content.substring(0, match.index);
      const useFuncPattern = /FUNC\s+VOID\s+(Use\w+)\s*\(/gi;
      let lastUseFunc: RegExpExecArray | null = null;
      let useFuncMatch;

      while ((useFuncMatch = useFuncPattern.exec(beforeMatch)) !== null) {
        lastUseFunc = useFuncMatch;
      }

      if (!lastUseFunc) {
        // Jeśli nie znaleziono funkcji Use*, użyj nazwy pliku jako fallback
        const fileBaseName = path.basename(file, ".d");
        giverIds.push(fileBaseName);
        giverNames.push(fileBaseName);
        continue;
      }

      const useFuncName = lastUseFunc[1]; // np. "Use_Map_MendozasInsel" lub "UsePiratentagebuch01"

      // Teraz znajdź INSTANCE który ma on_state[0] = UseFuncName;
      const instancePattern = new RegExp(
        `INSTANCE\\s+(\\w+)\\s*\\([^)]+\\)[^{]*\\{[^}]*on_state\\[0\\]\\s*=\\s*${useFuncName}\\s*;`,
        "gis"
      );

      const instanceMatch = instancePattern.exec(content);

      if (!instanceMatch) {
        // Jeśli nie znaleziono instancji, użyj nazwy pliku jako fallback
        const fileBaseName = path.basename(file, ".d");
        giverIds.push(fileBaseName);
        giverNames.push(fileBaseName);
        continue;
      }

      const instanceId = instanceMatch[1]; // np. "ItWr_Map_MendozasInselALT" lub "Piratentagebuch_01"

      // Pobierz nazwę z cache
      const itemInstance = instancesCache.instances.get(instanceId);
      const displayName = (itemInstance?.fields?.name as string) || instanceId;

      giverIds.push(instanceId);
      giverNames.push(displayName);
      questSourceType = "ITEM";
      if (!dialogFiles.includes(fileName)) {
        dialogFiles.push(fileName);
      }
    }
  }

  // Zwróć pojedynczy element lub tablicę
  if (giverIds.length === 0) {
    return {};
  }

  if (giverIds.length === 1) {
    return {
      questGiverId: giverIds[0],
      questGiver: giverNames[0],
      questSourceType,
      dialogFile: dialogFiles[0],
    };
  }

  return {
    questGiverId: giverIds,
    questGiver: giverNames,
    questSourceType,
    dialogFile: dialogFiles.join(", "),
  };
}

/**
 * Buduje index: quest topic -> pliki które kończą questa (LOG_SUCCESS)
 */
function buildQuestCompletionIndex(): Map<string, string[]> {
  console.log("🏆 Budowanie indexu quest -> pliki z zakończeniem...");

  const index = new Map<string, string[]>();

  const dialogPath = path.join(STORY_PATH, "Dialoge");
  const aiPath = path.join(STORY_PATH, "AI");

  const dialogFiles = fs.existsSync(dialogPath)
    ? findFilesRecursive(dialogPath, ".d")
    : [];
  const aiFiles = fs.existsSync(aiPath) ? findFilesRecursive(aiPath, ".d") : [];

  const allFiles = [...dialogFiles, ...aiFiles];

  for (const file of allFiles) {
    const rawContent = fs.readFileSync(file, "utf-8");
    const content = removeComments(rawContent);

    // Znajdź wszystkie MIS_* = LOG_SUCCESS lub Log_SetTopicStatus(TOPIC_*, LOG_SUCCESS)
    const successPattern =
      /(?:MIS_(\w+)\s*=\s*LOG_SUCCESS|Log_SetTopicStatus\s*\(\s*TOPIC_(\w+)\s*,\s*LOG_SUCCESS\s*\))/gi;
    let match;

    while ((match = successPattern.exec(content)) !== null) {
      const questTopic = match[1] || match[2];

      if (!index.has(questTopic)) {
        index.set(questTopic, []);
      }
      index.get(questTopic)!.push(file);
    }
  }

  console.log(`   ✅ Index zawiera ${index.size} zakończeń questów\n`);
  return index;
}

/**
 * Wyciąga nagrody za ukończenie questa używając indexu
 */
function extractQuestRewards(
  questTopic: string,
  questCompletionIndex: Map<string, string[]>,
  instancesCache: InstancesCache,
  xpValues: Map<string, number>
): {
  xp?: number;
  gold?: number;
  items?: string[];
} | null {
  const files = questCompletionIndex.get(questTopic);
  if (!files || files.length === 0) {
    return null;
  }

  // Przeszukaj wszystkie pliki gdzie quest się kończy
  for (const file of files) {
    const rawContent = fs.readFileSync(file, "utf-8");
    const content = removeComments(rawContent);

    // Szukaj funkcji z MIS_QuestName = LOG_SUCCESS lub Log_SetTopicStatus(TOPIC_Quest, LOG_SUCCESS)
    const successPattern = new RegExp(
      `(?:MIS_${questTopic}\\s*=\\s*LOG_SUCCESS|Log_SetTopicStatus\\s*\\(\\s*TOPIC_${questTopic}\\s*,\\s*LOG_SUCCESS\\s*\\))`,
      "i"
    );

    const successMatch = content.match(successPattern);
    if (!successMatch) {
      continue;
    }

    // Znajdź funkcję zawierającą ten pattern
    const funcStart = content.lastIndexOf("func", successMatch.index);
    if (funcStart === -1) continue;

    const openBrace = content.indexOf("{", funcStart);
    if (openBrace === -1) continue;

    // Zlicz nawiasy klamrowe aby znaleźć koniec funkcji
    let braceCount = 0;
    let funcEnd = openBrace;

    for (let i = openBrace; i < content.length; i++) {
      if (content[i] === "{") braceCount++;
      if (content[i] === "}") braceCount--;

      if (braceCount === 0) {
        funcEnd = i;
        break;
      }
    }

    const functionBody = content.substring(openBrace + 1, funcEnd);

    // Ekstrauj nagrody
    const rewards: { xp?: number; gold?: number; items?: string[] } = {};

    // XP: B_GivePlayerXP(XP_Name)
    const xpPattern = /B_GivePlayerXP\s*\(\s*XP_(\w+)\s*\)/gi;
    let xpMatch;
    while ((xpMatch = xpPattern.exec(functionBody)) !== null) {
      const xpName = xpMatch[1];
      const xpValue = xpValues.get(xpName);
      if (xpValue) {
        rewards.xp = (rewards.xp || 0) + xpValue;
      }
    }

    // Gold i Items: B_GiveInvItems(giver, other/hero, item, count)
    const giveItemsPattern =
      /B_GiveInvItems\s*\(\s*\w+\s*,\s*(other|hero)\s*,\s*(\w+)\s*,\s*(\d+)\s*\)/gi;
    let itemMatch;

    while ((itemMatch = giveItemsPattern.exec(functionBody)) !== null) {
      const itemId = itemMatch[2];
      const count = parseInt(itemMatch[3], 10);

      if (itemId === "ItMi_Gold") {
        rewards.gold = (rewards.gold || 0) + count;
      } else {
        rewards.items = rewards.items || [];
        for (let i = 0; i < count; i++) {
          rewards.items.push(itemId);
        }
      }
    }

    // CreateInvItems(other/hero, item, count)
    const createItemsPattern =
      /CreateInvItems\s*\(\s*(other|hero)\s*,\s*(\w+)\s*,\s*(\d+)\s*\)/gi;
    let createMatch;

    while ((createMatch = createItemsPattern.exec(functionBody)) !== null) {
      const itemId = createMatch[2];
      const count = parseInt(createMatch[3], 10);

      if (itemId === "ItMi_Gold") {
        rewards.gold = (rewards.gold || 0) + count;
      } else {
        rewards.items = rewards.items || [];
        for (let i = 0; i < count; i++) {
          rewards.items.push(itemId);
        }
      }
    }

    if (rewards.xp || rewards.gold || rewards.items) {
      return rewards;
    }
  }

  return null;
}

/**
 * Główna funkcja parsera
 */
async function main() {
  console.log("🚀 Gothic 2: Odyseja - Parser Zadań\n");
  console.log("=".repeat(50) + "\n");

  // 1. Załaduj lub zbuduj cache instancji
  console.log("📦 Ładowanie cache instancji...");
  const instancesCache = getInstancesCache(MOD_SCRIPTS_PATH, CACHE_FILE_PATH);

  // 2. Parsuj XP Constants
  console.log("📊 Parsowanie XP Constants...");
  const xpValues = parseXPConstants();

  // 3. Buduj index quest -> pliki
  const questToFilesIndex = buildQuestToFilesIndex();

  // 4. Buduj index quest -> pliki z zakończeniem
  const questCompletionIndex = buildQuestCompletionIndex();

  // 5. Parsuj wszystkie LOG_Constants
  console.log("📝 Parsowanie LOG_Constants...");
  const logConstantsFiles = findFilesRecursive(STORY_PATH, ".d").filter(
    (f) => path.basename(f).startsWith("LOG_Constants_") && f.endsWith(".d")
  );

  let allQuests: Quest[] = [];
  for (const file of logConstantsFiles) {
    const quests = parseLogConstantsFile(file);
    allQuests = allQuests.concat(quests);
  }

  console.log(`   ✅ Znaleziono ${allQuests.length} zadań\n`);

  // 4. Dla każdego questa znajdź quest givera i nagrody
  console.log("🔍 Szukanie quest giverów i nagród...\n");

  let processedCount = 0;
  let withSourceCount = 0;
  let withRewardsCount = 0;

  for (const quest of allQuests) {
    processedCount++;

    if (processedCount % 50 === 0) {
      console.log(
        `   Przetworzono: ${processedCount}/${allQuests.length} (źródła: ${withSourceCount}, nagrody: ${withRewardsCount})`
      );
    }

    // Znajdź quest givera
    const giverInfo = findQuestGiver(
      quest.topicConstant,
      questToFilesIndex,
      instancesCache
    );
    if (giverInfo.questGiverId) {
      quest.questGiverId = giverInfo.questGiverId;
      quest.questGiver = giverInfo.questGiver;
      quest.questSourceType = giverInfo.questSourceType;
      quest.dialogFile = giverInfo.dialogFile;
      withSourceCount++;
    }

    // Znajdź nagrody
    const rewards = extractQuestRewards(
      quest.topicConstant,
      questCompletionIndex,
      instancesCache,
      xpValues
    );
    if (rewards) {
      quest.rewards = rewards;
      withRewardsCount++;
    }
  }

  console.log(
    `\n   ✅ Znaleziono źródła dla ${withSourceCount}/${allQuests.length} zadań`
  );
  console.log(
    `   ✅ Znaleziono nagrody dla ${withRewardsCount}/${allQuests.length} zadań\n`
  );

  // 5. Zapisz wyniki
  console.log("💾 Zapisywanie wyników...");
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuests, null, 2), "utf-8");
  console.log(`   ✅ Zapisano do: ${OUTPUT_FILE}\n`);

  console.log("=".repeat(50));
  console.log("✅ Parsowanie zakończone!");
}

// Uruchom parser
main().catch((error) => {
  console.error("❌ Błąd:", error);
  process.exit(1);
});
