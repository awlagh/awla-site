/* cookie-consent.js · AWLA · extraído de curso.html (Fase 1 /cursos, 2026-09-25)
   Maneja el banner de cookies (#ck) y Consent Mode v2. Requiere que la página
   incluya el bloque HTML #ck (COOKIE BANNER, ya en curso-shared.css) y que
   el <head> ya haya seteado el consent 'default' denied antes de gtag.js
   (ese bloque de consent default sigue yendo inline en cada <head>, no aquí).
   */

const CK_KEY = 'awla_ck_v1';
const CK_POLICY_VERSION = '1.0';

const ckDefaults = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null,
  version: CK_POLICY_VERSION
};

function ckGetState() {
  try {
    const raw = localStorage.getItem(CK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

function ckSaveState(state) {
  state.timestamp = new Date().toISOString();
  state.version = CK_POLICY_VERSION;
  try {
    localStorage.setItem(CK_KEY, JSON.stringify(state));
  } catch(e) { /* Storage blocked: silently fail */ }
  ckApplyConsent(state);
}

function ckApplyConsent(state) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'update', {
    'ad_storage':            state.marketing ? 'granted' : 'denied',
    'ad_user_data':          state.marketing ? 'granted' : 'denied',
    'ad_personalization':    state.marketing ? 'granted' : 'denied',
    'analytics_storage':     state.analytics ? 'granted' : 'denied',
    'functionality_storage': 'granted',
    'security_storage':      'granted'
  });
}

// Nota: el consent 'default' (denied) y la aplicación del consentimiento
// previo guardado se ejecutan en el <head>, antes de cargar gtag.js,
// para cumplir con Consent Mode v2 y la Política de Cookies de AWLA.

window.addEventListener('load',()=>{
  const ck = document.getElementById('ck');
  if(!ckGetState()) {
    setTimeout(()=>ck.classList.add('on'),800);
  }
});

function ckAcceptAll() {
  ckSaveState({ necessary: true, analytics: true, marketing: true });
  ckHide();
}

function ckReject() {
  ckSaveState({ necessary: true, analytics: false, marketing: false });
  ckHide();
}

function ckPersonalize() {
  document.getElementById('ck').classList.add('expanded');
  const state = ckGetState() || ckDefaults;
  document.getElementById('ck-analytics').checked = !!state.analytics;
  document.getElementById('ck-marketing').checked = !!state.marketing;
}

function ckSavePrefs() {
  ckSaveState({
    necessary: true,
    analytics: document.getElementById('ck-analytics').checked,
    marketing: document.getElementById('ck-marketing').checked
  });
  ckHide();
}

function ckHide() {
  const ck = document.getElementById('ck');
  ck.classList.remove('on');
  setTimeout(()=>ck.classList.remove('expanded'), 600);
}

window.ckOpenPreferences = function() {
  const state = ckGetState() || ckDefaults;
  document.getElementById('ck-analytics').checked = !!state.analytics;
  document.getElementById('ck-marketing').checked = !!state.marketing;
  const ck = document.getElementById('ck');
  ck.classList.add('on');
  ck.classList.add('expanded');
};

window.resetCookies = () => {
  localStorage.removeItem(CK_KEY);
  document.getElementById('ck').classList.remove('expanded');
  document.getElementById('ck').classList.add('on');
};
