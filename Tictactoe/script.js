(function(){
  // ----- state -----
  var board = Array(9).fill(null);
  var turn = 'X';
  var over = false;
  var scores = { X:0, O:0, D:0 };
  var cellsEl = document.getElementById('cells');
  var statusEl = document.getElementById('status');
  var vsBotEl = document.getElementById('vsBot');
  var winLineSvg = document.getElementById('winLine');

  var WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  var CENTERS = [[50,50],[150,50],[250,50],[50,150],[150,150],[250,150],[50,250],[150,250],[250,250]];

  function rnd(min, max){ return min + Math.random() * (max - min); }

  // build the 9 cell buttons once
  var cellButtons = [];
  for (var i = 0; i < 9; i++){
    var b = document.createElement('button');
    b.className = 'cell';
    b.setAttribute('aria-label', 'cell ' + (i+1));
    b.dataset.idx = i;
    b.addEventListener('click', onCellClick);
    cellsEl.appendChild(b);
    cellButtons.push(b);
  }

  function onCellClick(e){
    var idx = +e.currentTarget.dataset.idx;
    if (over || board[idx]) return;
    place(idx, turn);
  }

  function place(idx, player){
    board[idx] = player;
    drawMark(cellButtons[idx], player);

    var result = checkWin();
    if (result){
      over = true;
      scores[player]++;
      highlightWin(result);
      renderTallies();
      statusEl.textContent = player + ' wins! nice one.';
      disableBoard();
      return;
    }
    if (board.every(function(c){ return c; })){
      over = true;
      scores.D++;
      renderTallies();
      statusEl.textContent = "it's a draw — rematch?";
      return;
    }

    turn = (turn === 'X') ? 'O' : 'X';
    statusEl.textContent = turn + "'s turn";

    if (vsBotEl.checked && turn === 'O' && !over){
      cellButtons.forEach(function(c){ c.disabled = true; });
      setTimeout(function(){
        cellButtons.forEach(function(c, i){ c.disabled = !!board[i]; });
        botMove();
      }, 380);
    }
  }

  function checkWin(){
    for (var i = 0; i < WINS.length; i++){
      var line = WINS[i];
      if (board[line[0]] && board[line[0]] === board[line[1]] && board[line[1]] === board[line[2]]){
        return { player: board[line[0]], line: line };
      }
    }
    return null;
  }

  function disableBoard(){
    cellButtons.forEach(function(c){ c.disabled = true; });
  }

  // ----- a simple, not-unbeatable bot -----
  function botMove(){
    if (over) return;
    var move = findWinningMove('O') || findWinningMove('X') || pick([4]) || pick([0,2,6,8]) || pickRandom();
    if (move != null) place(move, 'O');
  }
  function findWinningMove(player){
    for (var i = 0; i < WINS.length; i++){
      var line = WINS[i];
      var vals = line.map(function(idx){ return board[idx]; });
      var filled = vals.filter(function(v){ return v === player; }).length;
      var empties = line.filter(function(idx){ return !board[idx]; });
      if (filled === 2 && empties.length === 1) return empties[0];
    }
    return null;
  }
  function pick(candidates){
    var open = candidates.filter(function(i){ return !board[i]; });
    return open.length ? open[Math.floor(Math.random()*open.length)] : null;
  }
  function pickRandom(){
    var open = board.map(function(v,i){ return v ? null : i; }).filter(function(v){ return v !== null; });
    return open.length ? open[Math.floor(Math.random()*open.length)] : null;
  }

  // ----- drawing hand-ish marks -----
  function drawMark(cellEl, player){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    if (player === 'X') drawX(svg); else drawO(svg);
    cellEl.appendChild(svg);
  }

  function drawX(svg){
    var jitter = function(){ return rnd(-7,7); };
    var p1 = path('M ' + (18+jitter()) + ' ' + (18+jitter()) + ' Q ' + (50+jitter()) + ' ' + (50+jitter()) + ' ' + (82+jitter()) + ' ' + (82+jitter()), 'var(--x-ink)');
    var p2 = path('M ' + (82+jitter()) + ' ' + (18+jitter()) + ' Q ' + (50+jitter()) + ' ' + (50+jitter()) + ' ' + (18+jitter()) + ' ' + (82+jitter()), 'var(--x-ink)');
    svg.appendChild(p1); svg.appendChild(p2);
  }

  function drawO(svg){
    var r = rnd(28,33), cx = 50 + rnd(-3,3), cy = 50 + rnd(-3,3);
    var k = r * 0.55;
    var d = 'M ' + (cx-r) + ' ' + cy +
      ' C ' + (cx-r) + ' ' + (cy-k*1.6) + ' ' + (cx-k*1.4) + ' ' + (cy-r-rnd(-2,2)) + ' ' + cx + ' ' + (cy-r) +
      ' C ' + (cx+k*1.5) + ' ' + (cy-r) + ' ' + (cx+r+rnd(-2,2)) + ' ' + (cy-k*1.3) + ' ' + (cx+r) + ' ' + cy +
      ' C ' + (cx+r) + ' ' + (cy+k*1.5) + ' ' + (cx+k*1.3) + ' ' + (cy+r) + ' ' + cx + ' ' + (cy+r) +
      ' C ' + (cx-k*1.5) + ' ' + (cy+r+rnd(-2,2)) + ' ' + (cx-r) + ' ' + (cy+k*1.4) + ' ' + (cx-r) + ' ' + cy;
    svg.appendChild(path(d, 'var(--o-ink)'));
  }

  function path(d, stroke){
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', stroke);
    p.setAttribute('stroke-width', '8');
    p.setAttribute('stroke-linecap', 'round');
    return p;
  }

  function highlightWin(result){
    result.line.forEach(function(i){ cellButtons[i].classList.add('win'); });
    var a = CENTERS[result.line[0]], b = CENTERS[result.line[2]];
    var mx = (a[0]+b[0])/2 + rnd(-6,6), my = (a[1]+b[1])/2 + rnd(-6,6);
    var d = 'M ' + a[0] + ' ' + a[1] + ' Q ' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1];
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'var(--margin)');
    p.setAttribute('stroke-width', '6');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('opacity', '0.85');
    winLineSvg.appendChild(p);
  }

  // ----- tally marks instead of plain numbers -----
  function renderTallies(){
    drawTally(document.getElementById('tallyX'), scores.X);
    drawTally(document.getElementById('tallyO'), scores.O);
    drawTally(document.getElementById('tallyD'), scores.D);
  }

  function drawTally(svg, n){
    svg.innerHTML = '';
    var groups = Math.ceil(n / 5) || 0;
    var width = Math.max(60, groups * 26 - 6);
    svg.setAttribute('viewBox', '0 0 ' + width + ' 24');
    var x = 4, drawn = 0;
    for (var g = 0; g < groups; g++){
      var inGroup = Math.min(5, n - drawn);
      for (var s = 0; s < inGroup; s++){
        var sx = x + s*5 + rnd(-0.5,0.5);
        addLine(svg, sx, 3+rnd(-1,1), sx+rnd(-1.5,1.5), 21+rnd(-1,1));
      }
      if (inGroup === 5){
        addLine(svg, x-2, 18, x+22, 6); // the strike across the bundle of 4 (+5th)
      }
      drawn += inGroup;
      x += 26;
    }
  }
  function addLine(svg,x1,y1,x2,y2){
    var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1',x1); l.setAttribute('y1',y1);
    l.setAttribute('x2',x2); l.setAttribute('y2',y2);
    l.setAttribute('stroke', 'var(--ink)');
    l.setAttribute('stroke-width', '2');
    l.setAttribute('stroke-linecap','round');
    svg.appendChild(l);
  }

  // ----- controls -----
  document.getElementById('newRound').addEventListener('click', function(){
    board = Array(9).fill(null);
    turn = 'X';
    over = false;
    cellButtons.forEach(function(c){
      c.innerHTML = '';
      c.disabled = false;
      c.classList.remove('win');
    });
    winLineSvg.innerHTML = '';
    statusEl.textContent = "X's turn — go ahead";
  });

  document.getElementById('resetMatch').addEventListener('click', function(){
    scores = { X:0, O:0, D:0 };
    renderTallies();
    document.getElementById('newRound').click();
  });

  renderTallies();
})();
  
