const I18N = {
  en: {
    'brand.tagline': 'Car Diagnostics',
    'nav.home': 'Home',
    'nav.engines': 'Engines',
    'nav.videos': 'Videos',
    'nav.admin': 'Admin Login',
    'nav.contact': 'Contact',
    'theme.title': 'Choose Theme',
    'login.badge': 'Admin access only',
    'login.headline': 'Diagnose your car problems instantly',
    'login.desc': 'Enter your car details and get a complete list of common problems with step-by-step YouTube repair videos.',
    'login.feat1': '5 engine types supported',
    'login.feat2': 'YouTube tutorial videos',
    'login.feat3': 'Arabic, English & French',
    'login.feat4': 'Customizable color themes',
    'login.title': 'Admin Sign In',
    'login.subtitle': 'Use your admin email and password to continue',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.note': 'Authentication is handled by the backend and works fully offline.',
    'login.success': 'Login successful. Redirecting to admin panel...',
    'login.error': 'Invalid email or password',
    'login.required': 'Email and password are required'
  },
  ar: {
    'brand.tagline': 'تشخيص السيارات',
    'nav.home': 'الرئيسية',
    'nav.engines': 'المحركات',
    'nav.videos': 'الفيديوهات',
    'nav.admin': 'دخول المدير',
    'nav.contact': 'تواصل معنا',
    'theme.title': 'اختر المظهر',
    'login.badge': 'الدخول للمدير فقط',
    'login.headline': 'شخّص مشاكل سيارتك فوراً',
    'login.desc': 'أدخل معلومات سيارتك واحصل على قائمة كاملة بالمشاكل الشائعة مع فيديوهات إصلاح خطوة بخطوة.',
    'login.feat1': 'يدعم 5 أنواع محركات',
    'login.feat2': 'فيديوهات تعليمية من يوتيوب',
    'login.feat3': 'العربية والإنجليزية والفرنسية',
    'login.feat4': 'ألوان قابلة للتخصيص',
    'login.title': 'دخول المدير',
    'login.subtitle': 'استخدم بريد المدير وكلمة المرور للمتابعة',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.submit': 'تسجيل الدخول',
    'login.note': 'المصادقة تتم من خلال الخادم وتعمل بالكامل دون خدمات خارجية.',
    'login.success': 'تم تسجيل الدخول بنجاح. جاري التحويل للوحة الإدارة...',
    'login.error': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'login.required': 'البريد الإلكتروني وكلمة المرور مطلوبان'
  },
  fr: {
    'brand.tagline': 'Diagnostic Auto',
    'nav.home': 'Accueil',
    'nav.engines': 'Moteurs',
    'nav.videos': 'Videos',
    'nav.admin': 'Connexion Admin',
    'nav.contact': 'Contact',
    'theme.title': 'Choisir un theme',
    'login.badge': 'Acces admin uniquement',
    'login.headline': 'Diagnostiquez vos pannes instantanement',
    'login.desc': 'Saisissez les details de votre voiture et obtenez une liste complete des pannes courantes avec des videos de reparation.',
    'login.feat1': '5 types de moteur pris en charge',
    'login.feat2': 'Videos tutoriels YouTube',
    'login.feat3': 'Arabe, anglais et francais',
    'login.feat4': 'Themes personnalisables',
    'login.title': 'Connexion Admin',
    'login.subtitle': 'Utilisez votre e-mail admin et votre mot de passe',
    'login.email': 'E-mail',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.note': "L'authentification est geree par le backend et fonctionne hors ligne.",
    'login.success': "Connexion reussie. Redirection vers l'administration...",
    'login.error': 'Identifiants admin invalides',
    'login.required': "L'e-mail et le mot de passe sont obligatoires"
  }
};

let currentLang = localStorage.getItem('mecano_lang') || 'en';

function t(key) {
  const pack = I18N[currentLang] || I18N.en;
  return pack[key] || I18N.en[key] || key;
}

function setLang(lang) {
  currentLang = I18N[lang] ? lang : 'en';
  localStorage.setItem('mecano_lang', currentLang);

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('.lang-btn-h, .lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === currentLang);
  });

  const emailInput = document.getElementById('loginEmail');
  if (emailInput) {
    emailInput.placeholder = currentLang === 'ar' ? 'admin@mechano.local' : 'admin@mechano.local';
  }

  const passwordInput = document.getElementById('loginPassword');
  if (passwordInput) {
    passwordInput.placeholder = currentLang === 'ar' ? '••••••••' : '••••••••';
  }
}

function setActiveSwatch(theme) {
  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.classList.toggle('active', swatch.dataset.theme === theme);
  });
}

function applyTheme(theme = 'dark') {
  const normalized = String(theme || 'dark').toLowerCase();
  const nextTheme = normalized === 'light' ? 'light' : 'dark';
  if (nextTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', nextTheme);
  }
  localStorage.setItem('mecano_theme', nextTheme);
  setActiveSwatch(nextTheme);
}

function toggleThemePicker() {
  const picker = document.getElementById('themePicker');
  if (picker) {
    picker.classList.toggle('open');
  }
}

document.addEventListener('click', (event) => {
  const picker = document.getElementById('themePicker');
  if (!picker || !picker.classList.contains('open')) {
    return;
  }

  const clickedThemeButton = event.target.closest('.theme-btn');
  const insidePicker = event.target.closest('#themePicker');
  if (!insidePicker && !clickedThemeButton) {
    picker.classList.remove('open');
  }
});

function setMessage(text, isError = false) {
  const message = document.getElementById('loginMessage');
  if (!message) {
    return;
  }

  message.textContent = text;
  message.className = `login-message ${isError ? 'error' : 'success'}`;
}

async function checkAdminSession() {
  try {
    const response = await fetch('/auth/me', { credentials: 'include' });
    if (response.ok) {
      window.location.replace('/admin');
    }
  } catch (_) {
    // Keep user on login when the server is unavailable.
  }
}

async function login(event) {
  event.preventDefault();

  const email = String(document.getElementById('loginEmail')?.value || '').trim();
  const password = String(document.getElementById('loginPassword')?.value || '');

  if (!email || !password) {
    setMessage(t('login.required'), true);
    return;
  }

  setMessage('');

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (_) {
      payload = null;
    }

    if (!response.ok) {
      setMessage(payload?.error || t('login.error'), true);
      return;
    }

    setMessage(t('login.success'));
    window.location.replace('/admin');
  } catch (_) {
    setMessage('Server connection failed', true);
  }
}

window.setLang = setLang;

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('mecano_theme') || 'dark';
  applyTheme(storedTheme);
  setLang(currentLang);
  checkAdminSession();

  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', login);
  }
});
