(function(){
  const els = document.querySelectorAll('.count[data-target]');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=+el.dataset.target, t0=performance.now();
      (function tick(now){
        const p=Math.min((now-t0)/1400,1);
        el.textContent=Math.floor((1-Math.pow(1-p,3))*target).toLocaleString();
        if(p<1) requestAnimationFrame(tick);
        else el.textContent=target.toLocaleString();
      })(t0);
      obs.unobserve(el);
    });
  },{threshold:.5});
  els.forEach(el=>obs.observe(el));
})();

(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;

      const siblings = Array.from(e.target.parentNode.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = `${idx * 80}ms`;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  },{threshold:.1});
  els.forEach(el=>obs.observe(el));
})();


(function(){
  document.querySelectorAll('.item-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top-r.height/2)/(r.height/2))*5;
      const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*-5;
      card.style.transform=`perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
  });
})();


(function(){
  const nav=document.querySelector('.nav');
  if(!nav) return;
  let last=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y<80){nav.style.transform='translateY(0)';last=y;return;}
    nav.style.transform=y>last?'translateY(-100%)':'translateY(0)';
    nav.style.transition='transform .3s ease';
    last=y;
  },{passive:true});
})();


(function(){
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobileMenu');
  if(!burger||!menu) return;
  burger.addEventListener('click',()=>menu.classList.toggle('open'));
  menu.querySelectorAll('.mm-link').forEach(l=>{
    l.addEventListener('click',()=>menu.classList.remove('open'));
  });
})();

(function(){
  document.querySelectorAll('.sticky').forEach(s=>{
    const r=(Math.random()-0.5)*4;
    s.style.setProperty('--sr', r+'deg');
  });
})();



(function () {
  /* ── Share Section ── */
  const SHARE_URL  = 'https://safehouse.hackclub.com';
  const SHARE_MSG  = `🏚️ Safehouse — a secret underground base for teen hackers!\n\nBuild wild projects, ship them to the wall & earn BBQ Coins for real rewards.\n\n👉 ${SHARE_URL}`;
  const SHARE_TITLE = 'Safehouse — Build in secret. Ship in style.';

  // Populate message preview
  const preview = document.getElementById('share-msg-preview');
  if (preview) preview.textContent = SHARE_MSG;

  // WhatsApp
  const waBtn = document.getElementById('share-wa');
  if (waBtn) waBtn.href = `https://wa.me/?text=${encodeURIComponent(SHARE_MSG)}`;

  // Twitter / X
  const xBtn = document.getElementById('share-x');
  if (xBtn) xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MSG)}`;

  // Telegram
  const tgBtn = document.getElementById('share-tg');
  if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_MSG)}`;

  // Copy link
  const copyBtn   = document.getElementById('share-copy');
  const copyLabel = document.getElementById('share-copy-label');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(SHARE_URL);
        copyLabel.textContent = '✓ Copied!';
        copyBtn.style.background = 'var(--sticky-g)';
        setTimeout(() => {
          copyLabel.textContent = 'Copy Link';
          copyBtn.style.background = '';
        }, 2000);
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = SHARE_URL;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyLabel.textContent = '✓ Copied!';
        setTimeout(() => { copyLabel.textContent = 'Copy Link'; }, 2000);
      }
    });
  }

  // Download poster using html2canvas CDN
  const dlBtn = document.getElementById('share-download');
  if (dlBtn) {
    dlBtn.addEventListener('click', async () => {
      const posterEl = document.getElementById('share-poster-img');
      if (!posterEl) return;

      dlBtn.textContent = 'Generating…';
      dlBtn.disabled = true;

      // Load html2canvas if not loaded
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }

      try {
        const canvas = await window.html2canvas(posterEl, { scale: 2, useCORS: true, allowTaint: true });
        const link = document.createElement('a');
        link.download = 'safehouse-poster.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        alert('Could not generate poster image. Try right-clicking the poster and saving it.');
      } finally {
        dlBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Poster`;
        dlBtn.disabled = false;
      }
    });
  }

  // Also add share link to nav
  const navLinks = document.querySelector('.nav__links');
  if (navLinks && !document.querySelector('.nav__links a[href="#share"]')) {
    const a = document.createElement('a');
    a.href = '#share'; a.textContent = 'Share';
    navLinks.insertBefore(a, navLinks.querySelector('.nav__cta'));
  }
})();


(function () {
  const FORM_ID       = '1FAIpQLScuJm3d8HmvWzMItEsyOPyme3yEQozW5PUT3eWIAtPrV9HSGQ';
  const ENTRY_NAME    = 'entry.667480707';
  const ENTRY_EMAIL   = 'entry.1301671861';
  const ENTRY_EXCITED = 'entry.152723246';
  const ENTRY_HEAR    = 'entry.2138667298';
  const SUBMIT_URL    = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

  const sCTA      = document.getElementById('rsvp-cta');
  const sForm     = document.getElementById('rsvp-form-wrap');
  const sSuccess  = document.getElementById('rsvp-success');
  const openBtn   = document.getElementById('rsvp-open');
  const backBtn   = document.getElementById('rsvp-back');
  const form      = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('rsvp-submit');
  const btnLabel  = document.getElementById('rsvp-btn-label');
  const btnSpin   = document.getElementById('rsvp-btn-spin');
  const globalErr = document.getElementById('rsvp-err-global');
  const successName = document.getElementById('rsvp-success-name');
  const emojiRow  = document.getElementById('emoji-row');
  const excitedHid = document.getElementById('rf-excited');

  emojiRow.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      emojiRow.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('picked'));
      btn.classList.add('picked');
      excitedHid.value = btn.dataset.val;
      clearErr('excited');
    });
  });

  function show(el) {
    [sCTA, sForm, sSuccess].forEach(s => s.classList.remove('rsvp-s--on'));
    el.classList.add('rsvp-s--on');
    el.closest('section')?.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  openBtn.addEventListener('click', () => show(sForm));
  backBtn.addEventListener('click', () => show(sCTA));

  function setErr(id, msg) {
    const e = document.getElementById('e-' + id);
    if (e) e.textContent = msg;
    const inp = document.getElementById('rf-' + id);
    if (inp) inp.classList.add('rsvp-input--err');
  }
  function clearErr(id) {
    const e = document.getElementById('e-' + id);
    if (e) e.textContent = '';
    const inp = document.getElementById('rf-' + id);
    if (inp) inp.classList.remove('rsvp-input--err');
  }
  function validate() {
    let ok = true;
    const name  = document.getElementById('rf-name').value.trim();
    const email = document.getElementById('rf-email').value.trim();
    if (!name)  { setErr('name',  'Please enter your name.'); ok = false; } else clearErr('name');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('email', 'Please enter a valid email.'); ok = false;
    } else clearErr('email');
    if (!excitedHid.value) { setErr('excited', 'Pick how excited you are!'); ok = false; } else clearErr('excited');
    return ok;
  }

  document.getElementById('rf-name') .addEventListener('input', () => clearErr('name'));
  document.getElementById('rf-email').addEventListener('input', () => clearErr('email'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    globalErr.style.display = 'none';
    if (!validate()) return;
    btnLabel.style.display = 'none';
    btnSpin.style.display  = 'inline';
    submitBtn.disabled = true;
    const name  = document.getElementById('rf-name').value.trim();
    const email = document.getElementById('rf-email').value.trim();
    const hear  = document.getElementById('rf-hear').value.trim();
    const body  = new URLSearchParams();
    body.append(ENTRY_NAME,    name);
    body.append(ENTRY_EMAIL,   email);
    body.append(ENTRY_EXCITED, excitedHid.value);
    if (hear) body.append(ENTRY_HEAR, hear);
    try {
      await fetch(SUBMIT_URL, {
        method:'POST', mode:'no-cors',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: body.toString(),
      });
      successName.textContent = `See you there, ${name}! 👋`;
      show(sSuccess);
    } catch {
      globalErr.textContent = 'Something went wrong — check your connection and try again.';
      globalErr.style.display = 'block';
    } finally {
      btnLabel.style.display = 'inline';
      btnSpin.style.display  = 'none';
      submitBtn.disabled = false;
    }
  });
})();