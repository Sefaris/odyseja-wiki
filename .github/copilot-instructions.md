# Edycja wiki Odysei

Strona używa Docusaurusa. Treść solucji znajduje się w docs/sekcje/zadania, teleporty w docs/sekcje/informacje-dodatkowe, a strona główna w docs/README.mdx.

- Zachowuj całą treść i sens opisów zadań. Nie dopisuj niezweryfikowanych informacji o grze.
- Tytuł rozdziału jest w front matter. Hierarchia: H2 lokalizacja, H3 informacje lub grupa zadań, H4 nazwa zadania. Nie używaj H5 ani H6.
- Zachowuj jawne identyfikatory nagłówków {#id}; każdy musi być unikalny na stronie. Linkuj do istniejącej strony i zadania.
- Zwykłą treść zapisuj w .md, pliki używające komponentu Video w .mdx. Format jest wykrywany według rozszerzenia.
- Ostrzeżenia pozostają cytatami > **Uwaga:**, wskazówki tekstem lub listami. Nie dodawaj do treści zadań ramek, ikon, dodatkowych metadanych ani separatorów między zadaniami.
- Obrazy trzymaj lokalnie; Markdown automatycznie obsługuje powiększanie. Video zapewnia przycisk odtwarzania i odnośnik do YouTube.
- Autorzy są na stronie głównej. Materiał źródłowy dodaje szablon na podstawie ścieżki dokumentu. Linki zewnętrzne otwierają się w nowej karcie.
- Przed zakończeniem uruchom pnpm check. Skrypt check-quest-coverage.js jest opcjonalny i wymaga osobno dostarczonego parser/quests.json; historyczny raport nie jest wynikiem aktualnej kontroli.
- Operacje Git i publikację wykonuje właściciel repozytorium.
