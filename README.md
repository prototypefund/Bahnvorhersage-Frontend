# Bahn-Vorhersage Frontend https://bahnvorhersage.de

```
████████████████████████████████████▇▆▅▃▁
       Bahn-Vorhersage      ███████▙  ▜██▆▁
███████████████████████████████████████████▃
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█████▄▖
█████████████████████████████████████████████
 ▜█▀▀▜█▘                       ▜█▀▀▜█▘   ▀▀▀
```

This is the frontend for https://bahnvorhersage.de.

# Instructions

## Development setup

### Requirements

- nodejs and npm
- backend running at http://localhost:5000/

### Install

```bash
npm install
```

### Debugging

```bash
npm run serve
```

You may also need to lint the code:

```bash
npm run lint
```

### Generate Icon font
```bash
fantasticon src/assets/fonts/icons -o src/assets/fonts/icons  --asset-types scss --normalize --fonts-url assets/fonts/icons
```
