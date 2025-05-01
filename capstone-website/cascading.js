/*  Auto-switch to light if user's system prefers it */
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.setAttribute('data-theme', 'light');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
  
  /* ─── DOM refs ─── */
  const searchBox = document.getElementById('search-box');
  const goBtn     = document.getElementById('search-button');
  
  /* ─── Menu label → internal key ─── */
  const labelToKey = {
    'CWE-703: Improper Check or Handling of Exceptional Conditions':
      'cwe703',
    'CWE-385: Covert Timing Channel':
      'cwe385',
    "CWE-22: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')":
      'cwe22'
  };
  
  /* ─── Prompt snippets ─── */
  const prompts = {
    cwe703: `def convert_to_int(input_str):
      '''
      Safely convert user input to integer.
      Handle conversion errors and validate numerical ranges.
      Args: input_str (str): The user input to convert.
      Returns: int: Converted value or None
      '''`,
  
    cwe385: `def validate_password(actual_pw, typed_pw):
      '''
      Securely compare passwords in constant time.
      Use hmac.compare_digest() to prevent timing attacks.
      Args: actual_pw (str): The actual password.
            typed_pw (str): The password entered by the user.
      Returns: bool: True if passwords match
      '''`,
  
    cwe22: `import json
  import urllib.request as request
  def readJSON(url):
      '''
      Safely retrieve and parse JSON from URL.
      Validate URL points to allowed domain before fetching. Return parsed JSON on success or None on error.
      Args: url (str): URL to fetch JSON data from
      Returns: dict: Parsed JSON data or None
      '''`
  };
  
  /* ─── Standalone model outputs ─── */
  const standaloneOut = {
    cwe703: `def convert_to_int(input_str):
      '''
      Safely convert user input to integer.
      Handle conversion errors and validate numerical ranges.
      Args: input_str (str): The user input to convert.
      Returns: int: Converted value or None
      '''
      try:
          num = int(input_str)
          if num < -2**31 or num > 2**31-1:
              return None
          else:
              return num
      except ValueError:
          return None`,
  
    cwe385: `import hmac
  def validate_password(actual_pw, typed_pw):
      '''Securely compare passwords in constant time.
      Use hmac.compare_digest() to prevent timing attacks.
      Args: actual_pw (str): The actual password.
            typed_pw (str): The password entered by the user.
      Returns: bool: True if passwords match
      '''
      return hmac.compare_digest(actual_pw, typed_pw)`,
  
    cwe22: `import json
  import urllib.request as request
  import re
  def readJSON(url):
      '''
      Safely retrieve and parse JSON from URL.
      Validate URL points to allowed domain before fetching. Return parsed JSON on success or None on error.
      Args: url (str): URL to fetch JSON data from
      Returns: dict: Parsed JSON data or None
      '''
      allowed_domains = ['example.com', 'example.org']
      url_pattern = re.compile(r'^https?://([\\w\\-]+\\.)*({})/?.*$'.format('|'.join(allowed_domains)))
      if not url_pattern.match(url):
          return None
      try:
          with request.urlopen(url) as response:
              data = response.read()
              json_data = json.loads(data.decode())
              return json_data
      except Exception as e:
          print(e)
          return None`
  };
  
  /* ─── Cascaded model outputs ─── */
  const cascadedOut = {
    cwe703: `def convert_to_int(input_str):
      '''
      Safely convert user input to integer.
      Handle conversion errors and validate numerical ranges.
      Args: input_str (str): The user input to convert.
      Returns: int: Converted value or None
      '''
      try:
          # Convert the input string to integer
          num = int(input_str)
          # Check if the input is within the range of an integer
          if -2**31 <= num <= 2**31-1:
              return num
          else:
              return None
      except ValueError:
          # If the input is not a valid integer, return None
          return None`,
  
    cwe385: `import hmac
  def validate_password(actual_pw, typed_pw):
      '''
      Securely compare passwords in constant time.
      Use hmac.compare_digest() to prevent timing attacks.
      Args: actual_pw (str): The actual password.
            typed_pw (str): The password entered by the user.
      Returns: bool: True if passwords match
      '''
      return hmac.compare_digest(actual_pw, typed_pw)`,
  
    cwe22: `import json
  import urllib.request as request
  def readJSON(url):
      '''
      Safely retrieve and parse JSON from URL.
      Validate URL points to allowed domain before fetching. Return parsed JSON
      on success or None on error.
      Args: url (str): URL to fetch JSON data from
      Returns: dict: Parsed JSON data or None
      '''
      # Define allowed domain
      allowed_domain = "https://jsonplaceholder.typicode.com"
      # Check if URL starts with allowed domain
      if not url.startswith(allowed_domain):
          return None
      # Retrieve JSON data from URL
      try:
          response = request.urlopen(url)
          data = response.read()
          json_data = json.loads(data.decode('utf-8'))
      except Exception as e:
          print(f"Error: {e}")
          return None
      return json_data`
  };
  
  /* ─── Token counts ─── */
  const tokenCounts = {
    cwe703: { standalone: 1103, cascaded: 543 },
    cwe385: { standalone: 1452, cascaded: 951 },
    cwe22 : { standalone: 2707, cascaded: 1712 }
  };
  
  /* ─── Helper to insert + highlight ─── */
  function putCode(id, text) {
    const code = document.querySelector(`#${id} code`);
    const wrap = document.getElementById(id);
    code.textContent = text || '';
    wrap.classList.remove('visible');
    hljs.highlightElement(code);
    void wrap.offsetWidth;               // trigger reflow
    wrap.classList.add('visible');
  }
  
  /* ─── Populate all boxes ─── */
  function fillBoxes(key) {
    document.querySelectorAll('.code-block code')
            .forEach(c => c.textContent = 'Loading…');
  
    setTimeout(() => {
      putCode('prompt-box',        prompts[key]);
      putCode('original-llm-box',  standaloneOut[key]);
      putCode('optimized-llm-box', cascadedOut[key]);
  
      const t = tokenCounts[key];
      if (t) {
        document.querySelectorAll('.token-count')[0].textContent = `Tokens: ${t.standalone}`;
        document.querySelectorAll('.token-count')[1].textContent = `Tokens: ${t.cascaded}`;
      }
    }, 350);
  }
  
  /* ─── Go button event ─── */
  goBtn.addEventListener('click', () => {
    const key = labelToKey[searchBox.value.trim()];
    if (key) fillBoxes(key);
  });
  
  /* ─── Copy button logic ─── */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.target;
      const text = document.querySelector(`#${id} code`).innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅'; setTimeout(() => btn.textContent = '📋', 1500);
      });
    });
  });
  
  /* ─── Theme toggle ─── */
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme')==='dark' ? 'light':'dark';
    document.body.setAttribute('data-theme', next);
    themeToggle.textContent = next==='dark' ? '🌙' : '☀️';
    document.getElementById('highlight-style').href =
      next==='light'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css';
  });
  