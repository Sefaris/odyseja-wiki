# Copilot Instructions - Odyseja Wiki Standardization

## Projekt

Standaryzacja i refaktoring dokumentacji wiki dla moda "Gothic 2: Odyseja" - ujednolicenie formatowania, struktury i prezentacji zadań.

## Kontekst

Dokumentacja została przeniesiona z Google Docs do Markdown/Docsify, ale wymaga uporządkowania i standaryzacji:

1. Zadania mają niespójną strukturę i formatowanie
2. Nagłówki są na różnych poziomach (błędy formatowania, nie rzeczywista hierarchia)
3. Brak jasnej struktury rozdziałów i zadań
4. Ostrzeżenia są zapisane w sposób chaotyczny (CAPSLOCK, przypadkowe formatowanie)

## Standard Formatowania - Format Hierarchiczny

### Struktura pliku rozdziału

```markdown
# Rozdział [numer]

## Najważniejsze informacje

> Ostrzeżenie krytyczne o możliwości zbugowania gry lub ważna informacja.

**Wskazówki:**

- Wskazówka 1
- Wskazówka 2
- Wskazówka 3

## [Nazwa Wyspy]

### Najważniejsze informacje

Informacje specyficzne dla danej wyspy (opcjonalnie).

#### [Nazwa Zadania]

Opis zadania i jego przebieg. Cała treść zachowana z oryginału, tylko uporządkowana pod jednym nagłówkiem.

**Uwaga:** Ważna informacja lub ostrzeżenie o możliwości zbugowania gry.

**Wskazówka:** Pomocna wskazówka.

#### [Kolejne Zadanie]

...

## [Kolejna Wyspa]

#### [Zadanie na kolejnej wyspie]

...
```

### Zasady nagłówków

**WAŻNE:** Nie sugeruj się obecnymi poziomami nagłówków (###, ####, #####) - to błędy formatowania, nie rzeczywista hierarchia!

**Nowa hierarchia:**

1. `# Rozdział [numer]` - Tylko jeden na początku pliku (H1)
2. `## Sekcja` - Najważniejsze informacje (ogólne dla rozdziału) ORAZ Nazwa Wyspy (H2)
3. `### Najważniejsze informacje` - Informacje specyficzne dla danej wyspy (opcjonalnie, pod H2 z nazwą wyspy) (H3)
4. `#### Nazwa Zadania` - Każde zadanie jest na poziomie H4, zagnieżdżone pod wyspą (H4)

**ZASADA:** Zadania są grupowane hierarchicznie pod wyspami. Struktura to: Rozdział → Wyspa → Zadania.

**Separatory:**

- **NIE używamy** separatorów `---` między zadaniami - hierarchia nagłówków jasno określa strukturę
- Docsify automatycznie dodaje linię pod H2

### Formatowanie ostrzeżeń i wskazówek

**W sekcji "Najważniejsze informacje":**

- Krytyczne ostrzeżenia jako blockquote: `> Tekst ostrzeżenia`
- Wskazówki jako lista pod nagłówkiem `**Wskazówki:**`

**W treści zadań:**

- `> **Uwaga:**` - dla ważnych informacji i ostrzeżeń o zbugowaniu gry/blokadzie questów (blockquote)
- `**Wskazówka:**` - dla pomocnych porad

### Co NIE robić

- **NIE dodawaj** nowych sekcji typu "Zleceniodawca", "Nagroda", "Powiązane zadania" - dane często nie są dostępne
- **NIE dodawaj** callout boxes, emoji, ikon - minimalistyczne podejście
- **NIE zmieniaj** treści zadań - tylko uporządkuj formatowanie
- **NIE mieszaj** zadań z różnych wysp - zachowuj hierarchię geograficzną

### Cel

Uporządkować istniejącą treść bez dodawania nowych elementów. Zachować wszystko co jest, tylko w czystszej, bardziej czytelnej formie.

## Plan Działania

### Faza 1: Ujednolicenie nagłówków (UKOŃCZONA ✅)

**Cel:** Uporządkować hierarchię nagłówków we wszystkich plikach rozdziałów, przygotować grunt pod wdrożenie nowego standardu.

**Zasady:**

1. Każdy plik zaczyna się od `# Rozdział [numer]` (tylko jeden H1)
2. `## Najważniejsze informacje` - sekcja ogólna na początku rozdziału (H2)
3. `## Nazwa Wyspy` - każda wyspa/lokacja jako osobna sekcja (H2)
4. `### Najważniejsze informacje` - opcjonalna sekcja dla informacji specyficznych dla wyspy (H3, pod H2 z nazwą wyspy)
5. `#### Nazwa Zadania` - wszystkie zadania na poziomie H4, zagnieżdżone pod wyspą (H4)
6. Nie używamy H5 i głębszych poziomów

**Kolejność pracy:**

- [x] **Rozdział I** (`rozdzial_i.md`) - ✅ Ukończono
- [x] **Rozdział II** (`rozdzial_ii.md`) - ✅ Ukończono
- [x] **Rozdział III** (`rozdzial_iii.md`) - ✅ Ukończono
- [x] **Rozdział IV** (`rozdzial_iv.md`) - ✅ Ukończono
- [x] **Rozdział V** (`rozdzial_v.md`) - ✅ Ukończono
- [x] **Rozdział VI** (`rozdzial_vi.md`) - ✅ Ukończono
- [x] **Rozdział VII** (`rozdzial_vii.md`) - ✅ Ukończono

**Status:** Wszystkie 7 rozdziałów mają poprawną hierarchię nagłówków:

- Każdy rozdział ma dokładnie jeden H1 (tytuł rozdziału)
- Wszystkie wyspy/lokacje są na poziomie H2
- Sekcje "Najważniejsze informacje" i "Zadania główne i powiązane" są na poziomie H3
- Wszystkie zadania są na poziomie H4 (struktura płaska, bez H5/H6)

**Proces dla każdego rozdziału:**

1. **Analiza struktury** - Przeczytać plik i zidentyfikować wszystkie nagłówki oraz lokacje
2. **Mapowanie geograficzne** - Pogrupować zadania według wysp/lokacji
3. **Utworzenie hierarchii** - Struktura: H1 (Rozdział) → H2 (Wyspa) → H4 (Zadanie)
4. **Korekta poziomów** - Dostosować poziomy nagłówków zgodnie z zasadami
5. **Weryfikacja linków** - Sprawdzić czy linki wewnętrzne nadal działają po zmianie
6. **Commit zmian** - Zapisać zmiany z opisem co zostało zrobione

### Faza 2: Wdrożenie standardu formatowania (UKOŃCZONA ✅)

**Cel:** Uporządkować treść zadań zgodnie z minimalistycznym standardem.

**Kolejność pracy:**

- [x] **Rozdział I** - ✅ Ukończono (już miał dobry standard)
- [x] **Rozdział II** - ✅ Ukończono (już miał dobry standard)
- [x] **Rozdział III** - ✅ Ukończono (poprawiono CAPSLOCK → normalny tekst z **Uwaga:**)
- [x] **Rozdział IV** - ✅ Ukończono (poprawiono CAPSLOCK → **Uwaga:**)
- [x] **Rozdział V** - ✅ Ukończono (poprawiono CAPSLOCK → **Uwaga:**)
- [x] **Rozdział VI** - ✅ Ukończono (już miał dobry standard)
- [x] **Rozdział VII** - ✅ Ukończono (już miał dobry standard)

**Status:** Wszystkie rozdziały mają teraz czysty, spójny format:

- Ostrzeżenia w formacie `> **Uwaga:**` (blockquote) zamiast CAPSLOCK
- Blockquotes dla krytycznych ostrzeżeń w sekcjach "Najważniejsze informacje"
- Spójne formatowanie wskazówek jako listy punktowane
- Zachowana cała treść, tylko uporządkowana
- ✅ **Dodatkowa konwersja:** Wszystkie `**Uwaga:**` zamienione na `> **Uwaga:**` dla lepszej widoczności (6 instancji w Rozdziałach I, IV, V)

**Proces dla każdego rozdziału:**

1. **Nagłówek rozdziału** - Dodać nagłówek H1 + sekcję "Najważniejsze informacje"
2. **Porządkowanie ostrzeżeń** - Zamienić CAPSLOCK na **KRYTYCZNE:**, **Uwaga:**, **Wskazówka:**
3. **Czyszczenie treści** - Usunąć zbędne formatowanie, zachować treść
4. **Weryfikacja** - Sprawdzić poprawność i czytelność
5. **Commit zmian** - Zapisać zmiany

### Faza 3: Weryfikacja i optymalizacja (UKOŃCZONA ✅)

**Cel:** Upewnić się, że wszystko działa poprawnie i dokumentacja jest spójna.

**Status weryfikacji linków:**

- [x] **Testy linków międzyplikowych** - ✅ Ukończono

  - Format `sekcje/zadania/rozdzial_X?id=slug` zweryfikowany jako poprawny
  - Wszystkie linki używają spójnego formatu
  - Znaleziono i poprawiono 1 błędny link: `rozdzial_i?id=pierścień-szybkości` → `rozdzial_ii?id=pierścień-szybkości`

- [x] **Testy linków wewnętrznych** - ✅ Ukończono

  - Rozdział I: Znaleziono i poprawiono nagłówek `Zatopiona flota/Cenny olej:` → `Zatopiona flota / Cenny olej`
  - Rozdział II-VII: Zweryfikowano - brak problemów z nagłówkami
  - Rozdział IV: Poprawiono błędny link międzyplikowy
  - Wszystkie rozdziały używają poprawnych slug-ów dla linków wewnętrznych

- [x] **Sprawdzenie spójności formatowania** - ✅ Ukończono

  - Wszystkie rozdziały używają tego samego standardu
  - Blockquotes: `> **Uwaga:**` stosowane konsekwentnie (6 instancji w Rozdziałach I, IV, V)
  - Listy i nagłówki: spójne formatowanie we wszystkich rozdziałach
  - Hierarchia H1 → H2 → H3 → H4 poprawna (zero H5/H6)

- [x] **Poprawki i udoskonalenia** - ✅ Ukończono
  - Wszystkie znalezione problemy zostały naprawione
  - Dokumentacja gotowa do użycia

**Znalezione i poprawione problemy:**

1. Nagłówek z problematycznymi znakami: `#### Zatopiona flota/Cenny olej:` (slash bez spacji + dwukropek) → poprawiono na `#### Zatopiona flota / Cenny olej`
2. Błędny link międzyplikowy wskazujący na zły rozdział: `rozdzial_i?id=pierścień-szybkości` → `rozdzial_ii?id=pierścień-szybkości`

## PODSUMOWANIE PROJEKTU STANDARYZACJI

### ✅ Fazy 1-3 ukończone, Fazy 4-5 do realizacji

**Faza 1: Ujednolicenie nagłówków** (7/7 rozdziałów) ✅

- Każdy rozdział ma dokładnie jeden H1
- Wszystkie wyspy/lokacje na poziomie H2
- Zadania na poziomie H4 (struktura płaska)
- Zero H5/H6 w całej dokumentacji

**Faza 2: Wdrożenie standardu formatowania** (7/7 rozdziałów) ✅

- CAPSLOCK → normalne formatowanie z `> **Uwaga:**`
- Wszystkie ostrzeżenia w formacie blockquote
- Spójne listy `**Wskazówki:**`
- 6 ostrzeżeń zaktualizowanych do blockquote

**Faza 3: Weryfikacja i optymalizacja** ✅

- 2 problemy znalezione i naprawione
- Wszystkie linki zweryfikowane
- Format spójny we wszystkich plikach
- Podstawowa standaryzacja zakończona

**Faza 4: Integracja mediów** ⏳

- Konwersja linków do YouTube → iframe embedy
- Konwersja linków do grafik → `<img>` lub `![]()`
- Bezpośrednie wyświetlanie treści multimedialnych

**Faza 5: Finalna weryfikacja i ujednolicenie** ⏳

- Kontrola sekcji "Najważniejsze informacje"
- Ujednolicenie oznaczeń (Uwaga, Wskazówka, KRYTYCZNE)
- Finalna spójność dokumentacji

### Faza 4: Integracja mediów (⏳ Do wykonania)

**Cel:** Przepisać wszystkie zadania zawierające linki do grafik i filmów, aby treści multimedialne były wyświetlane bezpośrednio w dokumentacji.

**Zakres pracy:**

- [ ] **Identyfikacja mediów** - Znaleźć wszystkie linki do:

  - YouTube (embedy iframe)
  - Grafiki zewnętrzne (Imgur, inne)
  - Linki do obrazków w formie URL

- [ ] **Konwersja linków na embedy** - Zamienić:

  - Linki do YouTube → iframe embedy (już częściowo zrobione)
  - Linki do obrazków → znaczniki `<img>` lub `![]()`
  - Tekstowe linki do grafik → bezpośrednie wyświetlanie

- [ ] **Weryfikacja wyświetlania** - Sprawdzić:
  - Czy wszystkie embedy działają poprawnie
  - Czy obrazki są responsywne
  - Czy nie ma zepsutych linków do mediów

**Kolejność pracy:**

- [ ] Rozdział I
- [ ] Rozdział II
- [ ] Rozdział III
- [ ] Rozdział IV
- [ ] Rozdział V
- [ ] Rozdział VI
- [ ] Rozdział VII

**Proces dla każdego rozdziału:**

1. **Skanowanie** - Znaleźć wszystkie linki do YouTube i grafik
2. **Konwersja** - Zamienić na odpowiednie embedy/tagi
3. **Testowanie** - Sprawdzić czy wszystko się wyświetla
4. **Commit zmian** - Zapisać zmiany

### Faza 5: Finalna weryfikacja i ujednolicenie (⏳ Do wykonania)

**Cel:** Zapewnić pełną spójność dokumentacji we wszystkich rozdziałach.

**Zakres pracy:**

- [ ] **Weryfikacja sekcji "Najważniejsze informacje"** - Sprawdzić:

  - Czy wszystkie rozdziały mają tę sekcję
  - Czy ostrzeżenia krytyczne są w formacie blockquote `> **KRYTYCZNE:**` lub `> Tekst`
  - Czy wskazówki są w formacie listy pod `**Wskazówki:**`
  - Czy nie ma duplikatów lub sprzecznych informacji

- [ ] **Weryfikacja oznaczeń** - Ujednolicić:

  - `> **Uwaga:**` - dla ważnych ostrzeżeń o zbugowaniu/blokadzie questów
  - `> **KRYTYCZNE:**` - dla krytycznych informacji (opcjonalnie)
  - `**Wskazówka:**` - dla pomocnych porad (w treści zadań)
  - `**Wskazówki:**` - dla list porad (w sekcjach informacyjnych)

- [ ] **Weryfikacja kompletności** - Sprawdzić:
  - Czy nie brakuje istotnych informacji
  - Czy struktura jest logiczna i czytelna
  - Czy nie ma niedokończonych sekcji

**Kolejność pracy:**

- [ ] Rozdział I
- [ ] Rozdział II
- [ ] Rozdział III
- [ ] Rozdział IV
- [ ] Rozdział V
- [ ] Rozdział VI
- [ ] Rozdział VII

**Proces dla każdego rozdziału:**

1. **Przegląd sekcji głównej** - "Najważniejsze informacje" i wskazówki
2. **Kontrola oznaczeń** - Ujednolicenie formatowania ostrzeżeń
3. **Weryfikacja treści** - Kompletność i spójność informacji
4. **Finalna korekta** - Ostatnie poprawki
5. **Commit zmian** - Zapisać zmiany

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
- `#### Zatopiona flota` → `#zatopiona-flota`
- `## Jharkendar` → `#jharkendar`

## Notatki

- Docsify automatycznie generuje slug-i z nagłówków
- Polskie znaki są wspierane w slug-ach
- Callout boxes wymagają dokładnej składni z `> [!TYPE]`
- Emoji są wspierane natywnie w Markdown i Docsify
- Zachowujemy spójność formatowania we wszystkich rozdziałach
