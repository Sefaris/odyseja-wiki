# Copilot Instructions - Odyseja Wiki Standardization

## Projekt

Standaryzacja i refaktoring dokumentacji wiki dla moda "Gothic 2: Odyseja" - ujednolicenie formatowania, struktury i prezentacji zadań.

## Kontekst

Dokumentacja została przeniesiona z Google Docs do Markdown/Docsify, ale wymaga uporządkowania i standaryzacji:

1. Zadania mają niespójną strukturę i formatowanie
2. Nagłówki są na różnych poziomach (błędy formatowania, nie rzeczywista hierarchia)
3. Brak jasnej struktury rozdziałów i zadań
4. Ostrzeżenia są zapisane w sposób chaotyczny (CAPSLOCK, przypadkowe formatowanie)

## Standard Formatowania - Format Minimalistyczny

### Struktura pliku rozdziału

```markdown
# Rozdział [numer]

## Najważniejsze informacje

> Ostrzeżenie krytyczne o możliwości zbugowania gry lub ważna informacja.

**Wskazówki:**

- Wskazówka 1
- Wskazówka 2
- Wskazówka 3

## [Nazwa Lokacji]

Lista ogólnych informacji o lokacji (opcjonalnie).

## Zadania poboczne

Sekcja dla zadań pobocznych (opcjonalnie).

---

### [Nazwa Zadania]

Opis zadania i jego przebieg. Cała treść zachowana z oryginału, tylko uporządkowana pod jednym nagłówkiem.

**Uwaga:** Ważna informacja lub ostrzeżenie o możliwości zbugowania gry.

**Wskazówka:** Pomocna wskazówka.

---

### [Kolejne Zadanie]

...
```

### Zasady nagłówków

**WAŻNE:** Nie sugeruj się obecnymi poziomami nagłówków (###, ####, #####) - to błędy formatowania, nie rzeczywista hierarchia!

**Nowa hierarchia:**

1. `# Rozdział [numer]` - Tylko jeden na początku pliku (H1)
2. `## Sekcja` - Najważniejsze informacje, Nazwa Lokacji, Zadania poboczne, itp. (H2)
3. `### Nazwa Zadania` - **KAŻDE zadanie jest na poziomie H3** (H3)

**ZASADA:** Wszystkie zadania są na tym samym poziomie `###` - nie ma "pod-zadań" ani zagnieżdżeń. To, co wygląda jak pod-zadania w obecnych plikach, to po prostu błędy formatowania.

**Separatory:**

- Dodaj `---` między zadaniami (H3)
- **NIE dodawaj** `---` bezpośrednio po nagłówkach sekcji (H2) - Docsify automatycznie dodaje linię pod H2

### Formatowanie ostrzeżeń i wskazówek

**W sekcji "Najważniejsze informacje":**

- Krytyczne ostrzeżenia jako blockquote: `> Tekst ostrzeżenia`
- Wskazówki jako lista pod nagłówkiem `**Wskazówki:**`

**W treści zadań:**

- `**Uwaga:**` - dla ważnych informacji i ostrzeżeń o zbugowaniu gry/blokadzie questów
- `**Wskazówka:**` - dla pomocnych porad

### Co NIE robić

- **NIE dodawaj** nowych sekcji typu "Zleceniodawca", "Nagroda", "Powiązane zadania" - dane często nie są dostępne
- **NIE dodawaj** callout boxes, emoji, ikon - minimalistyczne podejście
- **NIE twórz** sztucznej hierarchii zadań - wszystkie zadania są równoważne (H3)
- **NIE zmieniaj** treści zadań - tylko uporządkuj formatowanie

### Cel

Uporządkować istniejącą treść bez dodawania nowych elementów. Zachować wszystko co jest, tylko w czystszej, bardziej czytelnej formie.

## Plan Działania

### Faza 1: Ujednolicenie nagłówków (AKTUALNA)

**Cel:** Uporządkować hierarchię nagłówków we wszystkich plikach rozdziałów, przygotować grunt pod wdrożenie nowego standardu.

**Zasady:**

1. Każdy plik zaczyna się od `# Rozdział [numer]` (tylko jeden H1)
2. Sekcje organizacyjne: `## Najważniejsze informacje`, `## Nazwa Lokacji`, `## Zadania poboczne` (H2)
3. Wszystkie zadania to `### Nazwa Zadania` (H3) - **NIE MA POD-ZADAŃ!**
4. Nie używamy H4, H5 i głębszych poziomów

**Kolejność pracy:**

- [ ] **Rozdział I** (`rozdzial_i.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział II** (`rozdzial_ii.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział III** (`rozdzial_iii.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział IV** (`rozdzial_iv.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział V** (`rozdzial_v.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział VI** (`rozdzial_vi.md`) - Analiza i ujednolicenie nagłówków
- [ ] **Rozdział VII** (`rozdzial_vii.md`) - Analiza i ujednolicenie nagłówków

**Proces dla każdego rozdziału:**

1. **Analiza struktury** - Przeczytać plik i zidentyfikować wszystkie nagłówki
2. **Mapowanie zadań** - Określić które są zadania (wszystkie na H3), które są sekcje organizacyjne (H2)
3. **Korekta poziomów** - Dostosować poziomy nagłówków zgodnie z zasadami
4. **Weryfikacja linków** - Sprawdzić czy linki wewnętrzne nadal działają po zmianie
5. **Commit zmian** - Zapisać zmiany z opisem co zostało zrobione

### Faza 2: Wdrożenie standardu formatowania

**Cel:** Uporządkować treść zadań zgodnie z minimalistycznym standardem.

**Kolejność pracy:**

- [ ] **Rozdział I** - Formatowanie treści według standardu
- [ ] **Rozdział II** - Formatowanie treści według standardu
- [ ] **Rozdział III** - Formatowanie treści według standardu
- [ ] **Rozdział IV** - Formatowanie treści według standardu
- [ ] **Rozdział V** - Formatowanie treści według standardu
- [ ] **Rozdział VI** - Formatowanie treści według standardu
- [ ] **Rozdział VII** - Formatowanie treści według standardu

**Proces dla każdego rozdziału:**

1. **Nagłówek rozdziału** - Dodać nagłówek H1 + sekcję "Najważniejsze informacje"
2. **Porządkowanie ostrzeżeń** - Zamienić CAPSLOCK na **KRYTYCZNE:**, **Uwaga:**, **Wskazówka:**
3. **Czyszczenie treści** - Usunąć zbędne formatowanie, zachować treść
4. **Weryfikacja** - Sprawdzić poprawność i czytelność
5. **Commit zmian** - Zapisać zmiany

### Faza 3: Weryfikacja i optymalizacja

**Cel:** Upewnić się, że wszystko działa poprawnie i dokumentacja jest spójna.

- [ ] Testy wszystkich linków wewnętrznych
- [ ] Testy wszystkich linków międzyplikowych
- [ ] Sprawdzenie spójności formatowania
- [ ] Poprawki i udoskonalenia

## Zasady Linków (zachowane z poprzedniej wersji)

### Linki wewnętrzne (w tym samym pliku)

```markdown
[Nazwa zadania](#slug-z-małych-liter)
```

### Linki międzyplikowe (między rozdziałami)

```markdown
[Nazwa zadania](sekcje/zadania/rozdzial_X?id=slug-zadania)
```

### Generowanie slug-ów

- Małe litery
- Spacje → myślniki
- Polskie znaki zachowane (ą, ę, ć, ł, ń, ó, ś, ź, ż)
- Usunięcie znaków specjalnych (/,:)

**Przykłady:**

- `## Wieści z Vengardu` → `#wieści-z-vengardu`
- `## Zatopiona flota` → `#zatopiona-flota`

## Notatki

- Docsify automatycznie generuje slug-i z nagłówków
- Polskie znaki są wspierane w slug-ach
- Callout boxes wymagają dokładnej składni z `> [!TYPE]`
- Emoji są wspierane natywnie w Markdown i Docsify
- Zachowujemy spójność formatowania we wszystkich rozdziałach
