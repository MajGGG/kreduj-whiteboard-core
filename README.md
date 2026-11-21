# Kreduj Whiteboard Core

Samodzielna, otwartoźródłowa demonstracja interaktywnej tablicy edukacyjnej inspirowana koncepcją Kreduj. Projekt **nie jest** wydzielonym kodem prywatnej aplikacji Kreduj i nie zawiera jej infrastruktury, użytkowników ani sekretów.

## Co działa

- Pióro, gumka, linia, prostokąt, koło, tekst i proste wzory zapisywane jako tekst Unicode.
- Zaznaczanie i przeciąganie obiektów oraz usuwanie klawiszem Delete.
- Cofanie/ponawianie (do 70 operacji), automatyczny zapis w `localStorage`.
- Import/eksport JSON oraz eksport SVG.
- Responsywny interfejs po polsku, przykładowa lekcja o twierdzeniu Pitagorasa.
- Brak zewnętrznych zależności i połączeń sieciowych.

## Co jest tylko demonstracją

Panel „Uczestnicy” pokazuje przykładowe osoby. **Nie ma** logowania, sieciowej synchronizacji, real-time collaboration, współdzielonych sesji ani obsługi LaTeX. Przycisk „Udostępnij plik” pobiera JSON, a nie tworzy wspólnego linku. To celowo uczciwy MVP.

## Uruchomienie

Otwórz `index.html` w nowoczesnej przeglądarce lub uruchom lokalny serwer:

```bash
python3 -m http.server 8000
```

Przejdź do `http://localhost:8000`.

## Architektura i bezpieczeństwo

Bez frameworka: `index.html` (widok), `style.css` (wygląd), `script.js` (logika edytora SVG). Dane pozostają w przeglądarce. Import JSON ma ograniczenie rozmiaru i walidację typów. Tekst w SVG jest dodawany przez `textContent`, nie `innerHTML`.

Przed użyciem komercyjnym potrzebne są m.in. dostępność, automatyczne testy e2e, autentykacja i autoryzacja sesji oraz bezpieczna synchronizacja danych.

## Kierunek rozwoju

1. Ekstrakcja logiki edytora do biblioteki TypeScript z publicznym API.
2. Testy jednostkowe i end-to-end.
3. Osobny serwer sesji współdzielonych, CRDT/Yjs, autoryzacja pokojów.
4. Prawdziwe kursory i presence użytkowników.
5. Wsparcie LaTeX/MathJax i importu PDF.

## Licencja

MIT — zobacz [LICENSE](LICENSE).
