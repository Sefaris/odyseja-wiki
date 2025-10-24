import * as fs from "fs";
import * as path from "path";
import { GameInstance, InstancesCache } from "./types";
import { findFilesRecursive, readFile, removeComments } from "./utils";

const CACHE_VERSION = "1.0.0";

/**
 * Parsuje instancję z kodu Daedalus
 */
function parseInstance(content: string, startPos: number): GameInstance | null {
  try {
    // Znajdź: instance NazwaInstancji (Typ)
    const headerPattern = /instance\s+(\w+)\s*\(\s*(\w+)\s*\)/i;
    const headerMatch = content.substring(startPos).match(headerPattern);

    if (!headerMatch) {
      return null;
    }

    const instanceId = headerMatch[1];
    const instanceType = headerMatch[2];

    // Znajdź { } instancji
    const openBracePos = content.indexOf("{", startPos);
    if (openBracePos === -1) {
      return null;
    }

    let braceCount = 0;
    let closePos = openBracePos;

    for (let i = openBracePos; i < content.length; i++) {
      if (content[i] === "{") braceCount++;
      if (content[i] === "}") braceCount--;

      if (braceCount === 0) {
        closePos = i;
        break;
      }
    }

    const body = content.substring(openBracePos + 1, closePos);

    // Parsuj pola: nazwa = wartość;
    const fields: Record<string, string | number> = {};
    const lines = body.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Pomiń komentarze
      if (trimmed.startsWith("//") || trimmed.length === 0) {
        continue;
      }

      // Parsuj pole: name = value;
      const fieldMatch = trimmed.match(/^(\w+)\s*=\s*(.+?);/);

      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        let fieldValue: string | number = fieldMatch[2].trim();

        // Usuń cudzysłowy jeśli string
        if (fieldValue.startsWith('"') && fieldValue.endsWith('"')) {
          fieldValue = fieldValue.slice(1, -1);
        } else if (!isNaN(Number(fieldValue))) {
          // Konwertuj na number jeśli to liczba
          fieldValue = Number(fieldValue);
        }

        fields[fieldName] = fieldValue;
      }
    }

    return {
      id: instanceId,
      type: instanceType,
      fields,
      sourceFile: "",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parsuje wszystkie instancje z pliku
 */
function parseAllInstancesFromFile(
  filePath: string
): Map<string, GameInstance> {
  const instances = new Map<string, GameInstance>();

  try {
    const rawContent = readFile(filePath);
    // Wyczyść komentarze przed parsowaniem
    const content = removeComments(rawContent);
    const fileName = path.basename(filePath);

    // Znajdź wszystkie wystąpienia "instance"
    const instancePattern = /instance\s+\w+\s*\(\s*\w+\s*\)/gi;
    let match;

    while ((match = instancePattern.exec(content)) !== null) {
      const instance = parseInstance(content, match.index);

      if (instance) {
        instance.sourceFile = fileName;
        instances.set(instance.id, instance);
      }
    }
  } catch (error) {
    console.error(`   ❌ Błąd parsowania ${filePath}:`, error);
  }

  return instances;
}

/**
 * Buduje cache wszystkich instancji z modyfikacji
 */
export function buildInstancesCache(scriptsPath: string): InstancesCache {
  console.log("🔨 Budowanie cache instancji...");

  const instances = new Map<string, GameInstance>();

  // Przeszukaj wszystkie pliki .d
  const allDFiles = findFilesRecursive(scriptsPath, ".d");
  console.log(`   Znaleziono ${allDFiles.length} plików do parsowania`);

  let processedCount = 0;
  let instanceCount = 0;

  for (const file of allDFiles) {
    processedCount++;

    if (processedCount % 100 === 0) {
      console.log(
        `   Przetworzono: ${processedCount}/${allDFiles.length} (instancji: ${instanceCount})`
      );
    }

    const fileInstances = parseAllInstancesFromFile(file);

    for (const [id, instance] of fileInstances) {
      instances.set(id, instance);
      instanceCount++;
    }
  }

  console.log(
    `   ✅ Zaparsowano ${instanceCount} instancji z ${processedCount} plików\n`
  );

  return {
    instances,
    timestamp: Date.now(),
    version: CACHE_VERSION,
  };
}

/**
 * Zapisuje cache do pliku
 */
export function saveInstancesCache(
  cache: InstancesCache,
  cacheFilePath: string
): void {
  console.log("💾 Zapisywanie cache do pliku...");

  // Konwertuj Map na obiekt do JSON
  const data = {
    version: cache.version,
    timestamp: cache.timestamp,
    instances: Object.fromEntries(cache.instances),
  };

  fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`   ✅ Cache zapisany: ${cacheFilePath}\n`);
}

/**
 * Wczytuje cache z pliku
 */
export function loadInstancesCache(
  cacheFilePath: string
): InstancesCache | null {
  if (!fs.existsSync(cacheFilePath)) {
    return null;
  }

  try {
    console.log("📂 Wczytywanie cache z pliku...");
    const data = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));

    // Sprawdź wersję
    if (data.version !== CACHE_VERSION) {
      console.log("   ⚠️  Nieaktualna wersja cache, przebudowanie...\n");
      return null;
    }

    // Konwertuj obiekt z powrotem na Map
    const instances = new Map<string, GameInstance>(
      Object.entries(data.instances)
    );

    console.log(`   ✅ Wczytano ${instances.size} instancji z cache\n`);

    return {
      instances,
      timestamp: data.timestamp,
      version: data.version,
    };
  } catch (error) {
    console.error("   ❌ Błąd wczytywania cache:", error);
    return null;
  }
}

/**
 * Pobiera cache instancji (z pliku lub buduje nowy)
 */
export function getInstancesCache(
  scriptsPath: string,
  cacheFilePath: string,
  forceRebuild: boolean = false
): InstancesCache {
  if (!forceRebuild) {
    const cached = loadInstancesCache(cacheFilePath);
    if (cached) {
      return cached;
    }
  }

  const cache = buildInstancesCache(scriptsPath);
  saveInstancesCache(cache, cacheFilePath);

  return cache;
}
