# Edycja wiki Odysei

Strona używa Docusaurusa. Treść solucji znajduje się w docs/sekcje/zadania, teleporty w docs/sekcje/informacje-dodatkowe, a strona główna w docs/README.mdx.

- Zachowuj całą treść i sens opisów zadań. Nie dopisuj niezweryfikowanych informacji o grze.
- Tytuł rozdziału jest w front matter. Hierarchia: H2 lokalizacja, H3 informacje lub grupa zadań, H4 nazwa zadania. Nie używaj H5 ani H6.
- Zachowuj jawne identyfikatory nagłówków {#id}; każdy musi być unikalny na stronie. Linkuj do istniejącej strony i zadania.
- Rozdziały w lewym menu rozwijają lokalizacje H2 i grupy H3. `sidebars.js` pobiera ich nazwy i kotwice z dokumentów; nie utrzymuj osobnej listy wysp i nie dodawaj do tego menu pojedynczych zadań H4.
- Zwykłą treść zapisuj w .md, pliki używające komponentu Video w .mdx. Format jest wykrywany według rozszerzenia.
- Ostrzeżenia zapisuj jako `:::warning Uwaga`, wskazówki jako `:::tip Wskazówka`, a warunki i dodatkowe informacje jako `:::info Informacja`. Zachowuj listy i media we właściwym wyróżnieniu. Cytatów `>` używaj wyłącznie dla rzeczywistych cytatów, nie dla uwag autora. Nie dodawaj separatorów między zadaniami.
- Obrazy trzymaj lokalnie; Markdown automatycznie obsługuje powiększanie. Video zapewnia przycisk odtwarzania i odnośnik do YouTube.
- Autorzy są na stronie głównej. Materiał źródłowy dodaje szablon na podstawie ścieżki dokumentu. Linki zewnętrzne otwierają się w nowej karcie.
- Przed zakończeniem uruchom pnpm check. Skrypt check-quest-coverage.js jest opcjonalny i wymaga osobno dostarczonego parser/quests.json; historyczny raport nie jest wynikiem aktualnej kontroli.
- Operacje Git i publikację wykonuje właściciel repozytorium.

## Wspólny układ menu i wyróżnień

- Menu: Strona główna, Solucja i pozostałe działy z zadaniami, na końcu Informacje dodatkowe (konfiguracja, porady, teleporty, mapy i spisy). Nie twórz pustej kategorii i zachowuj rozwijane lokacje rozdziałów.
- Ostrzeżenia: `:::warning Uwaga`; porady: `:::tip Wskazówka`; warunki i fakty: `:::info Informacja`. Dobieraj rodzaj po znaczeniu, nie tylko po dawnej etykiecie. Krytyczną blokadę gry można oznaczyć `:::danger Uwaga`.
- Po otwarciu i przed zamknięciem ramki `:::` zostaw pusty wiersz. Nie powtarzaj tytułu jako „UWAGA:” w treści. Zachowuj listy, warianty, liczby i powiązane media; nie obejmuj uwagą dalszego opisu zadania.
- Cytaty `>` służą autentycznym wypowiedziom lub listom z gry. Nie używaj ich do wyróżniania instrukcji autora, nagród ani opisów strony. Ramki działają również w zwykłych `.md` i nie wymagają MDX.
- README repozytorium i strona główna używają wspólnej sekcji „Jak edytować wiki” z bazy. Instrukcja edycji jest jednakowa we wszystkich wiki; nazwa, adres, materiały i autorzy dotyczą danego moda. Zachowuj zgodne osoby i role w obu sekcjach „Autorzy”; nie kopiuj autorstwa z przykładowego NB.
- Nagłówek strony głównej pokazuje heroDescription z site-profile.js: jedno zdanie o fabule lub charakterze danego moda na podstawie jego opisu na Sefaris. Zachowuj wspólny komponent HomeHeader i styl opisu; nie przenoś opisu innego moda ani autorstwa do nagłówka.

- Spis „Na tej stronie” używa wspólnego `src/theme/TOCItems/`: po dojściu do końca przewijanej strony zaznacza ostatnią sekcję, a przy przewijaniu w górę wraca do pozycji czytania. Zachowuj identyczny mechanizm w bazie i wiki; test regresji jest częścią `pnpm check`.
