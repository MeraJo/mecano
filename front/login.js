/* Login page logic only: language, lightweight auth simulation, and redirect flow. */

const I18N = {
  en: {
    'brand.tagline': 'Car Diagnostics',
    'login.headline': 'Diagnose your car problems instantly',
    'login.desc': 'Enter your car details and get a complete list of common problems with step-by-step YouTube repair videos.',
    'login.feat1': '5 engine types supported',
    'login.feat2': 'YouTube tutorial videos',
    'login.feat3': 'Arabic, English & French',
    'login.feat4': 'Customizable color themes',
    'login.title': 'Sign in to MECANO',
    'login.subtitle': 'Choose how you want to continue',
    'login.google': 'Sign in with Google',
    'login.or': 'or',
    'login.guest': 'Continue as Guest',
    'login.note': 'Google sign-in only shares your name and email. We never see your password.'
  },
  ar: {
    'brand.tagline': 'تشخيص السيارات',
    'login.headline': 'شخّص مشاكل سيارتك فوراً',
    'login.desc': 'أدخل معلومات سيارتك واحصل على قائمة بالمشاكل الشائعة مع فيديوهات إصلاح توضيحية.',
    'login.feat1': 'يدعم 5 أنواع محركات',
    'login.feat2': 'فيديوهات تعليمية يوتيوب',
    'login.feat3': 'عربي، إنجليزي وفرنسي',
    'login.feat4': 'ألوان قابلة للتخصيص',
    'login.title': 'تسجيل الدخول إلى MECANO',
    'login.subtitle': 'اختر طريقة المتابعة',
    'login.google': 'الدخول عبر Google',
    'login.or': 'أو',
    'login.guest': 'الدخول كزائر',
    'login.note': 'تسجيل الدخول عبر Google يشارك الاسم والبريد فقط. لا نرى كلمة المرور.'
  },
  fr: {
    'brand.tagline': 'Diagnostic Auto',
    'login.headline': 'Diagnostiquez vos pannes instantanement',
    'login.desc': 'Entrez les details de votre voiture et obtenez une liste des pannes courantes avec des videos de reparation.',
    'login.feat1': '5 types de moteur pris en charge',
    'login.feat2': 'Videos tutoriels YouTube',
    'login.feat3': 'Arabe, Anglais et Francais',
    'login.feat4': 'Themes personnalisables',
    'login.title': 'Connexion a MECANO',
    'login.subtitle': 'Choisissez votre mode de connexion',
    'login.google': 'Se connecter avec Google',
    'login.or': 'ou',
    'login.guest': 'Continuer en invite',
    'login.note': 'Google partage uniquement votre nom et email. Nous ne voyons jamais votre mot de passe.'
  }
};

let currentLang = localStorage.getItem('mecano_lang') || 'en';

function setLang(lang = 'en') {
  currentLang = (I18N[lang] ? lang : 'en');
  localStorage.setItem('mecano_lang', currentLang);

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  const dict = I18N[currentLang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === currentLang);
  });
}

function setLoginMessage(text, type = '') {
  const message = document.getElementById('loginMessage');
  if (!message) {
    return;
  }

  message.className = type ? `login-message ${type}` : 'login-message';
  message.textContent = text || '';
}

function saveUserSession(user) {
  const serialized = JSON.stringify(user);
  sessionStorage.setItem('mecano_user', serialized);
  localStorage.setItem('mecano_user', serialized);
}

function redirectToApp() {
  window.location.replace('car-repair-1.html');
}

function loginWithGoogle() {
  setLoginMessage('Connecting to Google...', 'success');

  // Simulated OAuth flow for now; replace with real provider callback when ready.
  setTimeout(() => {
    saveUserSession({
      name: 'Google User',
      email: 'user@gmail.com',
      isGuest: false,
      provider: 'google'
    });
    redirectToApp();
  }, 900);
}

function loginAsGuest() {
  saveUserSession({
    name: 'Guest',
    isGuest: true,
    provider: 'guest'
  });
  redirectToApp();
}

function userAlreadyLoggedIn() {
  return Boolean(sessionStorage.getItem('mecano_user'));
}

window.addEventListener('DOMContentLoaded', () => {
  if (userAlreadyLoggedIn()) {
    redirectToApp();
    return;
  }

  const storedTheme = localStorage.getItem('mecano_theme') || 'dark';
  if (storedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  setLang(currentLang);
});
