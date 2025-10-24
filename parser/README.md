# Gothic 2 Odyseja - Quest Parser

Parser do wydobywania nazw zadań (questów) z plików skryptowych moda Gothic 2: Odyseja.

## Instalacja

```bash
npm install
```

## Użycie

```bash
npm run parse
```

Parser przeszuka pliki:

- `LOG_Constants_Mattes.d` - zadania główne Odyssee I (Rozdziały 1-5)
- `LOG_Constants_Hoshi.d` - zadania z Addon
- `LOG_Constants_Yoly.d` - zadania z Addon i Gothic 2

Wyniki zostaną zapisane do `quests.json`.

## Struktura danych

Każde zadanie zawiera:

- `topicConstant` - nazwa stałej w kodzie (np. `TOPIC_PfeifeMarbod`)
- `name` - polska nazwa zadania widoczna w grze
- `chapter` - numer rozdziału (jeśli dostępny)
- `sourceFile` - nazwa pliku źródłowego
