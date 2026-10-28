/* =====================================================================
   POKER VOCAB (Texas Hold'em) — what this dummy data represents
   - Each player gets 2 private "hole cards".
   - Up to 5 shared "community cards" go in the middle (the "board").
   - Streets (betting rounds): PREFLOP (0 board cards) -> FLOP (3)
     -> TURN (4) -> RIVER (5), then SHOWDOWN.
   - Blinds: forced bets to start the pot. Small blind (50) sits 1 seat
     left of the dealer, big blind (100) 2 seats left.
   - The dealer "button" (D) rotates one seat each hand.
   - Best 5-card hand from your 2 hole cards + 5 board cards wins.
   ===================================================================== */

// Card codes: rank + suit. T = 10. s/h/d/c = spades/hearts/diamonds/clubs.
const SUITS = { s: '♠', h: '♥', d: '♦', c: '♣' };
const TEXT = '\uFE0E'; // forces suits to render as text, not emoji

const STREETS = [
  { name: 'PREFLOP', boardCards: 0 },
  { name: 'FLOP',    boardCards: 3 },
  { name: 'TURN',    boardCards: 4 },
  { name: 'RIVER',   boardCards: 5 },
];

// ---- Dummy hand (later this will come from your game engine) ----
const hand = {
  id: 15,
  smallBlind: 50,
  bigBlind: 100,
  dealerSeat: 7,
  pot: 1550,
  board: ['8s', '4c', 'Kh', 'Js', '2d'],
  // status: 'in' = still in the hand, 'folded' = gave up their cards
  players: [
    { seat: 1, name: 'CFR-7',    stack: 0,     cards: ['6d', 'Th'], status: 'in',     equity: 0 },
    { seat: 2, name: 'NASH',     stack: 0,     cards: ['Qd', 'Qh'], status: 'in',     equity: 100 },
    { seat: 3, name: 'MONTE',    stack: 43600, cards: ['6h', '4s'], status: 'folded' },
    { seat: 4, name: 'TILT',     stack: 8950,  cards: ['3d', '9c'], status: 'in',     equity: 0 },
    { seat: 5, name: 'GTO-LITE', stack: 18150, cards: ['Jc', 'Qc'], status: 'folded' },
    { seat: 6, name: 'RIVERRAT', stack: 9950,  cards: ['7c', 'Jd'], status: 'folded' },
    { seat: 7, name: 'FOLDBOT',  stack: 8950,  cards: ['9h', 'Jh'], status: 'folded' },
    { seat: 8, name: 'BAYES',    stack: 8850,  cards: ['3c', '4d'], status: 'folded' },
  ],
};

// Where each seat sits on the oval (angle in degrees, 0 = right, 90 = bottom).
const SEAT_ANGLES = { 1: 112, 2: 158, 3: -158, 4: -112, 5: -68, 6: -22, 7: 22, 8: 68 };

// ---- UI state ----
let streetIdx = 2;      // start on the TURN, like the reference
let speed = 4;
let timer = null;

// ---- Helpers ----
function cardHTML(code, size = '') {
  if (!code) return `<div class="card ${size} empty"></div>`;
  const rank = code[0] === 'T' ? '10' : code.slice(0, -1);
  const suit = SUITS[code.slice(-1)] + TEXT;
  return `<div class="card ${size}"><span>${rank}</span><span class="suit">${suit}</span></div>`;
}
const fmt = n => n.toLocaleString('en-US');

function seatPosition(seat) {
  const a = SEAT_ANGLES[seat] * Math.PI / 180;
  // same ellipse as the SVG rail (viewBox 1000 x 560)
  const x = 500 + 375 * Math.cos(a);
  const y = 290 + 221 * Math.sin(a);
  return { left: x / 10 + '%', top: (y / 560) * 100 + '%' };
}

// ---- Render: draws everything from `hand` + `streetIdx` ----
function render() {
  const street = STREETS[streetIdx];

  document.getElementById('handInfo').textContent =
    `HAND ${String(hand.id).padStart(6, '0')}, BLINDS ${hand.smallBlind}/${hand.bigBlind}`;
  document.getElementById('street').textContent = street.name;

  // Community cards: show as many as this street allows, rest are empty slots
  document.getElementById('community').innerHTML = [0, 1, 2, 3, 4]
    .map(i => cardHTML(i < street.boardCards ? hand.board[i] : null, 'lg'))
    .join('');
  document.getElementById('pot').textContent = `POT ${fmt(hand.pot)}`;

  // Seats
  const table = document.getElementById('table');
  table.querySelectorAll('.seat').forEach(el => el.remove());
  for (const p of hand.players) {
    const pos = seatPosition(p.seat);
    const isIn = p.status === 'in';
    const dealer = p.seat === hand.dealerSeat ? ' (D)' : '';
    const equity = isIn ? `${p.equity}%` : '--';
    const el = document.createElement('div');
    el.className = `seat ${isIn ? 'in' : 'folded'}`;
    el.style.left = pos.left;
    el.style.top = pos.top;
    el.innerHTML = `
      <div class="hole">${p.cards.map(c => cardHTML(c)).join('')}</div>
      <div class="name">S${p.seat} ${p.name}${dealer}</div>
      <div class="stack">${fmt(p.stack)} ${equity}</div>
      <div class="bar"></div>
      <div class="action">${isIn ? '' : 'FOLD'}</div>`;
    table.appendChild(el);
  }

  document.getElementById('progress').style.width =
    ((streetIdx + 1) / STREETS.length) * 100 + '%';
}

// ---- Replay controls ----
function go(i) { streetIdx = Math.max(0, Math.min(STREETS.length - 1, i)); render(); }
function stop() { clearInterval(timer); timer = null; playBtn.textContent = '[PLAY]'; }
function play() {
  if (streetIdx === STREETS.length - 1) go(0);
  playBtn.textContent = '[PAUSE]';
  timer = setInterval(() => {
    if (streetIdx >= STREETS.length - 1) return stop();
    go(streetIdx + 1);
  }, 4000 / speed);
}

const playBtn = document.getElementById('playBtn');
document.querySelector('.controls').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'first') { stop(); go(0); }
  if (act === 'prev')  { stop(); go(streetIdx - 1); }
  if (act === 'next')  { stop(); go(streetIdx + 1); }
  if (act === 'play')  { timer ? stop() : play(); }
  if (b.dataset.speed) {
    speed = +b.dataset.speed;
    document.querySelectorAll('.speed').forEach(s => s.classList.toggle('on', s === b));
    if (timer) { stop(); play(); }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stop(); go(streetIdx + 1); }
  if (e.key === 'ArrowLeft')  { stop(); go(streetIdx - 1); }
  if (e.key === ' ') { e.preventDefault(); timer ? stop() : play(); }
});

render();
