# Poker Table

A Texas Hold'em poker game built from scratch. I'm building it as a way to learn poker.

Right now it's a **dummy interface**: an 8-seat table that replays one hard-coded hand, street by street.

## Run it

No install needed. Open `index.html` in a browser.

Controls: `[<]` / `[>]` or the arrow keys step through streets, and Space plays or pauses.

## Project structure

| File         | What it does                                                        |
|--------------|---------------------------------------------------------------------|
| `index.html` | Page skeleton: header, replay controls, table rail                  |
| `style.css`  | All visuals: cards, seats, folded vs. active players                |
| `game.js`    | Hand data (`hand` object) + `render()` that draws the table from it |

How it works: the game state lives in one data object, and `render()` redraws everything from it.

## Poker basics (Texas Hold'em)

- **Hole cards:** 2 private cards per player.
- **Board:** up to 5 shared community cards.
- **Streets:** preflop (0 board cards) → flop (3) → turn (4) → river (5) → showdown.
- **Blinds:** forced bets that start the pot. The small blind sits 1 seat left of the dealer and the big blind sits 2 seats left.
- **Dealer button (D):** moves one seat each hand.
- **Equity:** your chance of winning the pot from the current spot.
- The best 5-card hand made from your 2 hole cards + the 5 board cards wins.

## Roadmap

- [x] Dummy table UI + street-by-street replay
- [ ] Deck: build 52 cards, shuffle (Fisher–Yates), deal
- [ ] Hand evaluator: rank the best 5 of 7 cards
- [ ] Betting: blinds, fold / check / call / raise, turn order, pot
- [ ] Showdown + winner
- [ ] Bots (FOLDBOT, TILT, ...) and equity calculation
