# Copilot Instructions - Odyseja Wiki Refactoring

## Projekt

Refaktoring dokumentacji wiki dla moda "Gothic 2: Odyseja" - naprawa linków wewnętrznych i zewnętrznych.

## Kontekst

Dokumentacja została przeniesiona z Google Docs do Markdown/Docsify. Linki wymagają poprawy:

1. Wewnętrzne linki używają nieprawidłowego formatu Google Docs (`#h.xxxxxxxxx`)
2. Zewnętrzne linki zawierają niepotrzebne Google redirecty
3. Linki YouTube powinny być osadzone jako iframe

## Zasady formatowania linków

### 1. Linki wewnętrzne (w tym samym pliku)

**PRZED:** `[Nazwa zadania](#h.xxxxxxxxx)`  
**PO:** `[Nazwa zadania](#slug-z-małych-liter-myślniki)`

**Bez cudzysłowów!** Prawidłowo: `[Wieści z Vengardu](#wieści-z-vengardu)`

### 2. Linki międzyplikowe (między rozdziałami)

**WAŻNE:** Docsify wymaga specjalnej składni z parametrem `?id=` dla linków międzyplikowych!

**PRZED:** `[Zadanie](#h.xxxxxxxxx)` (w innym rozdziale)  
**PO:** `[Zadanie](sekcje/zadania/rozdzial_X?id=slug-zadania)`

**Przykłady:**

- `[Wiadomość dla Lorda Baldwina](sekcje/zadania/rozdzial_iii?id=wiadomość-dla-lorda-baldwina)`
- `[Admirał](sekcje/zadania/rozdzial_iii?id=admirał)`
- `[Nowicjusz za kratami](sekcje/zadania/rozdzial_vi?id=nowicjusz-za-kratami)`

**UWAGA:** Używamy `?id=` zamiast `#` dla linków międzyplikowych!

### 3. Generowanie slug-ów

- Małe litery
- Spacje → myślniki
- Polskie znaki zachowane (ą, ę, ć, ł, ń, ó, ś, ź, ż)
- Usunięcie znaków specjalnych (/,:)

**Przykłady:**

- `# Wieści z Vengardu` → `#wieści-z-vengardu`
- `## Zatopiona flota/Cenny olej:` → `#zatopiona-flotacenny-olej`
- `## Zięć dla Johana` → `#zięć-dla-johana`

### 4. Google URL redirecty

**PRZED:**

```markdown
[FILMIK](https://www.google.com/url?q=https://youtu.be/Zw1dMh3chms&sa=D&source=editors&ust=1761140639302650&usg=AOvVaw3HryXSQ3hdm163xt447XjO)
```

**PO (YouTube - iframe):**

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/Zw1dMh3chms"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
```

**PO (Imgur/inne obrazki - bezpośredni link):**

````markdown
**PO (Imgur/inne obrazki - bezpośredni link):**

```markdown
[LOKALIZACJA](https://i.imgur.com/q5FtSNd.png)
```
````

### 4.1. Linki inline (w tekście)

Jeśli link do YouTube lub obrazka jest częścią zdania (np. "jak widać na [tym filmie](...)"), powinien pozostać standardowym linkiem Markdown. **Nie zamieniamy go na iframe!**

**PRZED (niepoprawnie, ale po usunięciu redirecta):**

```markdown
...jak widać na

<iframe ...></iframe>
```

**PO (poprawnie):**

```markdown
...jak widać na [tym filmie](https://www.youtube.com/watch?v=VIDEO_ID).
```

### 5. Konwersja YouTube URL

````

### 4.1. Linki inline (w tekście)

Jeśli link do YouTube lub obrazka jest częścią zdania (np. "jak widać na [tym filmie](...)"), powinien pozostać standardowym linkiem Markdown. **Nie zamieniamy go na iframe!**

**PRZED (niepoprawnie, ale po usunięciu redirecta):**

```markdown
...jak widać na
<iframe ...></iframe>
````

**PO (poprawnie):**

```markdown
...jak widać na [tym filmie](https://www.youtube.com/watch?v=VIDEO_ID).
```

### 5. Konwersja YouTube URL

- YouTube watch: `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`
- YouTube short: `https://youtu.be/VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`
- Usunąć parametry `%3D` i inne URL encoding

## Struktura plików

```
docs/sekcje/zadania/
├── rozdzial_i.md    (Athanos - Rozdział I)
├── rozdzial_ii.md   (Statek, wyspy - Rozdział II)
├── rozdzial_iii.md  (Khorinis - Rozdział III)
├── rozdzial_iv.md   (Varant, Jarkendar - Rozdział IV)
├── rozdzial_v.md    (Khorinis cd., Aszdod - Rozdział V)
├── rozdzial_vi.md   (Vengard, Nordmar - Rozdział VI)
└── rozdzial_vii.md  (Królestwo Smoka - Rozdział VII)
```

## Mapowanie zadań między rozdziałami

### Rozdział I → Rozdział III

- `Wiadomość dla Lorda Baldwina` → `rozdzial_iii.md#wiadomość-dla-lorda-baldwina`

### Rozdział I → Rozdział V

- `Ugar` (wzmianka) → `rozdzial_v.md` (pełne zadania w rozdziale IV/V)

### Rozdział II → Rozdział III

- `Tamor` → niektóre zadania kontynuowane w `rozdzial_iii.md`
- `Khorus` → zadania na `rozdzial_ii.md`

## Plan działania (Todo List)

**STRATEGIA:** ✅ Google redirecty wyczyszczone! Teraz konwersja linków #h.xxx w pozostałych rozdziałach.

- [x] **Rozdział I** - Naprawione linki wewnętrzne i międzyplikowe + Google redirecty
- [x] **Rozdział II** - Konwersja linków (#h.xxx → slug) + linki międzyplikowe + Google redirecty
- [x] **Google Redirecty** - ✅ UKOŃCZONE! Wszystkie YouTube/Imgur linki oczyszczone
  - [x] Rozdział I - Google redirecty
  - [x] Rozdział II - Google redirecty
  - [x] Rozdział III - Google redirecty
  - [x] Rozdział IV - Google redirecty
  - [x] Rozdział V - brak linków Google
  - [x] Rozdział VI - Google redirecty
  - [x] Rozdział VII - brak linków Google
- [x] **Rozdział III** - Konwersja linków (#h.xxx → slug)
- [x] **Rozdział IV** - Konwersja linków
- [x] **Rozdział V** - Konwersja linków
- [x] **Rozdział VI** - Konwersja linków
- [x] **Rozdział VII** - Konwersja linków
- [x] **Weryfikacja** - Testy wszystkich linków

## Przykłady wykonanych zmian

### Rozdział I - Kompletne poprawki:

1. ✅ `[Wieści z Vengardu](#h.vw64zshzlmal)` → `[Wieści z Vengardu](#wieści-z-vengardu)`
2. ✅ `[Zaginiona fajka](#h.llnopoi7nqt)` → `[Zaginiona fajka](#zaginiona-fajka)`
3. ✅ `[Wiadomość dla Lorda Baldwina](#h.b15vrz91774)` → `[Wiadomość dla Lorda Baldwina](rozdzial_iii.md#wiadomość-dla-lorda-baldwina)`

## Notatki

- Docsify automatycznie generuje slug-i z nagłówków
- Polskie znaki są wspierane w slug-ach
- Cudzysłowy w linkach są **NIEPOTRZEBNE** - usuwamy je
- YouTube iframe można dodać bezpośrednio w Markdown
- Docsify renderuje HTML poprawnie
