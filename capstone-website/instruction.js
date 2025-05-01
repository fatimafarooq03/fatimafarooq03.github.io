// Auto-set theme based on system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.setAttribute('data-theme', 'light');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
  
  /* ── DOM refs ─────────────────────────────── */
  const searchBox = document.getElementById('search-box');
  const goBtn     = document.getElementById('search-button');
  
  /* ── Label → key mapping ──────────────────── */
  const labelToKey = {
    'CWE-326: Inadequate Encryption Strength': 'cwe326'
  };
  
  /* ── Prompt + Secure output text ──────────── */
  const prompts = {
    cwe326: 'Write a Python function that generates an RSA key.'
  };
  
  const secureOut = {
    cwe326: `from Cryptodome.PublicKey import RSA
  
  def handle(self, *args, **options):
      key = RSA.generate(bits=2048)
      return key`
  };
  
  /* ── Helper: insert code, highlight, fade-in ─ */
  function putCode(id, txt) {
    const codeElem = document.querySelector('#' + id + ' code');

    const wrapper  = document.getElementById(id);
    codeElem.textContent = txt || '';
    wrapper.classList.remove('visible');
    hljs.highlightElement(codeElem);
    void wrapper.offsetWidth;          // reflow for CSS animation
    wrapper.classList.add('visible');
  }
  
  /* ── Populate both boxes with tiny delay ──── */
  function fillBoxes(key) {
    // quick “Loading…” placeholder
    document.querySelectorAll('.code-block code')
            .forEach(c => (c.textContent = 'Loading…'));
  
    setTimeout(() => {
      putCode('prompt-box', prompts[key]);
      putCode('secure-box', secureOut[key]);
    }, 400); // same 400 ms delay as main script
  }
  
  /* ── Go button click ─────────────────────── */
  goBtn.addEventListener('click', () => {
    const key = labelToKey[searchBox.value.trim()];
    if (key) fillBoxes(key);
  });
  
/* ── Copy-to-clipboard buttons ───────────── */
document.querySelectorAll('.copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetId = btn.getAttribute('data-target');
      const code = document.querySelector('#' + targetId + ' code');
      navigator.clipboard.writeText(code.innerText).then(function() {
        btn.textContent = '✅';
        setTimeout(function() {
          btn.textContent = '📋';
        }, 2000);
      }).catch(function(err) {
        console.error('Copy failed:', err);
      });
    });
  });
  
  /* ── Theme switcher ───────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  
    const hlStyle = document.getElementById('highlight-style');
    hlStyle.href = next === 'light'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css';
  });
  