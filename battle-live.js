// Live battle mode: rooms, lobby and play over Firebase Realtime Database.
// Answer checking comes from engine.js (generated from the solo game).
const FB_VER = '10.12.2';
const FB_CONFIG = {
  apiKey: "AIzaSyBuWBt3Nm9aBrCcpIfoILHVWTAFaLHgeUE",
  authDomain: "name100-a2312.firebaseapp.com",
  databaseURL: "https://name100-a2312-default-rtdb.firebaseio.com",
  projectId: "name100-a2312",
  storageBucket: "name100-a2312.firebasestorage.app",
  messagingSenderId: "425738745693",
  appId: "1:425738745693:web:0c362178812161e7db5ab4"
};

// ======== Categories (from engine.js) ========
const GROUP_ORDER = ['People','Entertainment','Fiction','United States','World','Sports','Things'];
const GROUPS = {};
for (const g of GROUP_ORDER) GROUPS[g] = CAT_IDS.filter(id => CATS[id].group === g);
const FINITE = {'us-presidents':45,'us-states':50,'state-capitals':50,'countries':197,'capitals':197,'best-picture':98,'tony-best-musical':78,'sports-teams':124};
const label = id => CATS[id] ? CATS[id].label : id;
const goalOpts = id => { const n = FINITE[id]; return n ? [...[25,50,100].filter(g => g < n), n] : [25,50,100]; };
const goalLabel = (g, id) => FINITE[id] === g ? 'all ' + g : String(g);
const parentOf = id => (CATS[id] && CATS[id].sub) || id;
// Open lists start at the solo game's goal for that category (50 for the harder ones, or what the player picked there)
const startGoal = id => { if (FINITE[id]) return FINITE[id]; const g = +store.get('name100-goal-' + id, 0); return g === 50 || g === 100 ? g : (CATS[id].goal || 100); };
const MODES = {
  race:  { name:'Race', blurb:'First to the goal wins' },
  timed: { name:'Timed', blurb:'Most names before the clock runs out' },
  steal: { name:'Steal', blurb:'Shared pool · once a name is used, it is gone for everyone · names are visible' },
  turns: { name:'Taking Turns', blurb:'One name each per turn · repeat a name or run out of time and you lose a life' }
};
const WORDS = 'FROG MOON TACO PEAR LIME STAR WAVE FERN PLUM KITE BEAR DUCK LAMP ROSE SNOW CAKE GOLD JAZZ MINT FISH WOLF LION DEER HAWK BELL BOOK CORN DOVE FIRE GLOW HERO IRIS JADE LEAF MAZE NEST OPAL PINE QUIZ RAIN SAGE TIDE VASE WREN YARN ZOOM'.split(' ');

// ======== Helpers ========
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const store = { get(k, d='') { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
const sess = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch {} } };
const cleanCode = s => { const t = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); const m = t.match(/^([A-Z]{4})([0-9]{2})$/); return m ? m[1] + '-' + m[2] : null; };
const randomCode = () => WORDS[Math.floor(Math.random() * WORDS.length)] + '-' + (10 + Math.floor(Math.random() * 90));
function modeLine(st) {
  const m = MODES[st.mode].name;
  if (st.mode === 'race') return `${m} · first to ${goalLabel(st.goal, st.cat)}`;
  if (st.mode === 'timed') return `${m} · ${st.minutes} min`;
  if (st.mode === 'steal') return `${m} · ${st.goal ? 'first to ' + goalLabel(st.goal, st.cat) : st.minutes + ' min'}`;
  return `${m} · ${st.turnSecs}s turns · ${st.lives} ${st.lives === 1 ? 'life' : 'lives'}`;
}

// ======== State ========
const S = {
  uid: null, code: null, room: null, sub: null, offset: 0, local: null, screen: '', timers: [],
  nick: store.get('battle-nick'), fromId: null, notice: '',
  draft: { cat:'real-women', mode:'race', goal:100, minutes:5, turnSecs:15, lives:3, maxPlayers:8, rematchOff:true }
};
const now = () => Date.now() + S.offset;
function clearTimers() { S.timers.forEach(t => { clearInterval(t); clearTimeout(t); }); S.timers = []; }

// ======== Firebase ========
let F = null, db = null;
async function connect() {
  const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
  const [appM, authM, dbM] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-database.js')]);
  const app = appM.initializeApp(FB_CONFIG);
  // per-tab sign-in: a reload keeps your seat, a new tab (or device) is a new player
  const auth = authM.initializeAuth(app, { persistence: authM.browserSessionPersistence });
  db = dbM.getDatabase(app);
  F = dbM;
  const user = await new Promise((res, rej) => {
    const stop = authM.onAuthStateChanged(auth, u => { if (u) { stop(); res(u); } });
    authM.signInAnonymously(auth).catch(rej);
  });
  S.uid = user.uid;
  F.onValue(F.ref(db, '.info/connected'), s => { if (s.val() && S.code && meRec()) markOnline(); });
  F.onValue(F.ref(db, '.info/serverTimeOffset'), s => { S.offset = s.val() || 0; });
}
const R = p => F.ref(db, `rooms/${S.code}${p ? '/' + p : ''}`);
const upd = obj => F.update(F.ref(db), Object.fromEntries(Object.entries(obj).map(([k, v]) => [`rooms/${S.code}/${k}`, v])));

function subscribe(code) {
  if (S.sub) S.sub();
  S.code = code; sess.set('battle-room', code);
  if (location.hash !== '#room=' + code) history.replaceState(null, '', '#room=' + code);
  S.sub = F.onValue(R(), snap => { S.room = snap.val(); route(); }, err => { leaveLocal(`Lost the connection to the room (${err.code || 'error'})`); });
}
function leaveLocal(notice) {
  if (S.sub) S.sub(); S.sub = null;
  S.code = null; S.room = null; S.local = null; S.screen = ''; sess.set('battle-room', null);
  history.replaceState(null, '', location.pathname + location.search);
  S.notice = notice || ''; clearTimers(); home();
}

// ======== Router ========
const isHost = () => S.room && S.room.meta && S.room.meta.host === S.uid;
const meRec = () => S.room && S.room.players && S.room.players[S.uid];
const playersBySeat = () => Object.entries((S.room && S.room.players) || {}).map(([uid, p]) => ({ uid, ...p })).sort((a, b) => a.seat - b.seat);
async function route() {
  const r = S.room;
  if (!S.code) return;
  if (!r || !r.meta) return leaveLocal('The host closed the room');
  if (!meRec()) return leaveLocal("You're no longer in that room");
  checkHost();
  if (S.local === 'settings') return;
  const st = r.meta.settings;
  if (curCat !== st.cat) { try { await loadCat(st.cat); } catch { /* shown on submit */ } if (S.room !== r) return; }
  const key = `${r.meta.state}:${r.meta.round || 1}`;
  if (r.meta.state === 'lobby') return lobby();
  if (r.meta.state === 'playing') return S.screen === key ? updateGame() : play(key);
  if (r.meta.state === 'done') return results(key);
}

// If the host's connection drops, the next player who is still here takes over hosting after a few seconds
// (a quick reload by the host keeps them as host).
function checkHost() {
  const r = S.room; if (!r || !r.meta || isHost()) return;
  const gone = () => { const h = S.room && S.room.players && S.room.players[S.room.meta.host]; return !h || h.online === false; };
  const heir = () => playersBySeat().find(p => p.online !== false && p.uid !== S.room.meta.host);
  if (!gone() || !heir() || heir().uid !== S.uid) { clearTimeout(S.handoff); S.handoff = null; return; }
  if (S.handoff) return;
  S.handoff = setTimeout(async () => {
    S.handoff = null;
    if (!S.room || isHost() || !gone() || !heir() || heir().uid !== S.uid) return;
    const old = S.room.meta.host;
    try { await F.runTransaction(R('meta/host'), cur => cur === old ? S.uid : undefined); } catch {}
  }, 6000);
}

// ======== Screens ========
function home() {
  clearTimers(); S.screen = 'home';
  const notice = S.notice; S.notice = '';
  $('#root').innerHTML = `<div class="wrap">
    <div class="row" style="margin:0 0 14px"><a class="textlink" href="index.html${S.fromId ? '#' + esc(S.fromId) : ''}" style="text-decoration:none">← Back to solo game</a></div>
    <div class="mark">Can you name 100?</div>
    <h1>Battle</h1>
    <p class="sub">Race your friends. One person hosts and picks the rules, everyone else joins with a code. No account needed.</p>
    ${notice ? `<div class="summary" style="margin:0 0 6px"><b>${esc(notice)}</b></div>` : ''}
    <label class="lab" for="nick">Your name for this game</label>
    <input class="field" id="nick" maxlength="16" placeholder="Player" value="${esc(S.nick)}" autocomplete="off">
    <div class="row">
      <button class="btn" id="hostBtn">Host a game</button>
      <button class="btn ghost" id="joinBtn">Join with a code</button>
    </div>
    <p class="note">Everyone plays on their own phone or computer at the same time. Your name is just for this game, like Jackbox or Kahoot, and is remembered on this device only. Your personal off-limits list from solo games doesn't apply here.</p>
  </div>`;
  const save = () => { S.nick = $('#nick').value.trim().slice(0, 16); store.set('battle-nick', S.nick); };
  $('#hostBtn').onclick = () => { save(); S.local = 'settings'; settings(false); };
  $('#joinBtn').onclick = () => { save(); join(); };
}

let openGroup = '';
function catModal(cur, pick) {
  openGroup = openGroup || CATS[cur].group;
  const m = document.createElement('div'); m.className = 'modal';
  const draw = () => {
    m.innerHTML = `<div class="sheet"><h2>Pick a Category</h2><div class="cats">${GROUP_ORDER.map(g => `
      <button class="grp ${g === openGroup ? 'open' : ''}" data-g="${g}"><b>${g}</b><span>${GROUPS[g].map(label).join(' · ')}</span></button>
      ${g === openGroup ? `<div class="grpbox">${GROUPS[g].map(id => `<button class="cat ${id === cur ? 'on' : ''}" data-c="${id}"><b>${esc(label(id))}</b><span>${FINITE[id] ? 'Name all ' + FINITE[id] : 'Name 100'}</span></button>`).join('')}</div>` : ''}`).join('')}</div>
      <div class="row"><button class="textlink" id="mclose">Cancel</button></div></div>`;
    m.querySelectorAll('.grp').forEach(b => b.onclick = () => { openGroup = openGroup === b.dataset.g ? '' : b.dataset.g; draw(); });
    m.querySelectorAll('.cat').forEach(b => b.onclick = () => { m.remove(); pick(b.dataset.c); });
    m.querySelector('#mclose').onclick = () => m.remove();
  };
  m.onclick = e => { if (e.target === m) m.remove(); };
  document.body.appendChild(m); draw();
}
function fixGoal(st, newCat) {
  if (newCat) { st.goal = st.mode === 'steal' && st.goal === 0 ? 0 : startGoal(st.cat); return; }
  if (st.mode === 'steal' && st.goal === 0) return;
  if (!goalOpts(st.cat).includes(st.goal)) st.goal = FINITE[st.cat] || 100;
}
function settings(inRoom) {
  clearTimers(); S.screen = 'settings';
  const st = S.draft;
  const chips = (key, vals, f) => `<div class="chips">${vals.map(v => `<button class="chip ${st[key] === v ? 'on' : ''}" data-k="${key}" data-v="${v}">${f(v)}</button>`).join('')}</div>`;
  let opts = '';
  if (st.mode === 'race') opts = `<label class="lab">Goal</label>${chips('goal', goalOpts(st.cat), v => FINITE[st.cat] === v ? 'Name all ' + v : v + ' names')}`;
  if (st.mode === 'timed') opts = `<label class="lab">Time limit</label>${chips('minutes', [1,3,5,10], v => v + ' min')}`;
  if (st.mode === 'steal') opts = `<label class="lab">Game ends</label>${chips('goal', [...goalOpts(st.cat), 0], v => v ? 'first to ' + goalLabel(v, st.cat) : 'when time runs out')}${st.goal === 0 ? `<label class="lab">Time limit</label>${chips('minutes', [1,3,5,10], v => v + ' min')}` : ''}`;
  if (st.mode === 'turns') opts = `<label class="lab">Time per turn</label>${chips('turnSecs', [5,10,15,20,30], v => v + 's')}<label class="lab">Lives</label>${chips('lives', [1,2,3], v => v)}`;
  const count = inRoom ? playersBySeat().length : 1;
  $('#root').innerHTML = `<div class="wrap">
    <div class="mark">Host settings</div>
    <h2>Set up your game</h2>
    <p class="sub">You pick the rules. Everyone who joins plays by them.</p>
    <label class="lab">Category</label>
    <button class="catpick" id="cat"><b>${esc(label(parentOf(st.cat)))}</b><span>${esc(CATS[st.cat].group)}${FINITE[st.cat] ? ' · ' + FINITE[st.cat] + ' total' : ''}</span></button>
    ${subsOf(parentOf(st.cat)).length ? `<label class="lab">${esc(CATS[parentOf(st.cat)].subKind)}</label><div class="chips">${[parentOf(st.cat), ...subsOf(parentOf(st.cat))].map(id => `<button class="chip subchip ${st.cat === id ? 'on' : ''}" data-c="${id}">${esc(CATS[id].sub ? (CATS[id].subShort || CATS[id].subName) : CATS[id].subAll)}</button>`).join('')}</div>` : ''}
    <label class="lab">Mode</label>
    <div class="choice">${Object.entries(MODES).map(([k, m]) => `<button class="opt ${st.mode === k ? 'on' : ''}" data-mode="${k}"><b>${m.name}</b><span>${m.blurb}</span></button>`).join('')}</div>
    ${opts}
    <label class="lab">Max players</label>
    ${chips('maxPlayers', [2,3,4,5,6,7,8].filter(n => n >= count), v => v)}
    <label class="lab">Between rounds</label>
    <div class="toggle"><div>Names from earlier rounds are off-limits<small>Only within this room's rematches · you can clear it anytime</small></div><button class="sw ${st.rematchOff ? 'on' : ''}" id="swOff" aria-label="Toggle"></button></div>
    <div class="summary"><b>${esc(label(st.cat))}</b> · ${modeLine(st)} · up to ${st.maxPlayers} players · earlier names ${st.rematchOff ? 'off-limits' : 'allowed'} in rematches</div>
    <div class="msg bad" id="smsg"></div>
    <div class="row"><button class="btn" id="create">${inRoom ? 'Save settings' : 'Create room'}</button><button class="textlink" id="back">Back</button></div>
  </div>`;
  const again = () => settings(inRoom);
  document.querySelectorAll('.chip:not(.subchip)').forEach(b => b.onclick = () => { st[b.dataset.k] = +b.dataset.v; again(); });
  document.querySelectorAll('.subchip').forEach(b => b.onclick = () => { st.cat = b.dataset.c; fixGoal(st, true); again(); });
  document.querySelectorAll('.opt').forEach(b => b.onclick = () => { st.mode = b.dataset.mode; fixGoal(st); again(); });
  $('#cat').onclick = () => catModal(parentOf(st.cat), id => { if (id !== parentOf(st.cat)) { st.cat = id; fixGoal(st, true); } again(); });
  $('#swOff').onclick = () => { st.rematchOff = !st.rematchOff; again(); };
  $('#back').onclick = () => { S.local = null; inRoom ? route() : home(); };
  $('#create').onclick = async e => {
    e.target.disabled = true;
    try {
      if (inRoom) { await upd({ 'meta/settings': { ...st } }); S.local = null; route(); }
      else await createRoom();
    } catch (err) { $('#smsg').textContent = 'Something went wrong: ' + (err.code || err.message); e.target.disabled = false; }
  };
}

async function claimSeat(max) {
  for (let i = 0; i < max; i++) {
    try { await F.set(R('seats/' + i), S.uid); return i; } catch { /* taken */ }
  }
  return -1;
}
async function addMe(seat) {
  const taken = new Set(playersBySeat().map(p => p.name.toLowerCase()));
  let name = S.nick || 'Player ' + (seat + 1), n = 2;
  const base = name.slice(0, 13);
  while (taken.has(name.toLowerCase())) name = base + ' ' + n++;
  await F.set(R('players/' + S.uid), { name, seat, count: 0, online: true, joinedAt: F.serverTimestamp() });
  markOnline();
}
function markOnline() {
  if (!S.code) return;
  F.set(R('players/' + S.uid + '/online'), true).catch(() => {});
  F.onDisconnect(R('players/' + S.uid + '/online')).set(false).catch(() => {});
}
async function createRoom() {
  for (let tries = 0; tries < 8; tries++) {
    const code = randomCode();
    S.code = code;
    const ex = await F.get(R('meta'));
    if (ex.exists()) continue;
    await F.set(R('meta'), { host: S.uid, settings: { ...S.draft }, state: 'lobby', round: 1, createdAt: F.serverTimestamp() });
    const seat = await claimSeat(1);
    S.room = { meta: { host: S.uid }, players: {} };
    await addMe(seat);
    S.local = null;
    return subscribe(code);
  }
  throw new Error('Could not find a free room code, try again');
}

function join(prefill = '', err = '') {
  clearTimers(); S.screen = 'join';
  $('#root').innerHTML = `<div class="wrap">
    <div class="mark">Join a game</div>
    <h2>Enter the room code</h2>
    <p class="sub">The host sees it on their screen, or they can send you the link.</p>
    <label class="lab" for="jnick">Your name for this game</label>
    <input class="field" id="jnick" maxlength="16" placeholder="Player" value="${esc(S.nick)}" autocomplete="off">
    <label class="lab" for="code">Room code</label>
    <form id="jf"><input class="field" id="code" placeholder="FROG-42" maxlength="7" autocomplete="off" value="${esc(prefill)}" style="text-transform:uppercase;font-family:var(--mono);letter-spacing:.08em"></form>
    <div class="msg bad" id="jmsg">${esc(err)}</div>
    <div class="row"><button class="btn" id="go">Join</button><button class="textlink" id="back">Back</button></div>
  </div>`;
  const go = async () => {
    const code = cleanCode($('#code').value);
    if (!code) { $('#jmsg').textContent = 'Codes look like FROG-42'; return; }
    S.nick = $('#jnick').value.trim().slice(0, 16); store.set('battle-nick', S.nick);
    $('#go').disabled = true; $('#jmsg').textContent = '';
    try { await joinRoom(code); } catch (e) { $('#jmsg').textContent = e.message; $('#go').disabled = false; }
  };
  $('#jf').onsubmit = e => { e.preventDefault(); go(); };
  $('#go').onclick = go;
  $('#back').onclick = home;
  (prefill && !err ? $('#jnick') : $('#code')).focus();
}
async function joinRoom(code) {
  S.code = code;
  const snap = await F.get(R());
  const r = snap.val();
  if (!r || !r.meta) { S.code = null; throw new Error(`No room called ${code}. Check the code with the host.`); }
  S.room = r;
  if (r.players && r.players[S.uid]) { markOnline(); return subscribe(code); }   // rejoining
  if (r.meta.state !== 'lobby') { S.code = null; throw new Error('That game already started. Ask the host to let you in next round.'); }
  const seat = await claimSeat(r.meta.settings.maxPlayers || 8);
  if (seat < 0) { S.code = null; throw new Error('That room is full.'); }
  await addMe(seat);
  subscribe(code);
}

function lobby() {
  clearTimers(); S.screen = 'lobby';
  const r = S.room, st = r.meta.settings, host = isHost(), ps = playersBySeat();
  const usedN = Object.keys(r.used || {}).length;
  const link = location.origin + location.pathname + '#room=' + S.code;
  $('#root').innerHTML = `<div class="wrap">
    <div class="mark">${(r.meta.round || 1) > 1 ? 'Round ' + r.meta.round + ' · ' : ''}Lobby</div>
    <h2>${host ? 'Share this code' : 'You\'re in!'}</h2>
    <div class="code">${S.code}</div>
    <div class="row" style="margin-top:4px"><button class="btn ghost" id="copy">Copy invite link</button></div>
    <div class="summary"><b>${esc(label(st.cat))}</b> · ${modeLine(st)}<br>${usedN && st.rematchOff ? `${usedN} ${usedN === 1 ? 'name' : 'names'} from earlier rounds ${usedN === 1 ? 'is' : 'are'} off-limits` : 'You only see counts during the game' + (st.mode === 'steal' ? ', except in Steal mode, where everyone sees every name' : '') + '. All names are revealed at the end.'}</div>
    <label class="lab">Players ${ps.length}/${st.maxPlayers}</label>
    <div class="players">${ps.map(p => `<div class="pl" style="${p.online === false ? 'opacity:.45' : ''}"><div class="av">${esc((p.name || '?')[0])}</div><div class="n">${esc(p.name)}${p.uid === S.uid ? ' (you)' : ''}${p.online === false ? ' · offline' : ''}</div><div class="t">${p.uid === r.meta.host ? 'host' : host ? `<button class="textlink" data-kick="${p.uid}">remove</button>` : ''}</div></div>`).join('')}</div>
    <div class="row">
      ${host ? `<button class="btn" id="start" ${ps.length < 2 ? 'disabled' : ''}>Start game</button><button class="btn ghost" id="edit">Change settings</button>${usedN ? '<button class="textlink" id="clearOff">Clear off-limits</button>' : ''}`
             : `<div class="mark">Waiting for the host to start…</div>`}
    </div>
    ${host && ps.length < 2 ? '<p class="note">You need at least 2 players to start. Send the code or link to a friend.</p>' : ''}
    <div class="row"><button class="textlink" id="leave">${host ? 'Close room' : 'Leave room'}</button></div>
  </div>`;
  $('#copy').onclick = async e => { try { await navigator.clipboard.writeText(link); e.target.textContent = 'Link copied'; } catch { e.target.textContent = link; } };
  if (host) {
    $('#start').onclick = e => { e.target.disabled = true; startGame(); };
    $('#edit').onclick = () => { S.draft = { ...st }; S.local = 'settings'; settings(true); };
    if ($('#clearOff')) $('#clearOff').onclick = () => upd({ used: null });
    document.querySelectorAll('[data-kick]').forEach(b => b.onclick = () => {
      const p = r.players[b.dataset.kick]; if (!p) return;
      upd({ ['players/' + b.dataset.kick]: null, ['seats/' + p.seat]: null });
    });
  }
  $('#leave').onclick = leaveRoom;
}
async function leaveRoom() {
  try {
    if (isHost()) await F.remove(R());
    else { const me = meRec(); await F.onDisconnect(R('players/' + S.uid + '/online')).cancel(); await upd({ ['players/' + S.uid]: null }); if (me) await F.remove(R('seats/' + me.seat)); }
  } catch {}
  leaveLocal('');
}

// ======== Game ========
async function startGame() {
  const r = S.room, st = r.meta.settings, ps = playersBySeat();
  const startAt = now() + 3600;
  const u = { 'meta/state': 'playing', 'meta/startAt': startAt, 'meta/endAt': null, 'meta/endedAt': null, pool: null, names: null, turn: null };
  if (st.mode === 'timed' || (st.mode === 'steal' && !st.goal)) u['meta/endAt'] = startAt + st.minutes * 60000;
  for (const p of ps) {
    u[`players/${p.uid}/count`] = 0; u[`players/${p.uid}/finishedAt`] = null;
    u[`players/${p.uid}/out`] = null; u[`players/${p.uid}/outAt`] = null;
    u[`players/${p.uid}/lives`] = st.mode === 'turns' ? st.lives : null;
  }
  if (st.mode === 'turns') u.turn = { uid: ps[0].uid, n: 1, deadline: startAt + st.turnSecs * 1000 };
  await upd(u);
}
const G = {};   // per-round local game state
function play(key) {
  clearTimers(); S.screen = key;
  const r = S.room, st = r.meta.settings, M = st.mode;
  Object.assign(G, { handled: new Set(), over: false, total: FINITE[st.cat] || (cfg() && cfg().finite ? META.size : null) });
  $('#root').innerHTML = `<div class="game">
    <div class="gtop"><div class="mode">${esc(label(st.cat))} · ${modeLine(st)}</div><div class="clock" id="clock">0:00</div></div>
    <div class="board" id="board"></div>
    ${M === 'turns' ? '<div class="turnbar"><i id="tb"></i></div>' : ''}
    <div class="entry">
      <div class="lab" id="prompt">${esc(CATS[st.cat].prompt)} — press enter ↵</div>
      <form id="f"><input id="ans" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Start typing"></form>
      <div class="rule"></div>
      <div class="msg" id="msg">${M === 'steal' ? 'Steal mode: every name shows below as it is taken' : 'You only see everyone\'s count. Names are revealed at the end.'}</div>
    </div>
    <div class="feed" id="feed"></div>
    <div class="row" style="justify-content:center;padding-bottom:24px">${isHost() ? '<button class="textlink" id="endNow">End game for everyone</button>' : ''}</div>
  </div>`;
  $('#f').onsubmit = e => { e.preventDefault(); submit(); };
  if ($('#endNow')) $('#endNow').onclick = () => endGame();
  const ov = document.createElement('div'); ov.className = 'count3'; ov.id = 'cd'; document.body.appendChild(ov);
  S.timers.push(setInterval(tick, 200));
  updateGame(); tick();
}
function setMsg(t, bad) { const m = $('#msg'); if (!m) return; m.textContent = t; m.className = 'msg' + (bad ? ' bad' : ''); }
function started() { return S.room && S.room.meta.startAt && now() >= S.room.meta.startAt; }
function updateGame() {
  const r = S.room; if (!r || !$('#board')) return;
  const st = r.meta.settings, M = st.mode, ps = playersBySeat();
  const goal = (M === 'race' || (M === 'steal' && st.goal)) ? st.goal : null;
  const turnUid = r.turn && r.turn.uid;
  const sorted = M === 'turns' ? ps : [...ps].sort((a, b) => (b.count || 0) - (a.count || 0));
  $('#board').innerHTML = sorted.map(p => `<div class="sc ${p.uid === S.uid ? 'me' : ''} ${M === 'turns' && turnUid === p.uid ? 'turn' : ''} ${p.out ? 'out' : ''}">
    <div class="nm">${esc(p.name)}${p.uid === S.uid ? ' (you)' : ''}${p.online === false ? ' · offline' : ''}</div><div class="ct">${p.count || 0}</div>
    ${M === 'turns' ? `<div class="lives">${'♥'.repeat(Math.max(0, p.lives || 0))}${p.out ? ' out' : ''}</div>` : `<div class="bar"><i style="width:${goal ? Math.min(100, (p.count || 0) / goal * 100) : Math.min(100, p.count || 0)}%"></i></div>`}</div>`).join('');
  // feed: your own names, or everyone's in Steal
  const items = [];
  if (M === 'steal') for (const [k, v] of Object.entries(r.pool || {})) items.push({ name: v.name, uid: v.uid, t: v.t || 0 });
  else for (const [k, v] of Object.entries((r.names || {})[S.uid] || {})) items.push({ name: v.name || v, uid: S.uid, t: v.t || 0 });
  items.sort((a, b) => b.t - a.t);
  const nameOf = uid => (r.players[uid] || {}).name || 'someone';
  $('#feed').innerHTML = items.map(it => `<div class="it ${it.uid === S.uid ? '' : 'them'}">${esc(it.name)}<small>${it.uid === S.uid ? 'you' : esc(nameOf(it.uid))}</small></div>`).join('');
  // input availability
  const me = meRec(), ans = $('#ans');
  const myTurn = M !== 'turns' || turnUid === S.uid;
  ans.disabled = !started() || G.over || (me && me.out) || !myTurn;
  if (M === 'turns') $('#prompt').textContent = me && me.out ? 'You\'re out · watch the others' : myTurn ? 'Your turn — press enter ↵' : `${nameOf(turnUid)}'s turn…`;
  if (!ans.disabled && document.activeElement !== ans) ans.focus();
  if (isHost()) hostReferee();
}
function tick() {
  const r = S.room; if (!r || r.meta.state !== 'playing') return;
  const st = r.meta.settings, M = st.mode, t = now();
  const cd = $('#cd');
  if (cd) { if (t < r.meta.startAt) cd.textContent = Math.ceil((r.meta.startAt - t) / 1000); else { cd.remove(); updateGame(); } }
  const clock = $('#clock');
  if (clock) clock.textContent = r.meta.endAt ? fmt(Math.min(r.meta.endAt - t, r.meta.endAt - r.meta.startAt)) : fmt(t - r.meta.startAt);
  if (r.meta.endAt && t >= r.meta.endAt && !G.over) { G.over = true; setMsg('Time!'); updateGame(); }
  if (M === 'turns' && r.turn) {
    const left = r.turn.deadline - t;
    const tb = $('#tb'); if (tb) tb.style.width = Math.max(0, Math.min(100, left / (st.turnSecs * 1000) * 100)) + '%';
    // the player whose turn it is handles their own timeout; the host covers anyone who has gone quiet
    if (left <= 0 && ((r.turn.uid === S.uid) || (isHost() && left <= -2500))) failTurn(r.turn, 'ran out of time');
  }
  if (isHost()) hostReferee();
}
async function submit() {
  const r = S.room, ans = $('#ans');
  if (!r || G.over || !started() || ans.disabled) return;
  const raw = ans.value.trim(); if (!raw) return;
  const st = r.meta.settings, M = st.mode;
  if (!cfg() || curCat !== st.cat) { setMsg('Still loading the answer list…', true); return; }
  const res = checkAnswer(raw);
  if (res.err) { setMsg(res.err, true); return; }
  const canon = res.canon, k = norm(canon);
  if (!k || k.length > 80) { setMsg('Try a shorter name', true); return; }
  if (st.rematchOff && r.used && r.used[k]) { setMsg(`${canon} was used in an earlier round`, true); return; }
  const mine = (r.names || {})[S.uid] || {};
  const turn = r.turn;
  if (mine[k]) { ans.value = ''; return M === 'turns' ? failTurn(turn, `said ${canon} again`) : setMsg(`You already named ${canon}`, true); }
  if (M === 'steal' || M === 'turns') {
    const taken = (r.pool || {})[k];
    if (taken) {
      ans.value = '';
      if (M === 'turns') return failTurn(turn, `said ${canon}, which was already said`);
      return setMsg(`${taken.uid === S.uid ? 'You' : (r.players[taken.uid] || {}).name || 'Someone'} already took ${canon}`, true);
    }
    try { await F.set(R('pool/' + k), { uid: S.uid, name: canon, t: F.serverTimestamp() }); }
    catch { ans.value = ''; return M === 'turns' ? failTurn(turn, `said ${canon}, which was already said`) : setMsg(`Someone just took ${canon}`, true); }
  }
  ans.value = '';
  const newCount = Object.keys(mine).length + 1;
  const u = { [`names/${S.uid}/${k}`]: { name: canon, t: F.serverTimestamp() }, [`players/${S.uid}/count`]: newCount };
  const goal = (M === 'race' || (M === 'steal' && st.goal)) ? st.goal : null;
  if (goal && newCount >= goal) u[`players/${S.uid}/finishedAt`] = F.serverTimestamp();
  await upd(u);
  setMsg(M === 'steal' ? `${canon} is yours` : `${canon} counts`);
  if (M === 'turns') await advanceTurn(turn);
}
function nextUid(fromUid) {
  const alive = playersBySeat().filter(p => !p.out || p.uid === fromUid);
  if (!alive.length) return null;
  const i = alive.findIndex(p => p.uid === fromUid);
  for (let j = 1; j <= alive.length; j++) { const p = alive[(i + j) % alive.length]; if (!p.out && p.uid !== fromUid) return p.uid; }
  return fromUid;
}
async function advanceTurn(turn) {
  const st = S.room.meta.settings;
  const next = nextUid(turn.uid);
  const res = await F.runTransaction(R('turn'), cur => {
    if (!cur || cur.n !== turn.n) return;            // someone already moved the turn on
    return { uid: next, n: turn.n + 1, deadline: now() + st.turnSecs * 1000 };
  });
  return res.committed;
}
async function failTurn(turn, why) {
  if (!turn || G.handled.has(turn.n)) return;
  G.handled.add(turn.n);
  const r = S.room, p = r.players[turn.uid]; if (!p) return;
  if (!(await advanceTurn(turn))) return;
  const lives = (p.lives || 1) - 1;
  const u = { [`players/${turn.uid}/lives`]: Math.max(0, lives) };
  if (lives <= 0) { u[`players/${turn.uid}/out`] = true; u[`players/${turn.uid}/outAt`] = F.serverTimestamp(); }
  await upd(u);
  setMsg(`${turn.uid === S.uid ? 'You' : p.name} ${why}${lives <= 0 ? (turn.uid === S.uid ? ' · you\'re out' : ' · out') : ' · lost a life'}`, true);
}
function hostReferee() {
  const r = S.room; if (!r || r.meta.state !== 'playing' || G.ending) return;
  const st = r.meta.settings, M = st.mode, ps = playersBySeat(), t = now();
  const goal = (M === 'race' || (M === 'steal' && st.goal)) ? st.goal : null;
  let done = false;
  if (goal && ps.some(p => p.finishedAt)) done = true;
  if (r.meta.endAt && t >= r.meta.endAt + 800) done = true;
  if (M === 'turns' && ps.length > 1 && ps.filter(p => !p.out).length <= 1) done = true;
  if ((M === 'steal' || M === 'turns') && G.total && Object.keys(r.pool || {}).length >= G.total) done = true;
  if (done) endGame();
}
async function endGame() {
  if (G.ending) return; G.ending = true;
  try { await upd({ 'meta/state': 'done', 'meta/endedAt': F.serverTimestamp() }); } finally { G.ending = false; }
}

// ======== Results ========
function ranked() {
  const r = S.room, M = r.meta.settings.mode;
  return playersBySeat().sort((a, b) => M === 'turns'
    ? ((a.out ? 1 : 0) - (b.out ? 1 : 0)) || ((b.outAt || 0) - (a.outAt || 0)) || ((b.count || 0) - (a.count || 0))
    : ((b.count || 0) - (a.count || 0)) || ((a.finishedAt || 9e15) - (b.finishedAt || 9e15)));
}
const SPARK = '<path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"/>';
function results(key) {
  const r = S.room, st = r.meta.settings, host = isHost(), rank = ranked();
  // the room updates often (presence, host hand-off); only redraw when something on this screen changes
  const sig = [key, r.meta.host, rank.map(p => p.uid + ':' + (p.count || 0) + ':' + (p.online !== false)).join(',')].join('|');
  if (S.screen === key && S.resultsSig === sig) return;
  clearTimers(); S.screen = key; S.resultsSig = sig;
  const cd = $('#cd'); if (cd) cd.remove();
  const namesOf = uid => Object.values((r.names || {})[uid] || {}).sort((a, b) => (a.t || 0) - (b.t || 0)).map(v => v.name || v);
  const tie = rank.length > 1 && st.mode !== 'turns' && (rank[0].count || 0) === (rank[1].count || 0) && !rank[0].finishedAt;
  const iWon = !tie && rank[0].uid === S.uid;
  let dur = (r.meta.endedAt || now()) - r.meta.startAt;
  if (r.meta.endAt) dur = Math.min(dur, r.meta.endAt - r.meta.startAt);
  const usedAfter = new Set([...Object.keys(r.used || {}), ...Object.values(r.names || {}).flatMap(o => Object.keys(o))]).size;
  // 25 dots per row: share of the goal (or of the best score when there is no goal)
  const goal = (st.mode === 'race' || (st.mode === 'steal' && st.goal)) ? st.goal : Math.max(1, ...rank.map(p => p.count || 0));
  const dots = (n, mine) => Array.from({ length: 25 }, (_, i) => `<i class="${i < Math.round(Math.min(1, n / goal) * 25) ? 'f' : ''}${mine ? ' bdot' : ''}" style="animation-delay:${(i * 0.034).toFixed(2)}s"></i>`).join('');
  const sparks = () => Array.from({ length: 16 }, () => { const z = [9, 11, 13, 15][Math.floor(Math.random() * 4)];
    return `<svg class="tw" width="${z}" height="${z}" viewBox="0 0 10 10" style="left:${(4 + Math.random() * 90).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(0.4 + Math.random() * 1.7).toFixed(2)}s">${SPARK}</svg>`; }).join('');
  const head = tie ? 'It\'s a tie' : iWon ? 'You win' : esc(rank[0].name) + ' wins';
  $('#root').innerHTML = `<div class="wrap">
    <div class="mark">Round ${r.meta.round || 1} · ${esc(label(st.cat))}</div>
    <div class="mark" style="margin-top:14px">round over · ${fmt(dur)}</div>
    <h2 class="winh ${iWon ? 'win' : ''}">${head}</h2>
    <p class="sub">${modeLine(st)}</p>
    <ol class="stand">${rank.map((p, i) => { const me = p.uid === S.uid, cel = me && iWon;
      return `<li class="${i === 0 && !tie ? 'top' : ''}${cel ? ' cel' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(me ? 'You' : p.name)}${p.online === false ? ' <small>left</small>' : ''}</span><span class="ct"><span class="${cel ? 'sz' : ''}">${p.count || 0}</span></span>
        <div class="sdots" aria-hidden="true">${dots(p.count || 0, cel)}</div>${cel ? `<div class="sparks" aria-hidden="true">${sparks()}</div>` : ''}</li>`; }).join('')}</ol>
    <div class="row">
      ${host ? `<button class="btn" id="again">Rematch</button><button class="btn ghost" id="edit">Change settings</button>` : `<div class="mark">Waiting for the host…</div>`}
      <button class="btn ghost" id="share">Share results</button>
    </div>
    <label class="lab">Everyone's names</label>
    ${rank.map(p => { const ns = namesOf(p.uid); return `<details ${p.uid === S.uid ? 'open' : ''}><summary>${esc(p.name)}${p.uid === S.uid ? ' (you)' : ''} · ${p.count || 0}</summary><p>${ns.length ? ns.map(esc).join(', ') : 'No names'}</p></details>`; }).join('')}
    ${host && st.rematchOff ? `<p class="note">Rematch keeps the same room and rules. The ${usedAfter} names used so far become off-limits for the next round (only in this room). You can clear them from the lobby.</p>` : ''}
    <div class="row"><button class="textlink" id="leave">${host ? 'Close room' : 'Leave room'}</button></div>
  </div>`;
  const toLobby = async () => {
    const u = { 'meta/state': 'lobby', 'meta/round': (r.meta.round || 1) + 1, 'meta/startAt': null, 'meta/endAt': null, 'meta/endedAt': null, names: null, pool: null, turn: null };
    if (st.rematchOff) { const used = { ...(r.used || {}) }; for (const o of Object.values(r.names || {})) for (const [k, v] of Object.entries(o)) used[k] = v.name || v; u.used = used; }
    for (const p of playersBySeat()) { u[`players/${p.uid}/count`] = 0; u[`players/${p.uid}/finishedAt`] = null; u[`players/${p.uid}/out`] = null; u[`players/${p.uid}/outAt`] = null; u[`players/${p.uid}/lives`] = null; }
    await upd(u);
  };
  if (host) {
    $('#again').onclick = e => { e.target.disabled = true; toLobby(); };
    $('#edit').onclick = async () => { await toLobby(); };
  }
  $('#share').onclick = async e => {
    const txt = `${label(st.cat)} battle · ${modeLine(st)}\n` + rank.map((p, i) => `${i + 1}. ${p.name}: ${p.count || 0}`).join('\n') + '\n' + location.origin + location.pathname;
    try { if (navigator.share) await navigator.share({ text: txt }); else { await navigator.clipboard.writeText(txt); e.target.textContent = 'Copied!'; } } catch {}
  };
  $('#leave').onclick = leaveRoom;
}

// ======== Start-up ========
function offline(why) {
  const h = location.hash;
  $('#root').innerHTML = `<div class="wrap">
    <div class="row" style="margin:0 0 14px"><a class="textlink" href="index.html${S.fromId ? '#' + esc(S.fromId) : ''}" style="text-decoration:none">← Back to solo game</a></div>
    <div class="mark">Can you name 100?</div><h1>Battle</h1>
    <p class="sub">Live battles need a connection to the game server, and this page couldn't reach it${why ? ' (' + esc(why) + ')' : ''}. That's expected inside Claude: live battles run on the website.</p>
    <div class="row"><a class="btn" href="battle-demo.html${esc(h)}" style="text-decoration:none">Try the offline demo</a><button class="btn ghost" onclick="location.reload()">Try again</button></div>
  </div>`;
}
(async () => {
  const h = decodeURIComponent(location.hash.slice(1));
  const [k, ...rest] = h.split('='); const v = rest.join('=');
  if (k === 'from' || k === 'host') {
    const id = v.split('|')[1]; S.fromId = id;
    if (CATS[id]) { S.draft.cat = id; fixGoal(S.draft, true); }
  }
  $('#root').innerHTML = '<div class="wrap"><div class="mark">Connecting…</div></div>';
  try {
    await Promise.race([connect(), new Promise((_, rej) => setTimeout(() => rej(new Error('timed out')), 10000))]);
  } catch (e) { return offline(e && e.message); }
  const code = k === 'room' ? cleanCode(v) : cleanCode(sess.get('battle-room'));
  if (k === 'host') { S.local = 'settings'; return settings(false); }
  if (code) {
    try {
      S.code = code; const r = (await F.get(R())).val(); S.code = null;
      const mine = r && r.players && r.players[S.uid];
      if (!mine && k === 'room' && r && r.meta && r.meta.state === 'lobby') { sess.set('battle-room', null); return join(code); }   // invite link: pick a name first
      await joinRoom(code); return;
    }
    catch (e) { sess.set('battle-room', null); history.replaceState(null, '', location.pathname + location.search); return k === 'room' ? join(code, e.message) : home(); }
  }
  home();
})();
