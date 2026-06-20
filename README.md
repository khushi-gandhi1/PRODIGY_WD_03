# Tic-Tac-Toe Web App

A handwritten-notebook-styled Tic-Tac-Toe game built with  HTML, CSS, and JavaScript, no frameworks, no build step.

## ✨ Features

- 🎮 **Two-player mode** — play X vs O on the same device
- 🤖 **Vs Computer mode** — toggle a checkbox to play against a simple bot
- ✍️ **Hand-drawn aesthetic** — X's, O's, and the win-line are drawn as wobbly SVG paths for a sketched, notebook-paper look
- 🔢 **Tally-mark scoreboard** — wins and draws are tracked as hash-mark tallies (e.g. `||||/`) instead of plain numbers
- 🏆 **Win detection & highlight** — the winning row/column/diagonal is highlighted with a strike-through line
- 🔄 **New Round / Reset Match controls** — clear the board or wipe the whole scoreboard
- 📱 **Responsive layout** — adapts to small/mobile screens

## 📁 Project Structure

```
tic-tac-toe/
├── index.html      # Page structure / markup
├── style.css        # Notebook-paper styling and layout
├── script.js        # Game logic, bot AI, SVG drawing
├── README.md
└── .gitignore
```

## 🚀 Getting Started

No installation or build tools required.

1. Clone the repo:
   ```bash
   git clone https://github.com/<khushi-gandhi1>/tic-tac-toe.git
   cd tic-tac-toe
   ```
2. Open `index.html` directly in your browser, **or** serve it locally:
   ```bash
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## 🕹️ How to Play

1. Tap any empty cell to place the current player's mark.
2. X always goes first; turns alternate automatically.
3. Check **"play against the computer"** to play solo against the bot (you play X, the bot plays O).
4. Click **"new round"** to clear the board and keep the score.
5. Click **"reset match"** to clear the board *and* the scoreboard.

## 🤖 Bot Logic

The computer opponent is intentionally simple (not a perfect/unbeatable minimax bot):

1. Take a winning move if available.
2. Otherwise, block the opponent's winning move.
3. Otherwise, prefer the center.
4. Otherwise, prefer a corner.
5. Otherwise, pick any open cell at random.

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid layout, responsive media queries
- **Vanilla JavaScript (ES5-style)** — no dependencies, no build step
- **Google Fonts** — [Caveat](https://fonts.google.com/specimen/Caveat) (handwriting) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Author

Made by **Khushi** Prodigy InfoTech Web Development Internship.
