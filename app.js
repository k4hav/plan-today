/* =====================================================
   PlanToday — app.js
   All application logic, state, and event handlers
   ===================================================== */

// ── STATE ──────────────────────────────────────────────
let S = {
  tasks: [], notes: [], tomorrow: [], weekData: {},
  profile: { name: '', goal: '' },
  activeGoal: 'jee',
  categories: [],
  customCats: [],
};
let tab = 'all', catF = 'all', qIdx = 0, tPri = 'med';

function loadS() {
  try {
    const r = localStorage.getItem('pv5');
    if (r) { const p = JSON.parse(r); Object.keys(p).forEach(k => { if (p[k] !== undefined) S[k] = p[k]; }); }
  } catch(e) {}
}
function saveS() {
  try { localStorage.setItem('pv5', JSON.stringify(S)); } catch(e) {}
}

// ── INIT ───────────────────────────────────────────────
function init() {
  loadS();
  setDate(); setGreeting(); setQuote();
  buildGoalPresets();
  rebuildCats(S.activeGoal || 'jee', false);
  buildWeek();
  renderTasks(); renderTomorrow(); renderNotes();
  updateStats(); updateNoteBadge();
  buildTplGrid();
  if (!S.profile.name) document.getElementById('setup-banner').style.display = 'block';
  if (!S.tasks.length) loadDemo();
  initRipples();
  spawnParticles();
}

function initRipples() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.className = 'rip';
      const rect = this.getBoundingClientRect();
      const sz = Math.max(rect.width, rect.height) * 2.2;
      r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rect.left - sz/2}px;top:${e.clientY - rect.top - sz/2}px`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

function spawnParticles() {
  const colors = ['rgba(108,99,255,.5)', 'rgba(167,139,250,.4)', 'rgba(255,255,255,.3)', 'rgba(34,197,94,.35)'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = (1 + Math.random() * 2.5) + 'px';
    p.style.cssText = `left:${Math.random()*100}vw;top:${Math.random()*100}vh;width:${sz};height:${sz};background:${colors[Math.floor(Math.random()*colors.length)]};--pd:${7+Math.random()*12}s;--pdy:${Math.random()*8}s;--po:${.3+Math.random()*.5}`;
    document.body.appendChild(p);
  }
}

// ── DATE & GREETING ────────────────────────────────────
function setDate() {
  const d = new Date();
  const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('nav-date').textContent = D[d.getDay()] + ' ' + d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear();
}

function setGreeting() {
  const h = new Date().getHours();
  const g = h < 5 ? 'Good Night 🌙' : h < 12 ? 'Good Morning ☀️' : h < 17 ? 'Good Afternoon 🌤' : h < 21 ? 'Good Evening 🌆' : 'Good Night 🌙';
  const n = S.profile.name ? ', ' + S.profile.name : '';
  document.getElementById('hero-h').textContent = g + n + ' 👋';
  const gp = GOAL_PRESETS[S.activeGoal];
  document.getElementById('hero-s').textContent = S.profile.goal
    ? 'Goal: ' + S.profile.goal + ' · Keep going!'
    : gp && S.activeGoal !== 'custom'
      ? 'Focused on: ' + gp.name + ' · Stay consistent!'
      : 'Track tasks · Stay consistent · Achieve your goals';
}

function saveSetup() {
  const n = document.getElementById('sn').value.trim();
  if (!n) { toast('Enter your name!', 't-warn'); return; }
  S.profile.name = n;
  saveS();
  document.getElementById('setup-banner').style.display = 'none';
  setGreeting();
  toast('Welcome, ' + n + '! 🎉', 't-ok');
}

// ── QUOTES ─────────────────────────────────────────────
function setQuote() {
  const q = QUOTES[qIdx % QUOTES.length];
  const qt = document.getElementById('q-t'); if (qt) qt.textContent = q.t;
  const qa = document.getElementById('q-a'); if (qa) qa.textContent = q.a;
}
function nextQ(e) { if (e) e.stopPropagation(); qIdx++; setQuote(); }

// ── GOAL PRESETS ───────────────────────────────────────
function buildGoalPresets() {
  const w = document.getElementById('goal-presets');
  w.innerHTML = Object.entries(GOAL_PRESETS).map(([k, g]) =>
    `<div class="gp${S.activeGoal === k ? ' sel' : ''}" onclick="selectGoal('${k}',this)"><span>${g.label}</span></div>`
  ).join('');
}

function selectGoal(k, el) {
  S.activeGoal = k; S.customCats = [];
  document.querySelectorAll('.gp').forEach(x => x.classList.remove('sel'));
  el.classList.add('sel');
  rebuildCats(k, true);
  setGreeting(); saveS();
  toast('Goal: ' + GOAL_PRESETS[k].name + ' ✓', 't-ok');
}

// ── CATEGORIES ─────────────────────────────────────────
function rebuildCats(key, reset) {
  const base = GOAL_PRESETS[key]; if (!base) return;
  S.categories = [...JSON.parse(JSON.stringify(base.cats)), ...(S.customCats || [])];
  saveS(); buildCatChips(); buildCatSelects(); buildCatListDisplay();
  if (reset) { catF = 'all'; renderTasks(); }
}

function getCat(id) {
  return S.categories.find(c => c.id === id) || {id:'other', label: id || 'Other', emoji:'📌', color:'#6c63ff'};
}

function buildCatChips() {
  const w = document.getElementById('cat-chips');
  w.innerHTML = `<button class="cchip${catF === 'all' ? ' on' : ''}" onclick="filterCat('all',this)">All</button>`;
  S.categories.forEach(c => {
    const b = document.createElement('button');
    b.className = 'cchip' + (catF === c.id ? ' on' : '');
    b.textContent = c.emoji + ' ' + c.label;
    b.onclick = function() { filterCat(c.id, this); };
    w.appendChild(b);
  });
}

function buildCatSelects() {
  const opts = S.categories.map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('');
  ['tcat', 'm-cat'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = opts; });
}

function buildCatListDisplay() {
  const el = document.getElementById('cat-list-display'); if (!el) return;
  const baseCnt = GOAL_PRESETS[S.activeGoal]?.cats.length || 0;
  el.innerHTML = S.categories.map((c, i) =>
    `<div class="cat-item">
      <span class="cat-item-e">${c.emoji}</span>
      <span class="cat-item-n">${c.label}</span>
      <span class="cat-item-c" style="background:${c.color}"></span>
      ${i >= baseCnt
        ? `<button class="btn btn-r btn-xs" onclick="delCustomCat(${i})" style="padding:3px 7px;font-size:10px;border-radius:6px">✕</button>`
        : '<span style="font-size:9px;color:var(--t3);padding:2px 6px;font-weight:600;letter-spacing:.04em">PRESET</span>'}
    </div>`
  ).join('') || '<div style="color:var(--t3);font-size:12px;text-align:center;padding:10px">No categories</div>';
}

function addCustomCat() {
  const emoji = document.getElementById('new-cat-emoji').value.trim() || '📌';
  const label = document.getElementById('new-cat-name').value.trim();
  const color = document.getElementById('new-cat-clr').value;
  if (!label) { toast('Enter a category name!', 't-warn'); return; }
  if (!S.customCats) S.customCats = [];
  S.customCats.push({ id: 'c_' + Date.now(), label, emoji, color, custom: true });
  S.categories = [...GOAL_PRESETS[S.activeGoal].cats, ...S.customCats];
  saveS(); buildCatChips(); buildCatSelects(); buildCatListDisplay();
  document.getElementById('new-cat-name').value = '';
  document.getElementById('new-cat-emoji').value = '';
  toast('"' + label + '" added!', 't-ok');
}

function delCustomCat(i) {
  const c = S.categories[i];
  if (!c || !c.custom) { toast('Cannot delete preset categories.', 't-warn'); return; }
  S.customCats = (S.customCats || []).filter(x => x.id !== c.id);
  S.categories = [...GOAL_PRESETS[S.activeGoal].cats, ...S.customCats];
  saveS(); buildCatChips(); buildCatSelects(); buildCatListDisplay();
  toast('Deleted.', 't-info');
}

// ── TASKS ──────────────────────────────────────────────
function addTask() {
  const inp = document.getElementById('ti');
  const text = inp.value.trim();
  if (!text) { toast('Enter a task!', 't-warn'); return; }
  S.tasks.unshift({
    id: Date.now(), text,
    cat: document.getElementById('tcat').value,
    time: document.getElementById('ttm').value.trim(),
    status: 'pending', pri: 'med',
    created: new Date().toISOString(),
  });
  saveS(); inp.value = ''; document.getElementById('ttm').value = '';
  renderTasks(); updateStats(); toast('✓ Task added!', 't-ok');
}

function addFromModal() {
  const text = document.getElementById('m-task').value.trim();
  if (!text) { toast('Enter a task!', 't-warn'); return; }
  S.tasks.unshift({
    id: Date.now(), text,
    cat: document.getElementById('m-cat').value,
    time: document.getElementById('m-time').value.trim(),
    status: 'pending', pri: tPri,
    created: new Date().toISOString(),
  });
  saveS(); closeM();
  document.getElementById('m-task').value = '';
  document.getElementById('m-time').value = '';
  renderTasks(); updateStats(); toast('✓ Task added!', 't-ok');
}

function setPri(p) {
  tPri = p;
  document.getElementById('ph').classList.toggle('on', p === 'high');
  document.getElementById('pm').classList.toggle('on', p === 'med');
  document.getElementById('pl').classList.toggle('on', p === 'low');
}

function markDone(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return;
  t.status = t.status === 'done' ? 'pending' : 'done';
  saveS(); renderTasks(); updateStats();
  if (t.status === 'done') toast('🎉 Done!', 't-ok');
}

function markMissed(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return;
  t.status = t.status === 'missed' ? 'pending' : 'missed';
  saveS(); renderTasks(); updateStats();
  if (t.status === 'missed') toast('📌 Marked missed.', 't-warn');
}

function delTask(id) {
  S.tasks = S.tasks.filter(x => x.id !== id);
  saveS(); renderTasks(); updateStats();
}

function clearDone() {
  const n = S.tasks.filter(x => x.status === 'done').length;
  S.tasks = S.tasks.filter(x => x.status !== 'done');
  saveS(); renderTasks(); updateStats();
  toast('🧹 ' + n + ' cleared.', 't-info');
}

function switchTab(t, el) {
  tab = t;
  document.querySelectorAll('.ttab').forEach(x => x.classList.remove('on'));
  el.classList.add('on');
  renderTasks();
}

function filterCat(c, el) {
  catF = c;
  document.querySelectorAll('.cchip').forEach(x => x.classList.remove('on'));
  el.classList.add('on');
  renderTasks();
}

function renderTasks(lid) {
  const ids = lid ? [lid] : ['task-list', 'pomo-list'];
  ids.forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    const items = S.tasks.filter(t =>
      (tab === 'all' || t.status === tab) && (catF === 'all' || t.cat === catF)
    );
    if (!items.length) {
      const m = { all: 'No tasks yet! Add your first task above.', pending: 'All tasks completed! 🎉', done: "Nothing done yet. Let's go! 💪", missed: 'Nothing missed! 🔥' };
      el.innerHTML = `<div class="e-state"><span class="e-ico">📋</span>${m[tab] || 'No tasks.'}</div>`;
      return;
    }
    el.innerHTML = items.map((t, i) => {
      const c = getCat(t.cat);
      const iD = t.status === 'done', iM = t.status === 'missed';
      const sp = iD
        ? `<span class="tpill" style="background:rgba(34,197,94,.08);color:var(--g);border-color:rgba(34,197,94,.2)">✓ Done</span>`
        : iM
        ? `<span class="tpill" style="background:rgba(239,68,68,.07);color:var(--r);border-color:rgba(239,68,68,.18)">✕ Missed</span>`
        : `<span class="tpill" style="background:rgba(245,158,11,.07);color:var(--am);border-color:rgba(245,158,11,.18)">● Pending</span>`;
      const hp = t.pri === 'high'
        ? `<span class="tpill" style="background:rgba(239,68,68,.07);color:var(--r);border-color:rgba(239,68,68,.15)">🔴 High</span>` : '';
      return `<div class="ti" style="--ticlr:${c.color};animation-delay:${i * .04}s">
        <div class="tchk ${iD ? 'done' : iM ? 'missed' : ''}" onclick="markDone(${t.id})">
          <span class="ck">${iD ? '✓' : iM ? '✕' : ''}</span>
        </div>
        <div class="tb">
          <div class="tt${iD ? ' xed' : ''}">${esc(t.text)}</div>
          <div class="tmeta">
            <span class="tpill" style="background:${c.color}14;color:${c.color};border-color:${c.color}33">${c.emoji} ${c.label}</span>
            ${t.time ? `<span class="ttime">⏱ ${esc(t.time)}</span>` : ''}
            ${hp}${sp}
          </div>
        </div>
        <div class="t-acts">
          <div class="ta ad" onclick="markDone(${t.id})" title="Done">✓</div>
          <div class="ta am" onclick="markMissed(${t.id})" title="Miss">✕</div>
          <div class="ta ax" onclick="delTask(${t.id})" title="Delete">🗑</div>
        </div>
      </div>`;
    }).join('');
  });
}

// ── STATS ──────────────────────────────────────────────
function updateStats() {
  const done  = S.tasks.filter(t => t.status === 'done').length;
  const miss  = S.tasks.filter(t => t.status === 'missed').length;
  const pend  = S.tasks.filter(t => t.status === 'pending').length;
  const total = S.tasks.length;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;

  document.getElementById('s-tot').textContent = total;
  document.getElementById('s-don').textContent = done;
  document.getElementById('s-mis').textContent = miss;
  document.getElementById('s-pen').textContent = pend;
  document.getElementById('sbf-d').style.width = (total > 0 ? done / total * 100 : 0) + '%';
  document.getElementById('sbf-m').style.width = (total > 0 ? miss / total * 100 : 0) + '%';
  document.getElementById('sbf-p').style.width = (total > 0 ? pend / total * 100 : 0) + '%';
  document.getElementById('tc-a').textContent = total;
  document.getElementById('tc-d').textContent = done;
  document.getElementById('tc-m').textContent = miss;
  document.getElementById('tc-p').textContent = pend;
  document.getElementById('prog-pct').textContent = pct + '%';
  document.getElementById('prog-bar').style.width = pct + '%';

  const cm = {};
  S.tasks.forEach(t => {
    if (!cm[t.cat]) cm[t.cat] = {tot: 0, done: 0};
    cm[t.cat].tot++;
    if (t.status === 'done') cm[t.cat].done++;
  });
  const mx = Math.max(...Object.values(cm).map(v => v.tot), 1);
  const sr = document.getElementById('sub-rows');
  if (sr) sr.innerHTML = Object.entries(cm).map(([id, d]) => {
    const c = getCat(id); const w = Math.round(d.tot / mx * 100);
    return `<div class="sub-row">
      <div class="sub-nm" style="color:${c.color}">${c.emoji} ${c.label}</div>
      <div class="sub-trk"><div class="sub-fl" style="width:${w}%;background:${c.color}"></div></div>
      <div class="sub-ct">${d.done}/${d.tot}</div>
    </div>`;
  }).join('') || '<div style="color:var(--t3);font-size:12px">Add tasks to see breakdown</div>';

  const today = new Date().toDateString();
  S.weekData[today] = {done, total, pct};
  saveS(); updateStreak(); buildWeek(); renderTasks('pomo-list');
}

function updateStreak() {
  let s = 0; const n = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(n); d.setDate(d.getDate() - i);
    const k = d.toDateString();
    if (S.weekData[k] && S.weekData[k].done > 0) s++;
    else if (i > 0) break;
  }
  document.getElementById('stk').textContent = s;
}

// ── WEEK GRID ──────────────────────────────────────────
function buildWeek() {
  const D = ['S','M','T','W','T','F','S'], now = new Date(), ts = now.toDateString();
  let h = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const k = d.toDateString();
    const data = S.weekData[k] || {done:0, total:0, pct:0};
    const iT = k === ts;
    const iC = data.done > 0 && data.done === data.total && data.total > 0;
    h += `<div class="wd ${iT ? 'today' : ''} ${iC ? 'complete' : ''}">
      <div class="wd-n">${D[d.getDay()]}</div>
      <div class="wd-d">${d.getDate()}</div>
      <div class="wd-p">${data.pct || 0}%</div>
      <div class="wd-dot"></div>
    </div>`;
  }
  const el = document.getElementById('week-grid'); if (el) el.innerHTML = h;
}

// ── NOTES ──────────────────────────────────────────────
function saveNote() {
  const ta = document.getElementById('nta');
  const text = ta.value.trim();
  if (!text) { toast('Write something first!', 't-warn'); return; }
  S.notes.unshift({
    id: Date.now(), text,
    cat: document.getElementById('ncat').value,
    ts: new Date().toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short'}),
    pinned: false,
  });
  ta.value = ''; document.getElementById('cct').textContent = '0';
  saveS(); renderNotes(); updateNoteBadge();
  document.getElementById('note-ts').textContent = 'Saved ' + new Date().toLocaleTimeString();
  toast('📓 Saved!', 't-ok');
}

function delNote(id) {
  S.notes = S.notes.filter(n => n.id !== id);
  saveS(); renderNotes(); updateNoteBadge();
}

function pinNote(id) {
  const n = S.notes.find(x => x.id === id);
  if (n) { n.pinned = !n.pinned; saveS(); renderNotes(); }
}

function renderNotes() {
  const mk = notes => {
    if (!notes.length) return '<div class="ne">No notes yet ✏</div>';
    return notes.map((n, i) => {
      const ci = NOTE_CATS[n.cat] || NOTE_CATS.general;
      return `<div class="note-card" style="animation-delay:${i * .04}s">
        <div class="nc-head">
          <span class="ntag" style="background:${ci.color}14;color:${ci.color};border-color:${ci.color}33">${ci.icon} ${n.cat}</span>
          <span class="nts">${n.ts}${n.pinned ? ' 📌' : ''}</span>
        </div>
        <div class="nbody">${esc(n.text)}</div>
        <div class="nacts">
          <button class="na pin" onclick="pinNote(${n.id})" title="${n.pinned ? 'Unpin' : 'Pin'}">${n.pinned ? '📌' : '📎'}</button>
          <button class="na" onclick="delNote(${n.id})" title="Delete">🗑</button>
        </div>
      </div>`;
    }).join('');
  };
  const ae = document.getElementById('all-notes'); const pe = document.getElementById('pin-notes');
  if (ae) ae.innerHTML = mk(S.notes);
  if (pe) pe.innerHTML = mk(S.notes.filter(n => n.pinned));
}

function updateNoteBadge() {
  const el = document.getElementById('nbadge'); if (el) el.textContent = S.notes.length;
}

function switchNoteTab(t, el) {
  document.querySelectorAll('.nstab').forEach(x => x.classList.remove('on')); el.classList.add('on');
  document.querySelectorAll('.npanel').forEach(p => p.classList.remove('on'));
  const ids = {write: 'np-w', all: 'np-a', pinned: 'np-p'};
  const panel = document.getElementById(ids[t]); if (panel) panel.classList.add('on');
  if (t !== 'write') renderNotes();
}

// ── TOMORROW ───────────────────────────────────────────
function addTmr() {
  const inp = document.getElementById('tmi');
  const text = inp.value.trim(); if (!text) return;
  S.tomorrow.push({id: Date.now(), text});
  inp.value = ''; saveS(); renderTomorrow();
  toast("📅 Added!", 't-info');
}

function delTmr(id) {
  S.tomorrow = S.tomorrow.filter(t => t.id !== id);
  saveS(); renderTomorrow();
}

function renderTomorrow() {
  const el = document.getElementById('tmr-list'); if (!el) return;
  if (!S.tomorrow.length) {
    el.innerHTML = '<div class="e-state" style="padding:18px"><span class="e-ico" style="font-size:24px">🌙</span>No plans yet!</div>';
    return;
  }
  el.innerHTML = S.tomorrow.map((t, i) =>
    `<div class="tmr-i" style="animation-delay:${i * .04}s">
      <div class="tmr-n">${i + 1}</div>
      <div class="tmr-t">${esc(t.text)}</div>
      <button class="tdel" onclick="delTmr(${t.id})">×</button>
    </div>`
  ).join('');
}

// ── ANALYTICS ──────────────────────────────────────────
function buildAnalytics() {
  // Heatmap
  const hm = document.getElementById('heatmap');
  if (hm) {
    const now = new Date(); let h = '';
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const k = d.toDateString();
      const data = S.weekData[k] || {pct: 0};
      const l = data.pct >= 80 ? 4 : data.pct >= 60 ? 3 : data.pct >= 30 ? 2 : data.pct > 0 ? 1 : 0;
      h += `<div class="hc h${l}" title="${k}: ${data.pct || 0}%"></div>`;
    }
    hm.innerHTML = h;
  }

  // Bar chart
  const bc = document.getElementById('bar-chart'), bl = document.getElementById('bar-labels');
  if (bc && bl) {
    const now = new Date(), D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const vals = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const k = d.toDateString();
      const data = S.weekData[k] || {pct: 0};
      vals.push({pct: data.pct || 0, day: D[d.getDay()].slice(0, 3)});
    }
    const mx = Math.max(...vals.map(v => v.pct), 1);
    bc.innerHTML = vals.map(v =>
      `<div class="bc-col"><div style="flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center">
        <div class="bc-bar" style="height:${Math.max(Math.round(v.pct/mx*72), 3)}px;width:80%" data-v="${v.pct}%"></div>
      </div></div>`
    ).join('');
    bl.innerHTML = vals.map(v =>
      `<span style="flex:1;text-align:center;font-size:9px;color:var(--t3);font-weight:700">${v.day}</span>`
    ).join('');
  }

  // Category distribution
  const cd = document.getElementById('cat-dist');
  if (cd) {
    const counts = {}; S.tasks.forEach(t => { counts[t.cat] = (counts[t.cat] || 0) + 1; });
    const tot = Math.max(S.tasks.length, 1);
    cd.innerHTML = Object.entries(counts).map(([id, n]) => {
      const c = getCat(id); const p = Math.round(n / tot * 100);
      return `<div style="margin-bottom:11px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;font-weight:700">
          <span style="color:${c.color}">${c.emoji} ${c.label}</span>
          <span style="color:var(--t3);font-family:'JetBrains Mono',monospace">${n} · ${p}%</span>
        </div>
        <div style="height:5px;background:var(--bg4);border-radius:20px;overflow:hidden">
          <div style="height:100%;width:${p}%;background:${c.color};border-radius:20px;transition:width .6s ease"></div>
        </div>
      </div>`;
    }).join('') || '<div style="color:var(--t3);font-size:12px;text-align:center;padding:14px">Add tasks to see distribution</div>';
  }

  // Lifetime stats
  const ls = document.getElementById('lifetime');
  if (ls) {
    const streak = document.getElementById('stk').textContent;
    const rows = [
      {icon:'📅', l:'Days Tracked',    v: Object.keys(S.weekData).length},
      {icon:'🔥', l:'Active Days',     v: Object.values(S.weekData).filter(d => d.done > 0).length},
      {icon:'✅', l:'Tasks Completed', v: S.tasks.filter(t => t.status === 'done').length},
      {icon:'📓', l:'Notes Saved',     v: S.notes.length},
      {icon:'⚡', l:'Current Streak',  v: streak + ' days'},
      {icon:'📊', l:"Today's Progress",v: document.getElementById('prog-pct').textContent},
    ];
    ls.innerHTML = rows.map(r =>
      `<div class="lsr"><div class="lsl"><span>${r.icon}</span><span>${r.l}</span></div><div class="lsv">${r.v}</div></div>`
    ).join('');
  }
}

// ── POMODORO ───────────────────────────────────────────
const POMO_CIRCUM = 427;
let pomo = {m: 25, s: 0, run: false, phase: 'focus', sess: 1, iv: null};

function pomoUI() {
  const tot = (pomo.phase === 'focus' ? 25 : 5) * 60;
  const elapsed = tot - (pomo.m * 60 + pomo.s);
  const ring = document.getElementById('pomo-ring');
  if (ring) ring.style.strokeDashoffset = Math.max(0, POMO_CIRCUM - (elapsed / tot) * POMO_CIRCUM);
  const d = document.getElementById('pomo-d');
  if (d) d.textContent = String(pomo.m).padStart(2,'0') + ':' + String(pomo.s).padStart(2,'0');
  const l = document.getElementById('pomo-l');
  if (l) l.textContent = pomo.phase === 'focus' ? 'FOCUS' : 'BREAK';
  const sn = document.getElementById('pomo-sn');
  if (sn) sn.textContent = pomo.sess;
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (dot) dot.className = 'pdot-c' + ((i < pomo.sess || (i === pomo.sess && pomo.phase === 'break')) ? ' lit' : '');
  }
}

function togglePomo() {
  const btn = document.getElementById('pomo-btn');
  if (pomo.run) {
    clearInterval(pomo.iv); pomo.run = false;
    if (btn) btn.textContent = '▶ Resume';
  } else {
    pomo.run = true; if (btn) btn.textContent = '⏸ Pause';
    pomo.iv = setInterval(() => {
      if (pomo.s > 0) pomo.s--;
      else if (pomo.m > 0) { pomo.m--; pomo.s = 59; }
      else {
        clearInterval(pomo.iv); pomo.run = false;
        if (pomo.phase === 'focus') {
          pomo.phase = 'break'; pomo.m = 5; pomo.s = 0; toast('🍅 5 min break!', 't-ok');
        } else {
          pomo.phase = 'focus'; pomo.sess = Math.min(pomo.sess + 1, 4);
          pomo.m = 25; pomo.s = 0; toast('✨ Focus time!', 't-info');
        }
        if (btn) btn.textContent = '▶ Start';
      }
      pomoUI();
    }, 1000);
  }
}

function resetPomo() {
  clearInterval(pomo.iv);
  pomo = {m: 25, s: 0, run: false, phase: 'focus', sess: 1, iv: null};
  const btn = document.getElementById('pomo-btn'); if (btn) btn.textContent = '▶ Start';
  pomoUI();
}

// ── TEMPLATES ──────────────────────────────────────────
function buildTplGrid() {
  const g = document.getElementById('tpl-grid'); if (!g) return;
  g.innerHTML = TEMPLATES.map((t, i) =>
    `<div class="tcard" onclick="loadTpl(${i})">
      <div class="tc-icon">${t.icon}</div>
      <div class="tc-name">${t.name}</div>
      <div class="tc-desc">${t.desc}</div>
      <div class="tc-cnt">${t.tasks.length} tasks</div>
    </div>`
  ).join('');
}

function loadTpl(i) {
  const t = TEMPLATES[i];
  S.tasks = t.tasks.map(tk => ({
    ...tk,
    id: Date.now() + Math.random(),
    cat: S.categories.find(c => c.id === tk.cat) ? tk.cat : S.categories[0]?.id || 'other',
    status: 'pending',
    created: new Date().toISOString(),
  }));
  saveS(); closeM(); renderTasks(); updateStats();
  toast('📋 Template: ' + t.name, 't-ok');
}

// ── PAGE NAVIGATION ────────────────────────────────────
function showPage(p, el) {
  document.querySelectorAll('.app-page').forEach(x => x.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(x => x.classList.remove('on'));
  document.getElementById('page-' + p).classList.add('on');
  el.classList.add('on');
  if (p === 'analytics') buildAnalytics();
  if (p === 'pomodoro') { pomoUI(); renderTasks('pomo-list'); }
}

// ── MODALS ─────────────────────────────────────────────
function openAdd()      { buildCatSelects(); document.getElementById('add-modal').classList.add('open'); }
function openTpl()      { document.getElementById('tpl-modal').classList.add('open'); }
function openSettings() {
  document.getElementById('set-name').value = S.profile.name || '';
  document.getElementById('set-goal').value = S.profile.goal || '';
  document.getElementById('set-modal').classList.add('open');
}
function saveSettings() {
  S.profile.name = document.getElementById('set-name').value.trim();
  S.profile.goal = document.getElementById('set-goal').value.trim();
  saveS(); closeM(); setGreeting(); toast('✅ Saved!', 't-ok');
}
function closeM() {
  document.querySelectorAll('.modal-ov').forEach(m => m.classList.remove('open'));
}

// ── TOAST ──────────────────────────────────────────────
function toast(msg, cls) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + (cls || 't-info');
  t.classList.add('show'); clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── HELPERS ────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── DEMO DATA ──────────────────────────────────────────
function loadDemo() {
  const f = S.categories[0]?.id || 'other';
  const s = S.categories[1]?.id || f;
  const t = S.categories[2]?.id || f;
  S.tasks = [
    {id:1, text:"Complete today's main study session",  cat:f, time:'2h',   status:'done',    pri:'high', created:new Date().toISOString()},
    {id:2, text:'Solve 20 practice problems',           cat:s, time:'1.5h', status:'pending', pri:'high', created:new Date().toISOString()},
    {id:3, text:"Review yesterday's notes",             cat:t, time:'30m',  status:'pending', pri:'med',  created:new Date().toISOString()},
    {id:4, text:"Plan tomorrow's schedule",             cat:f, time:'15m',  status:'pending', pri:'low',  created:new Date().toISOString()},
  ];
  S.tomorrow = [
    {id:101, text:'Start with the hardest topic first'},
    {id:102, text:'30 min revision before bed'},
  ];
  saveS();
}

// ── BOOTSTRAP ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();
  // Close modals on backdrop click
  document.querySelectorAll('.modal-ov').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) closeM(); });
  });
});
