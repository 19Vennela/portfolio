/* ===============================================================
   script.js — Vennela's Portfolio Magic
   =============================================================== */

// ── Custom Botanical Cursor (no trail) ──────────────────────
var cursor = document.getElementById('cursor');
var mx = -100, my = -100;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  }
});

// Hover effect on interactive elements
document.querySelectorAll('a, button, [tabindex="0"]').forEach(function(el) {
  el.addEventListener('mouseenter', function() { if (cursor) cursor.classList.add('cursor--hover'); });
  el.addEventListener('mouseleave', function() { if (cursor) cursor.classList.remove('cursor--hover'); });
});

// ── Nav on Scroll ──────────────────────────────────────────
var nav = document.getElementById('mainNav');
window.addEventListener('scroll', function() {
  if (!nav) return;
  nav.classList.toggle('nav--scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger / Mobile Menu ────────────────────────────────
var hamburger  = document.getElementById('navHamburger');
var mobileMenu = document.getElementById('mobileMenu');

// Create backdrop element for close-on-outside-click
var backdrop = document.createElement('div');
backdrop.className = 'mobile-menu-backdrop';
document.body.appendChild(backdrop);

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  backdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', function() {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

// Close on any mobile-link click
document.querySelectorAll('.mobile-link').forEach(function(link) {
  link.addEventListener('click', closeMobileMenu);
});

// Close when clicking outside (backdrop)
backdrop.addEventListener('click', closeMobileMenu);

// ── Scroll Progress Vine ───────────────────────────────────
var vineFill = document.getElementById('vineFill');
window.addEventListener('scroll', function() {
  if (!vineFill) return;
  var scrollTop = window.scrollY;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var scrollPct = docHeight > 0 ? scrollTop / docHeight : 0;
  vineFill.style.height = (scrollPct * window.innerHeight) + 'px';
}, { passive: true });

// ── Reveal on Scroll ───────────────────────────────────────
function setupReveal() {
  var els = document.querySelectorAll('.reveal');
  var vh  = window.innerHeight;

  els.forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top >= vh - 40) {
      el.classList.add('will-animate');
    }
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal.will-animate').forEach(function(el) {
    observer.observe(el);
  });
}

setupReveal();

// ── Hero Parallax ──────────────────────────────────────────
var heroPhoto = document.getElementById('heroPhoto');
window.addEventListener('scroll', function() {
  if (!heroPhoto) return;
  heroPhoto.style.transform = 'scale(1.04) translateY(' + (window.scrollY * 0.25) + 'px)';
}, { passive: true });

// ── Smooth Anchor Scrolling ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = anchor.getAttribute('href');
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Scroll Hint Hide ───────────────────────────────────────
var scrollHint = document.getElementById('scrollHint');
window.addEventListener('scroll', function() {
  if (window.scrollY > 80 && scrollHint) scrollHint.style.opacity = '0';
}, { passive: true, once: true });

// ── Card Hover Particle Burst ──────────────────────────────
document.querySelectorAll('.project-card').forEach(function(card) {
  card.addEventListener('mouseenter', function() {
    playCardHover();   // subtle sound if enabled
    var rect = card.getBoundingClientRect();
    var symbols = ['✦', '·', '✿', '❋', '◦'];
    for (var i = 0; i < 4; i++) {
      (function(delay) {
        setTimeout(function() {
          var p = document.createElement('div');
          var sym = symbols[Math.floor(Math.random() * symbols.length)];
          var clr = Math.random() > 0.5 ? 'hsl(38,80%,65%)' : 'hsl(345,55%,70%)';
          p.textContent = sym;
          p.style.cssText = [
            'position:fixed',
            'pointer-events:none',
            'z-index:999',
            'left:' + (rect.left + Math.random() * rect.width) + 'px',
            'top:' + (rect.top + Math.random() * 40) + 'px',
            'font-size:' + (9 + Math.random() * 10) + 'px',
            'color:' + clr,
            'opacity:1',
            'transition:all 0.7s ease'
          ].join(';');
          document.body.appendChild(p);
          requestAnimationFrame(function() {
            p.style.opacity = '0';
            p.style.transform = 'translateY(-' + (20 + Math.random() * 40) + 'px) scale(0.3)';
          });
          setTimeout(function() { p.remove(); }, 800);
        }, delay);
      })(i * 80);
    }
  });
});

// ── PromptSense Demo ───────────────────────────────────────
var embedInput    = document.getElementById('embedInput');
var embedSend     = document.getElementById('embedSend');
var embedMessages = document.getElementById('embedMessages');

var FEEDBACK = [
  {
    score: 8,
    msg: 'Nice work! Your prompt has good clarity. Try adding a <strong>persona</strong> (e.g. "Act as a senior UX designer") to sharpen the AI\'s lens. Specifying an output format — like "give 3 bullet points" — will tighten the response considerably.'
  },
  {
    score: 6,
    msg: 'This prompt has potential! Right now it\'s a bit broad. Try adding <strong>context</strong> about why you need this (e.g., "for a beginner audience"), and add <strong>constraints</strong> — word limits or format guides help a lot.'
  },
  {
    score: 9,
    msg: 'Excellent prompt! ✦ Strong persona, clear task, well-scoped context. One tweak: end with your preferred <strong>output format</strong> to remove any ambiguity. You\'re already at pro level.'
  },
  {
    score: 7,
    msg: 'Good foundation! The task is clear, but the prompt doesn\'t specify <strong>who the audience is</strong>. Adding that context will make the AI tailor its tone much more effectively for you.'
  },
  {
    score: 5,
    msg: 'The core idea is there, but it\'s a bit vague. Add a <strong>task verb</strong> (explain, compare, summarize, draft…), your <strong>goal</strong>, and at least one <strong>constraint</strong>. Think: Persona + Task + Context + Format = ✨'
  }
];

function appendMessage(html, role) {
  var msg = document.createElement('div');
  msg.classList.add('embed-msg', role);
  if (role === 'bot') {
    var avatar = document.createElement('div');
    avatar.classList.add('bot-avatar');
    avatar.textContent = '✨';
    msg.appendChild(avatar);
  }
  var bubble = document.createElement('div');
  bubble.classList.add('msg-bubble');
  bubble.innerHTML = html;
  msg.appendChild(bubble);
  embedMessages.appendChild(msg);
  embedMessages.scrollTop = embedMessages.scrollHeight;
}

function showTyping() {
  var msg = document.createElement('div');
  msg.classList.add('embed-msg', 'bot');
  msg.id = 'typingMsg';
  var avatar = document.createElement('div');
  avatar.classList.add('bot-avatar');
  avatar.textContent = '✨';
  msg.appendChild(avatar);
  var bubble = document.createElement('div');
  bubble.classList.add('msg-bubble', 'typing');
  msg.appendChild(bubble);
  embedMessages.appendChild(msg);
  embedMessages.scrollTop = embedMessages.scrollHeight;
}

function removeTyping() {
  var t = document.getElementById('typingMsg');
  if (t) t.remove();
}

function analyzePrompt() {
  if (!embedInput) return;
  var text = embedInput.value.trim();
  if (!text) {
    embedInput.style.borderColor = 'hsla(345,60%,62%,0.7)';
    setTimeout(function() { embedInput.style.borderColor = ''; }, 700);
    return;
  }
  appendMessage(text.replace(/</g, '&lt;').replace(/>/g, '&gt;'), 'user');
  embedInput.value = '';
  embedSend.disabled = true;
  embedSend.textContent = '…';
  showTyping();

  setTimeout(function() {
    removeTyping();
    var resp = FEEDBACK[Math.floor(Math.random() * FEEDBACK.length)];
    appendMessage(
      '<span style="color:hsl(42,90%,65%);font-weight:600">Score: ' + resp.score + '/10</span><br><br>' + resp.msg,
      'bot'
    );
    embedSend.disabled = false;
    embedSend.innerHTML = '<span>Analyze ✦</span>';
  }, 1400 + Math.random() * 600);
}

if (embedSend) embedSend.addEventListener('click', analyzePrompt);
if (embedInput) {
  embedInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzePrompt();
    }
  });
}

// ── Specimen Tooltips ──────────────────────────────────────
var specLabels = {
  spec1: 'User interviews, surveys, affinity maps',
  spec2: 'Wireframes, interactive flows, usability tests',
  spec3: 'Components, auto-layout, design systems',
  spec4: 'WatchOS, wearable interaction patterns'
};
Object.keys(specLabels).forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.title = specLabels[id];
});

/* ================================================================
   SOUND SYSTEM — Web Audio API (synthesised, no external files)
   ================================================================ */
var audioCtx     = null;
var masterGain   = null;
var ambientStarted = false;
var soundEnabled = false;

function initAudioCtx() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);
}

// -- Gate creak + magic chime (plays on gate enter click) --
function playGateSound() {
  if (!audioCtx) return;
  var t = audioCtx.currentTime;

  // Low iron creak (filtered noise)
  var dur = 1.6;
  var sr  = audioCtx.sampleRate;
  var buf = audioCtx.createBuffer(1, sr * dur, sr);
  var d   = buf.getChannelData(0);
  for (var i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.pow(Math.max(0, 1 - i / d.length * 1.6), 1.2);
  }
  var noiseNode   = audioCtx.createBufferSource();
  noiseNode.buffer = buf;
  var noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 130;
  noiseFilter.Q.value = 0.6;
  var noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.2, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseNode.start(t);

  // Magical chime arpeggio (plays after creak begins)
  var chimeNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5→G6
  chimeNotes.forEach(function(freq, i) {
    var osc  = audioCtx.createOscillator();
    var shim = audioCtx.createOscillator();
    var shimG = audioCtx.createGain();
    var g    = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    // Gentle shimmer vibrato
    shim.frequency.value = 5;
    shimG.gain.value = 2.5;
    shim.connect(shimG);
    shimG.connect(osc.frequency);
    var noteT = t + 0.75 + i * 0.13;
    g.gain.setValueAtTime(0,    noteT);
    g.gain.linearRampToValueAtTime(0.08, noteT + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, noteT + 2.0);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(noteT);
    osc.stop(noteT + 2.2);
    shim.start(noteT);
    shim.stop(noteT + 2.2);
  });
}

// -- Ambient enchanted music box / fairytale soundtrack --
function startAmbient() {
  if (!audioCtx || ambientStarted) return;
  ambientStarted = true;

  // Root note: D4 (pentatonic D, E, F#, A, B)
  var pentatonic = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];

  function pluckNote(freq, time, decayTime, gainVal) {
    if (!audioCtx || !masterGain) return;
    var osc = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    
    // Triangle wave gives a soft, music-box/harp tone
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    // Sharp attack, exponential decay for a plucked string sound
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gainVal, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + decayTime);
    
    osc.connect(g);
    g.connect(masterGain);
    
    osc.start(time);
    osc.stop(time + decayTime + 0.1);
  }

  function playFairyArpeggio(startTime) {
    if (!soundEnabled || !audioCtx) return;
    
    // Play a random sequence of 4 notes chosen from the scale
    var numNotes = 4 + Math.floor(Math.random() * 3);
    for (var i = 0; i < numNotes; i++) {
      var noteRaw = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      var isHigh = Math.random() > 0.7; // Occasional sparkly high note
      var freq = isHigh ? noteRaw * 2 : noteRaw;
      var t = startTime + (i * 0.38) + (Math.random() * 0.1); // Slightly humanized timing
      var vol = isHigh ? 0.015 : 0.035;
      
      pluckNote(freq, t, isHigh ? 2.5 : 4.0, vol);
    }
    
    // Schedule the next flurry of notes anywhere from 4 to 10 seconds away
    var delay = (numNotes * 0.4) + 3 + (Math.random() * 5);
    setTimeout(function() {
      if (soundEnabled && audioCtx) playFairyArpeggio(audioCtx.currentTime + 0.1);
    }, delay * 1000);
  }

  // Soft background pad layer that fades in and heavily breathes
  var padBaseFreqs = [146.83, 220.00, 293.66]; // D3, A3, D4
  padBaseFreqs.forEach(function(f) {
    var osc = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f + (Math.random() * 0.4 - 0.2);
    g.gain.value = 0.005;
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
  });

  // Start the arpeggiator
  playFairyArpeggio(audioCtx.currentTime + 0.5);

  function breathe() {
    if (!soundEnabled || !masterGain) return;
    masterGain.gain.setTargetAtTime(0.5 + Math.random() * 0.5, audioCtx.currentTime, 8);
    setTimeout(breathe, 8000 + Math.random() * 6000);
  }
  breathe();
}

// -- Card hover micro-chime --
function playCardHover() {
  if (!soundEnabled || !audioCtx) return;
  var t   = audioCtx.currentTime;
  var osc = audioCtx.createOscillator();
  var g   = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880 + Math.random() * 540;
  g.gain.setValueAtTime(0,    t);
  g.gain.linearRampToValueAtTime(0.035, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}

// -- Sound toggle --
var soundToggleBtn = document.getElementById('soundToggle');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', function() {
    initAudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    soundEnabled = !soundEnabled;
    soundToggleBtn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
    soundToggleBtn.setAttribute('title', soundEnabled ? 'Sound: on — click to mute' : 'Sound: off — click to enable');
    soundToggleBtn.classList.toggle('sound--on', soundEnabled);

    if (soundEnabled) {
      masterGain.gain.setTargetAtTime(0.8, audioCtx.currentTime, 0.6);
      startAmbient();
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.6);
    }
  });
}

/* ================================================================
   GATE INTRO ANIMATION
   ================================================================ */
var gateOverlay  = document.getElementById('gateOverlay');
var gateEnterBtn = document.getElementById('gateEnterBtn');
var gateSkipBtn  = document.getElementById('gateSkipBtn');
var gateBloom    = document.getElementById('gateBloom');

function spawnGateBloom() {
  if (!gateBloom) return;
  var colors = [
    'hsl(345,62%,70%)', 'hsl(38,75%,70%)', 'hsl(280,45%,70%)',
    'hsl(48,85%,72%)',  'hsl(186,44%,65%)', 'hsl(345,57%,64%)'
  ];
  var shapes = ['●', '✿', '✦', '◆', '·', '❋'];
  var cx = window.innerWidth / 2;
  var cy = window.innerHeight / 2;

  for (var i = 0; i < 18; i++) {
    (function(idx) {
      setTimeout(function() {
        var el    = document.createElement('div');
        var angle = (idx / 18) * 360;
        var dist  = 90 + Math.random() * 130;
        var color = colors[Math.floor(Math.random() * colors.length)];
        var shape = shapes[Math.floor(Math.random() * shapes.length)];
        var size  = 10 + Math.random() * 18;
        el.textContent = shape;
        el.style.cssText = [
          'position:absolute',
          'left:' + cx + 'px',
          'top:'  + cy + 'px',
          'color:' + color,
          'font-size:' + size + 'px',
          'pointer-events:none',
          'transform:translate(-50%,-50%)',
          'transition:all 1.4s cubic-bezier(0.18,0,0.76,1)',
          'opacity:1',
          'z-index:5'
        ].join(';');
        gateBloom.appendChild(el);

        // Animate outward on next frame
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            var radX = Math.cos(angle * Math.PI / 180) * dist;
            var radY = Math.sin(angle * Math.PI / 180) * dist;
            el.style.left    = (cx + radX) + 'px';
            el.style.top     = (cy + radY) + 'px';
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%,-50%) scale(0.2)';
          });
        });

        setTimeout(function() { el.remove(); }, 1600);
      }, idx * 35);
    })(i);
  }
}

function dismissGate() {
  if (!gateOverlay) return;

  // User gesture allows audio — init and play gate sound
  initAudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  playGateSound();

  // Bloom particles
  spawnGateBloom();

  // Trigger sun-bloom radial glow
  var sunBloom = document.getElementById('gateSunBloom');
  if (sunBloom) setTimeout(function() { sunBloom.classList.add('blazing'); }, 900);

  // Trigger CSS swing animation
  gateOverlay.classList.add('gate-overlay--opening');

  // Hide enter / skip buttons immediately
  if (gateEnterBtn) gateEnterBtn.style.display = 'none';
  if (gateSkipBtn)  gateSkipBtn.style.display  = 'none';

  // Fade overlay after gates have swung open
  setTimeout(function() {
    gateOverlay.classList.add('gate-overlay--done');
    setTimeout(function() {
      gateOverlay.style.display = 'none';
      document.body.style.overflow = '';
      // If user enabled sound before gate, start ambient now
      if (soundEnabled) startAmbient();
    }, 520);
  }, 2400);

  sessionStorage.setItem('gateOpened', '1');
}

// Check if gate was already shown this session
if (sessionStorage.getItem('gateOpened')) {
  // Skip gate entirely
  if (gateOverlay) {
    gateOverlay.style.display = 'none';
  }
} else {
  // Show gate — lock scroll until dismissed
  document.body.style.overflow = 'hidden';
  if (gateEnterBtn) gateEnterBtn.addEventListener('click', dismissGate);
  if (gateSkipBtn)  gateSkipBtn.addEventListener('click', dismissGate);
}

// ── Console Easter Egg ──────────────────────────────────────
console.log('%c✦ Hey curious dev! Built with love, spells, and far too much botanical SVG.', 'color:#d4815a;font-size:1rem;font-style:italic;');

// ── Magic Mirror Logic ──────────────────────────────────────
(function initMagicMirror() {
  var mirrorBtn     = document.getElementById('mirrorSubmitBtn');
  var mirrorInput   = document.getElementById('mirrorNameInput');
  var mirrorMsgArea = document.getElementById('mirrorMsgArea');
  var mirrorGlass   = document.querySelector('.mirror-glass');

  if (mirrorBtn && mirrorInput && mirrorMsgArea) {
    var rawMessages = [
      "Ah, {name}. I see a mind that notices the little things. Keep looking closely—the best magic, like the best design, always hides in the details.",
      "{name}, the garden usually whispers, but for you, it sings. May your journey be as thoughtful and intentional as the path that brought you here.",
      "Welcome, {name}. The reflection I see is someone who cares deeply about how things feel. After all, making people feel understood is the greatest spell of all.",
      "It is a rare thing, {name}, to see someone who shapes the world rather than just passing through it. Keep creating spaces where others feel they belong."
    ];

    mirrorBtn.addEventListener('click', function() {
      var name = mirrorInput.value.trim();
      if (!name) return;

      // Thinking state
      mirrorBtn.disabled = true;
      mirrorInput.disabled = true;
      mirrorGlass.classList.add('mirror-glass--thinking');
      mirrorMsgArea.innerHTML = '<div class="mirror-idle-icon">✨</div>';

      // Play soft chime if sound enabled
      if (typeof window.soundEnabled !== 'undefined' && window.soundEnabled && typeof audioCtx !== 'undefined' && audioCtx) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        var chime = audioCtx.createOscillator();
        var chimeG = audioCtx.createGain();
        chime.type = 'triangle';
        chime.frequency.value = 1567.98; // G6
        chimeG.gain.setValueAtTime(0, audioCtx.currentTime);
        chimeG.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05);
        chimeG.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3);
        chime.connect(chimeG);
        chimeG.connect(masterGain);
        chime.start(audioCtx.currentTime);
        chime.stop(audioCtx.currentTime + 3.1);
      }

      setTimeout(function() {
        var msgTemplate = rawMessages[Math.floor(Math.random() * rawMessages.length)];
        var finalMsg = msgTemplate.replace(/{name}/g, name);

        mirrorGlass.classList.remove('mirror-glass--thinking');
        mirrorMsgArea.innerHTML = '<p class="mirror-msg-text">"' + finalMsg + '"</p>';

        setTimeout(function() {
          mirrorBtn.disabled = false;
          mirrorInput.disabled = false;
          mirrorInput.value = '';
        }, 12000);
      }, 1600);
    });

    mirrorInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') mirrorBtn.click();
    });
  }
})();


/* ===============================================================
   ✦ ELEVATION LAYER ✦
   Contact form · Butterfly delivery · Easter eggs · Polish
   =============================================================== */
(function() {
  'use strict';

  function getBackendUrl() {
    // External preview URL routes /api → backend at same origin
    if (typeof window !== 'undefined' && window.__BACKEND_URL__) return window.__BACKEND_URL__;
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return window.location.origin;
    }
    return '';
  }

  // ── Contact form ──
  var form     = document.getElementById('contactForm');
  var nameI    = document.getElementById('cfName');
  var emailI   = document.getElementById('cfEmail');
  var msgI     = document.getElementById('cfMessage');
  var hpI      = document.getElementById('cfCompany');
  var submit   = document.getElementById('cfSubmit');
  var hint     = document.getElementById('cfHint');
  var delivery = document.getElementById('butterflyDelivery');
  var confirmCard  = document.getElementById('bfConfirm');
  var confirmClose = document.getElementById('bfConfirmClose');

  function setFieldError(field, msg) {
    if (!field) return;
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('field--error', !!msg);
    var msgEl = wrap.querySelector('.field-error-msg');
    if (!msgEl && msg) {
      msgEl = document.createElement('span');
      msgEl.className = 'field-error-msg';
      wrap.appendChild(msgEl);
    }
    if (msgEl) msgEl.textContent = msg || '';
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function runDeliveryAnimation() {
    if (!delivery) return;
    delivery.setAttribute('aria-hidden', 'false');
    delivery.classList.add('active');
    setTimeout(function() {
      if (confirmCard) confirmCard.classList.add('show');
    }, 4400);
  }

  function closeDelivery() {
    if (!delivery) return;
    if (confirmCard) confirmCard.classList.remove('show');
    delivery.classList.remove('active');
    delivery.setAttribute('aria-hidden', 'true');
  }

  if (confirmClose) confirmClose.addEventListener('click', closeDelivery);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDelivery();
  });

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (submit.disabled) return;

      setFieldError(nameI, '');
      setFieldError(emailI, '');
      setFieldError(msgI, '');

      var name = (nameI.value || '').trim();
      var email = (emailI.value || '').trim();
      var message = (msgI.value || '').trim();
      var hp = (hpI && hpI.value ? hpI.value : '').trim();

      var valid = true;
      if (!name) { setFieldError(nameI, 'A name, however informal, helps.'); valid = false; }
      if (!email || !validateEmail(email)) { setFieldError(emailI, 'I need a way to write back.'); valid = false; }
      if (!message) { setFieldError(msgI, 'Even a sentence is enough.'); valid = false; }
      if (!valid) return;

      submit.disabled = true;
      var labelEl = submit.querySelector('.cfs-text');
      var originalText = labelEl ? labelEl.textContent : 'Send';
      if (labelEl) labelEl.textContent = 'Sending…';

      try {
        var backend = getBackendUrl();
        var res = await fetch(backend + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, message: message, company: hp })
        });
        if (!res.ok) {
          var detail = '';
          try { detail = (await res.json()).detail || ''; } catch (e) {}
          throw new Error(detail || ('HTTP ' + res.status));
        }
        runDeliveryAnimation();
        setTimeout(function() {
          form.reset();
          submit.disabled = false;
          if (labelEl) labelEl.textContent = originalText;
        }, 600);
      } catch (err) {
        submit.disabled = false;
        if (labelEl) labelEl.textContent = originalText;
        if (hint) hint.textContent = 'The butterflies got lost. Try again in a moment.';
      }
    });

    [nameI, emailI, msgI].forEach(function(el) {
      if (!el) return;
      el.addEventListener('input', function() { setFieldError(el, ''); });
    });
  }

  // ── Easter egg 1: Konami code → handwritten note ──
  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  var secretNote = document.getElementById('secretNote');
  var snClose = document.getElementById('snClose');

  document.addEventListener('keydown', function(e) {
    var key = e.key;
    if (key && key.length === 1) key = key.toLowerCase();
    if (key === konami[pos]) {
      pos++;
      if (pos === konami.length) {
        pos = 0;
        if (secretNote) {
          secretNote.classList.add('active');
          secretNote.setAttribute('aria-hidden', 'false');
        }
      }
    } else {
      pos = (key === konami[0]) ? 1 : 0;
    }
  });

  function closeSecret() {
    if (!secretNote) return;
    secretNote.classList.remove('active');
    secretNote.setAttribute('aria-hidden', 'true');
  }
  if (snClose) snClose.addEventListener('click', closeSecret);
  if (secretNote) {
    secretNote.addEventListener('click', function(e) {
      if (e.target === secretNote) closeSecret();
    });
  }

  // ── Easter egg 2: long-press VR monogram → gold bloom ──
  var navLogo = document.getElementById('navLogo');
  if (navLogo) {
    var pressTimer = null;
    function startPress() {
      pressTimer = setTimeout(function() {
        navLogo.classList.remove('vr-bloom');
        void navLogo.offsetWidth;
        navLogo.classList.add('vr-bloom');
        setTimeout(function() { navLogo.classList.remove('vr-bloom'); }, 1500);
      }, 700);
    }
    function endPress() { if (pressTimer) clearTimeout(pressTimer); }
    navLogo.addEventListener('mousedown', startPress);
    navLogo.addEventListener('touchstart', startPress, { passive: true });
    navLogo.addEventListener('mouseup', endPress);
    navLogo.addEventListener('mouseleave', endPress);
    navLogo.addEventListener('touchend', endPress);
  }

  // ── Polish: IntersectionObserver-driven .in-view toggle ──
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('in-view'); });
  }

})();

/* ===============================================================
   ✦ CHAPTER II — CRAFTSMANSHIP LAYER (JS) ✦
   Parallax · Ambient light · Butterfly drift · Card physics
   =============================================================== */
(function() {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // ── Cached elements ──────────────────────────────────────
  var heroPhoto     = document.getElementById('heroPhoto');
  var heroBotL      = document.querySelector('.hero-botanical-left');
  var heroBotR      = document.querySelector('.hero-botanical-right');
  var heroContent   = document.getElementById('heroContent');
  var scrollHint    = document.getElementById('scrollHint');
  var aboutPhoto    = document.getElementById('aboutPhoto');
  var mirrorGlass   = document.querySelector('.mirror-glass');
  var body          = document.body;
  var isMobile      = window.matchMedia('(max-width: 768px)').matches;

  // ── Ambient sunlight shift as visitor scrolls the story ──
  var lastScroll = -1;
  var maxScroll = 1;
  function onScroll() {
    var y = window.scrollY;
    if (y === lastScroll) return;
    lastScroll = y;
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var pct = Math.min(Math.max(y / Math.max(maxScroll, 1), 0), 1);

    // Warm sunlight travels from top (morning) to lower-left (afternoon)
    var sunY = 8 + (pct * 44);           // 8% → 52%
    var warmth = 0.10 + (pct * 0.06);    // 0.10 → 0.16
    body.style.setProperty('--sun-y', sunY + '%');
    body.style.setProperty('--sun-warmth', warmth.toFixed(3));

    // Hero parallax (only in hero viewport)
    if (y < window.innerHeight * 1.2) {
      var heroPct = y / window.innerHeight;
      if (heroPhoto && !isMobile) {
        heroPhoto.style.transform = 'translate3d(0,' + (heroPct * 60) + 'px,0) scale(' + (1 + heroPct * 0.06) + ')';
      }
      if (heroContent) {
        heroContent.style.transform = 'translate3d(0,' + (heroPct * 40) + 'px,0)';
        heroContent.style.opacity = String(Math.max(1 - heroPct * 1.35, 0));
      }
      if (heroBotL && !isMobile) heroBotL.style.transform = 'translate3d(' + (heroPct * -30) + 'px, ' + (heroPct * 20) + 'px, 0)';
      if (heroBotR && !isMobile) heroBotR.style.transform = 'translate3d(' + (heroPct * 30)  + 'px, ' + (heroPct * 20) + 'px, 0)';
      if (scrollHint) {
        var hintOpacity = Math.max(1 - heroPct * 3, 0);
        scrollHint.style.opacity = String(hintOpacity);
      }
    }

    // Gentle drift on about photo
    if (aboutPhoto) {
      var ap = aboutPhoto.getBoundingClientRect();
      var mid = window.innerHeight / 2;
      var d = (ap.top + ap.height / 2 - mid) / mid;   // -1 above, 1 below
      var t = Math.max(Math.min(d, 1), -1) * -12;
      if (!isMobile) aboutPhoto.style.transform = 'translate3d(0,' + t + 'px,0)';
    }
  }

  // rAF-throttled scroll for buttery smoothness
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function() {
    isMobile = window.matchMedia('(max-width: 768px)').matches;
    onScroll();
  }, { passive: true });
  onScroll();

  // ── Project card: subtle 3D tilt following pointer (desktop only) ──
  if (window.matchMedia('(pointer:fine)').matches) {
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function(card) {
      var rect = null;
      var raf = null;

      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        var px = mx / rect.width;
        var py = my / rect.height;
        card.style.setProperty('--px', (px * 100) + '%');
        card.style.setProperty('--py', (py * 100) + '%');
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function() {
          var tiltX = (0.5 - py) * 4;    // -2deg to +2deg
          var tiltY = (px - 0.5) * 4;
          card.style.transform = 'perspective(1200px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
        });
      }

      function onEnter() {
        rect = card.getBoundingClientRect();
      }
      function onLeave() {
        rect = null;
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      }

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ── Butterfly drift — physics-believable easing ──
  if (window.matchMedia('(pointer:fine)').matches) {
    var bfs = document.querySelectorAll('.floating-butterfly');
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function(e) {
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
    (function tick() {
      cx += (tx - cx) * 0.03;
      cy += (ty - cy) * 0.03;
      bfs.forEach(function(bf, i) {
        var depth = (i + 1) * 8;
        bf.style.setProperty('--drift-x', (cx * depth) + 'px');
        bf.style.setProperty('--drift-y', (cy * depth) + 'px');
      });
      requestAnimationFrame(tick);
    })();
  }

  // ── Mirror shimmer: gentle pointer-follow highlight ──
  if (mirrorGlass && window.matchMedia('(pointer:fine)').matches) {
    var mirrorRect = null;
    mirrorGlass.addEventListener('mouseenter', function() {
      mirrorRect = mirrorGlass.getBoundingClientRect();
    });
    mirrorGlass.addEventListener('mousemove', function(e) {
      if (!mirrorRect) mirrorRect = mirrorGlass.getBoundingClientRect();
      var mx = ((e.clientX - mirrorRect.left) / mirrorRect.width) * 100;
      var my = ((e.clientY - mirrorRect.top) / mirrorRect.height) * 100;
      mirrorGlass.style.setProperty('--mx', mx + '%');
      mirrorGlass.style.setProperty('--my', my + '%');
    });
  }

})();

