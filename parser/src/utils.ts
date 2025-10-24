import * as fs from "fs";
import * as path from "path";

/**
 * Rekurencyjnie znajdź wszystkie pliki z danym rozszerzeniem
 */
export function findFilesRecursive(dir: string, extension: string): string[] {
  const results: string[] = [];

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results.push(...findFilesRecursive(filePath, extension));
      } else if (file.endsWith(extension)) {
        results.push(filePath);
      }
    }
  } catch (error) {
    // Ignoruj błędy dostępu do katalogów
  }

  return results;
}

/**
 * Cache dla plików
 */
const fileCache = new Map<string, string>();

/**
 * Czyta plik (z cache)
 */
export function readFile(filePath: string): string {
  if (!fileCache.has(filePath)) {
    fileCache.set(filePath, fs.readFileSync(filePath, "utf-8"));
  }
  return fileCache.get(filePath)!;
}

/**
 * Czyści cache plików
 */
export function clearFileCache(): void {
  fileCache.clear();
}

/**
 * Usuwa komentarze z kodu Daedalus
 * - Komentarze jednoliniowe: //
 * - Komentarze wieloliniowe: /* *\/ (prawdziwe, nie //**)
 */
export function removeComments(content: string): string {
  // Usuń komentarze wieloliniowe /* ... */
  // UWAGA: Nie usuwamy //** bo to nie jest prawdziwy komentarz wieloliniowy
  // Szukamy wzorca: nie-slash + /* + cokolwiek + */
  let cleaned = content.replace(/(^|[^/])\/\*[\s\S]*?\*\//g, "$1");

  // Usuń komentarze jednoliniowe // (usuwaj tylko komentarz, nie całą linię)
  const lines = cleaned.split("\n");
  const activeLines = lines.map((line) => {
    const trimmed = line.trim();

    // Jeśli linia zaczyna się od //, usuń całą linię
    if (trimmed.startsWith("//")) {
      return "";
    }

    // Jeśli linia ma komentarz na końcu, usuń tylko komentarz
    const commentIndex = line.indexOf("//");
    if (commentIndex !== -1) {
      return line.substring(0, commentIndex);
    }

    return line;
  });

  return activeLines.join("\n");
}

/**
 * Ekstrauje wartość z pola w instancji
 * Przykład: name = "Harald"; -> "Harald"
 */
export function extractFieldValue(
  content: string,
  fieldName: string
): string | null {
  // Pattern: fieldName = wartość; lub fieldName = "wartość";
  const pattern = new RegExp(
    `${fieldName}\\s*=\\s*(?:"([^"]+)"|([^;\\s]+))\\s*;`,
    "i"
  );

  const match = content.match(pattern);
  if (match) {
    return match[1] || match[2]; // match[1] dla stringów w "", match[2] dla bez
  }

  return null;
}

/**
 * Znajduje całą funkcję zawierającą dany pattern
 * Używa liczenia nawiasów klamrowych {} do znalezienia granic funkcji
 */
export function extractFunctionContaining(
  content: string,
  searchPattern: string | RegExp
): string | null {
  const pattern =
    typeof searchPattern === "string"
      ? new RegExp(searchPattern, "i")
      : searchPattern;

  const match = content.match(pattern);
  if (!match) {
    return null;
  }

  // Znajdź początek funkcji (szukaj wstecz do "func")
  let functionStart = match.index!;

  // Szukaj "func" przed znalezionym patternem
  const beforeMatch = content.substring(0, match.index!);
  const funcPattern = /func\s+(?:void|VOID|int|INT)?\s+\w+[^{]*{/gi;
  let lastFuncMatch;
  let funcMatch;

  while ((funcMatch = funcPattern.exec(beforeMatch)) !== null) {
    lastFuncMatch = funcMatch;
  }

  if (!lastFuncMatch) {
    return null;
  }

  functionStart = lastFuncMatch.index!;
  const openBracePos = content.indexOf("{", functionStart);

  if (openBracePos === -1) {
    return null;
  }

  // Znajdź zamknięcie funkcji licząc nawiasy klamrowe
  let braceCount = 0;
  let functionEnd = openBracePos;

  for (let i = openBracePos; i < content.length; i++) {
    if (content[i] === "{") braceCount++;
    if (content[i] === "}") braceCount--;

    if (braceCount === 0) {
      functionEnd = i;
      break;
    }
  }

  return content.substring(openBracePos + 1, functionEnd);
}
