# Kreduj Whiteboard Core

[English](#english) · [Polski](#polski)

## English

**Kreduj Whiteboard Core** is a standalone, open-source educational whiteboard demo built with SVG and vanilla JavaScript. It is independently developed and **does not include code or data from the private Kreduj platform**.

**[Try the live demo](https://majggg.github.io/kreduj-whiteboard-core/)** (available after enabling GitHub Pages).

### Features

- Freehand pen and eraser, line, rectangle, circle, text and simple formula labels.
- Select, drag, delete, undo and redo.
- Browser-local autosave, SVG export, JSON import/export.
- **English and Polish** interface with a persistent language switcher (English by default).
- Example Pythagorean theorem lesson, responsive layout.
- No build step, server, API keys or external dependencies.

### Run locally

Open `index.html` in a modern browser, or run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Limitations

The participant panel is only a **visual demo**. There is no real-time collaboration, account system, shared links, LaTeX rendering or backend. The “Export board file” button downloads a JSON file. The language switch translates UI only; user-authored whiteboard content is unchanged.

### Roadmap

Extract the editor as a TypeScript library, add tests and accessibility improvements, implement optional collaborative sessions (with authorization and persistence), and support mathematical expression rendering.

### GitHub Pages setup

This repository contains `.github/workflows/pages.yml`. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pushes to `main` then deploy automatically.

### License

MIT — [LICENSE](LICENSE).

---

## Polski

**Kreduj Whiteboard Core** to niezależny, otwarty demonstrator interaktywnej tablicy edukacyjnej oparty na SVG i JavaScript. Projekt **nie zawiera kodu ani danych z prywatnej platformy Kreduj**.

**[Otwórz demo](https://majggg.github.io/kreduj-whiteboard-core/)** (po włączeniu GitHub Pages).

### Funkcje

- Pióro, gumka, linie, prostokąty, koła, tekst i proste wzory tekstowe.
- Zaznaczanie, przesuwanie, usuwanie, cofanie i ponawianie.
- Automatyczny lokalny zapis, eksport SVG, import/eksport JSON.
- **Interfejs po polsku i angielsku**, z zapamiętywanym wyborem języka (domyślnie angielski).
- Przykładowa lekcja o twierdzeniu Pitagorasa i responsywny wygląd.
- Bez procesu budowania, serwera, kluczy API i zewnętrznych zależności.

### Uruchomienie lokalne

Otwórz `index.html` w przeglądarce lub uruchom:

```sh
python3 -m http.server 8000
```

Następnie wejdź na `http://localhost:8000`.

### Ograniczenia

Panel uczestników to tylko **demonstracja graficzna**. Nie ma współpracy na żywo, kont, wspólnych linków, renderowania LaTeX ani backendu. „Udostępnij plik” pobiera JSON. Przełącznik języka tłumaczy interfejs, ale nie zmienia tekstów utworzonych na tablicy.

### Plan rozwoju

Wydzielenie edytora do biblioteki TypeScript, testy, poprawa dostępności, opcjonalna współpraca na żywo z autoryzacją i trwałym zapisem oraz obsługa wzorów matematycznych.

### GitHub Pages

W repozytorium znajduje się `.github/workflows/pages.yml`. Wybierz **Settings → Pages → Build and deployment → Source: GitHub Actions**. Kolejne aktualizacje gałęzi `main` będą wdrażane automatycznie.

### Licencja

MIT — [LICENSE](LICENSE).
