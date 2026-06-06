// =====================================================
// GATO THE CAT — Chat-Bot mit The Cat API
// =====================================================

// --- DOM-Elemente holen ---
const screenLanding  = document.getElementById('screen-landing');
const screenQuestion = document.getElementById('screen-question');
const screenChat     = document.getElementById('screen-chat');

const btnLetsGo  = document.getElementById('btn-lets-go');
const btnYes     = document.getElementById('btn-yes');
const btnNope    = document.getElementById('btn-nope');
const btnExit    = document.getElementById('btn-exit');
const btnSend    = document.getElementById('btn-send');

const chatMessages = document.getElementById('chat-messages');
const chatInput    = document.getElementById('chat-input');
const loadingWrap  = document.getElementById('loading');

// --- API ---
const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';

// --- Witzige Antworten von Gato (wird zufällig ausgewählt) ---
// Je nach Stimmung gibt es verschiedene Sets
const responsesWhenSad = [
  "Mrrrow... Hier, schau dir DAS an. Besser? Dachte ich mir. 🐾",
  "Ich schicke dir eine Katze. Du wirst es überleben. *schnurr*",
  "Diese Katze hat beschlossen, dein Problem zu ignorieren — genau wie alle anderen Probleme im Leben.",
  "Humans are dramatic. Cats are... also dramatic. Hier, ein Beweis.",
  "*Haut dein Glas vom Tisch* Na? Lächelst du schon? Gern geschehen.",
  "Die einzig korrekte Reaktion auf deine Situation: Ein Katzenbild. Bitte sehr.",
  "Diese Katze hat keine Probleme. Von ihr kannst du noch was lernen.",
];

const responsesWhenHappy = [
  "Du bist glücklich? Gut. Hier ist eine Katze damit es so bleibt. 😼",
  "Ausgezeichnet. Eine Katze zur Feier des Tages!",
  "Glücklich?! Das ruft nach einer Katze. Immer.",
  "Deine gute Laune verdient eine gute Katze. Done.",
  "Eine Katze für einen happy Menschen. Das Universum ist ausgeglichen.",
];

const responsesDefault = [
  "Ich höre dich. Hier, eine Katze statt Worte. 🐱",
  "*blinzelt langsam* Das hier soll dir helfen.",
  "Die Katze hat zugehört. Die Katze sendet dieses Bild.",
  "Hmm. *denkt nach* Katze.",
  "Ich bin eine Katze, kein Therapeut. Aber schau mal!",
  "Purrrrr... Ich antworte mit dem Einzigen was ich habe: einer Katze.",
  "Du sagst Worte. Ich schicke Katze. Das ist mein Job.",
];

// Merkt sich ob User "sad" oder "happy" ist
let userMood = 'default';

// =====================================================
// SCREEN-WECHSEL
// =====================================================

// Zeigt einen Screen, versteckt alle anderen
function showScreen(screenEl) {
  [screenLanding, screenQuestion, screenChat].forEach(s => s.classList.add('hidden'));
  screenEl.classList.remove('hidden');
}

// "Let's go" → Feeling Sad?
btnLetsGo.addEventListener('click', () => {
  showScreen(screenQuestion);
});

// "Yes" → Chat öffnen, Intro-Nachricht von Gato
btnYes.addEventListener('click', () => {
  userMood = 'sad';
  showScreen(screenChat);
  addGatoIntro("Oh nein... Ich bin hier. Schreib mir, ich schicke dir eine Katze! 🐾");
});

// "Nope" → Chat öffnen, andere Intro-Nachricht
btnNope.addEventListener('click', () => {
  userMood = 'happy';
  showScreen(screenChat);
  addGatoIntro("Ausgezeichnet! Eine Katze zur Feier deiner guten Laune. Schreib mir was! 😼");
});

// "Exit" → zurück zur Landing Page, Chat leeren
btnExit.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  userMood = 'default';
  showScreen(screenLanding);
});

// =====================================================
// CHAT-LOGIK
// =====================================================

// Send-Button ODER Enter-Taste auslösen
btnSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return; // Leere Nachricht ignorieren

  chatInput.value = '';

  // 1. User-Nachricht anzeigen
  addUserMessage(text);

  // 2. Lade-Animation einblenden
  showLoading(true);

  // 3. Katzenbild von der API holen
  try {
    const response = await fetch(CAT_API_URL);
    const data = await response.json();
    const imageUrl = data[0].url;

    // Kurze Pause damit die Animation sichtbar ist (realistischer)
    await delay(800);

    showLoading(false);

    // 4. Gato-Antwort anzeigen (Bild + witziger Spruch)
    const quote = getRandomQuote(text);
    addGatoMessage(imageUrl, quote);

  } catch (err) {
    // API-Fehler abfangen
    showLoading(false);
    addGatoMessage(null, "Hmm... Die Katzen sind gerade beschäftigt. Versuch's nochmal! 😿");
    console.error('Cat API Fehler:', err);
  }
}

// =====================================================
// NACHRICHTEN-FUNKTIONEN (DOM-Manipulation)
// =====================================================

// Intro-Nachricht von Gato (nur Text, kein Bild)
function addGatoIntro(text) {
  const div = document.createElement('div');
  div.className = 'msg-gato';
  div.innerHTML = `<div class="gato-text">${text}</div>`;
  chatMessages.appendChild(div);
}

// User-Nachricht (rechts)
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg-user';
  div.textContent = text;
  chatMessages.appendChild(div);
  scrollToBottom();
}

// Gato-Antwort (links): Bild + Text
function addGatoMessage(imageUrl, quote) {
  const div = document.createElement('div');
  div.className = 'msg-gato';

  // Bild nur wenn URL vorhanden
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Katze von Gato';
    div.appendChild(img);
  }

  const textEl = document.createElement('div');
  textEl.className = 'gato-text';
  textEl.textContent = quote;
  div.appendChild(textEl);

  chatMessages.appendChild(div);
  scrollToBottom();
}

// Lade-Animation ein/ausblenden
function showLoading(visible) {
  loadingWrap.classList.toggle('hidden', !visible);
  if (visible) scrollToBottom();
}

// Scrollt automatisch zum Ende der Nachrichten
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

// Wählt zufälligen Spruch basierend auf Stimmung und Nachricht
function getRandomQuote(userText) {
  const lower = userText.toLowerCase();

  // Erkennt traurige Keywords
  const sadKeywords = ['sad', 'traurig', 'schlecht', 'müde', 'müde', 'stress', 'hilf', 'help', 'schlimm', 'crying', 'weine'];
  // Erkennt fröhliche Keywords
  const happyKeywords = ['happy', 'glücklich', 'gut', 'super', 'toll', 'great', 'amazing', 'yay', 'yeah'];

  const isSad   = sadKeywords.some(k => lower.includes(k)) || userMood === 'sad';
  const isHappy = happyKeywords.some(k => lower.includes(k)) || userMood === 'happy';

  let pool;
  if (isSad)        pool = responsesWhenSad;
  else if (isHappy) pool = responsesWhenHappy;
  else              pool = responsesDefault;

  return pool[Math.floor(Math.random() * pool.length)];
}

// Kurze Pause (für realistisches Tipp-Gefühl)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
