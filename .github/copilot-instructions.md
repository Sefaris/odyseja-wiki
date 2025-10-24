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

- `**Uwaga:**` - dla ważnych informacji i ostrzeżeń o zbugowaniu gry/blokadzie questów
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
- `#### Zatopiona flota` → `#zatopiona-flota`
- `## Jharkendar` → `#jharkendar`

## Notatki

- Docsify automatycznie generuje slug-i z nagłówków
- Polskie znaki są wspierane w slug-ach
- Callout boxes wymagają dokładnej składni z `> [!TYPE]`
- Emoji są wspierane natywnie w Markdown i Docsify
- Zachowujemy spójność formatowania we wszystkich rozdziałach
