
/* Frontend results now come from the backend /search endpoint. */

let availableCars = [];
let currentLang = localStorage.getItem('mecano_lang') || 'ar';

const I18N = {
  ar: {
    'logo.sub': 'تشخيص السيارات',
    'nav.home': 'الرئيسية',
    'nav.engines': 'المحركات',
    'nav.videos': 'الفيديوهات',
    'nav.admin': 'دخول المدير',
    'nav.contact': 'تواصل معنا',
    'theme.title': 'اختر المظهر',
    'hero.badge': '⚡ تشخيص فوري ودقيق',
    'hero.title.main': 'اكتشف مشاكل سيارتك',
    'hero.title.span': 'في ثوانٍ',
    'hero.subtitle': 'أدخل معلومات سيارتك واحصل على قائمة بالمشاكل الشائعة مع فيديوهات توضيحية للإصلاح',
    'form.brand': '🚗 اسم السيارة (الماركة)',
    'form.model': '🏷️ الموديل',
    'form.engine': '⚙️ نوع المحرك',
    'form.size': '🔩 سعة المحرك',
    'form.year': '📅 سنة الصنع (اختياري)',
    'form.submit': '🔍 ابدأ التشخيص',
    'form.brandPH': '-- اختر الماركة --',
    'form.modelPH': '-- اختر الموديل --',
    'form.enginePH': '-- اختر نوع المحرك --',
    'form.sizePH': '-- اختر السعة --',
    'form.yearPH': '-- كل السنوات --',
    'loading': '',
    'results.title': 'المشاكل الشائعة لـ ',
    'results.found': 'مشكلة مكتشفة',
    'results.high': 'خطورة عالية',
    'results.videos': 'فيديو توضيحي',
    'results.none.title': 'لا توجد مشاكل مطابقة',
    'results.none.desc': 'جرّب تغيير بيانات البحث أو أضف بيانات من لوحة الإدارة.',
    'error.carsLoad': 'تعذر تحميل قائمة السيارات',
    'error.noResults': 'لا توجد نتائج مطابقة',
    'error.server': 'فشل الاتصال بالخادم',
    'problem.default': 'مشكلة',
    'solution.default': 'لا يوجد نص حل مسجل حالياً',
    'sev.high': '🔴 خطورة عالية',
    'sev.med': '🟡 خطورة متوسطة',
    'sev.low': '🟢 خطورة منخفضة',
    'video.title': 'فيديو توضيحي',
    'video.subtitle': 'شاهد الفيديو واتبع الخطوات أدناه',
    'video.placeholder': 'لا يوجد فيديو لهذا العطل حالياً',
    'solution.heading': '📝 نص الحل'
  },
  en: {
    'logo.sub': 'Car Diagnostics',
    'nav.home': 'Home',
    'nav.engines': 'Engines',
    'nav.videos': 'Videos',
    'nav.admin': 'Admin Login',
    'nav.contact': 'Contact',
    'theme.title': 'Choose Theme',
    'hero.badge': '⚡ Fast & Accurate Diagnostics',
    'hero.title.main': "Discover Your Car's Problems",
    'hero.title.span': 'In Seconds',
    'hero.subtitle': 'Enter your car details and get common issues with repair video guidance.',
    'form.brand': '🚗 Car Brand',
    'form.model': '🏷️ Model',
    'form.engine': '⚙️ Engine Type',
    'form.size': '🔩 Engine Capacity',
    'form.year': '📅 Year (optional)',
    'form.submit': '🔍 Start Diagnosis',
    'form.brandPH': '-- Select brand --',
    'form.modelPH': '-- Select model --',
    'form.enginePH': '-- Select engine type --',
    'form.sizePH': '-- Select capacity --',
    'form.yearPH': '-- All years --',
    'loading': '',
    'results.title': 'Common Problems for ',
    'results.found': 'Problems Found',
    'results.high': 'High Severity',
    'results.videos': 'Tutorial Videos',
    'results.none.title': 'No matching issues found',
    'results.none.desc': 'Try changing search filters or add data from Admin Panel.',
    'error.carsLoad': 'Failed to load car list',
    'error.noResults': 'No matching results found',
    'error.server': 'Server connection failed',
    'problem.default': 'Problem',
    'solution.default': 'No solution text is available yet',
    'sev.high': '🔴 High Severity',
    'sev.med': '🟡 Medium Severity',
    'sev.low': '🟢 Low Severity',
    'video.title': 'Tutorial Video',
    'video.subtitle': 'Watch the video and follow the steps below',
    'video.placeholder': 'No video is available for this issue yet',
    'solution.heading': '📝 Solution Text'
  },
  fr: {
    'logo.sub': 'Diagnostic Auto',
    'nav.home': 'Accueil',
    'nav.engines': 'Moteurs',
    'nav.videos': 'Videos',
    'nav.admin': 'Connexion Admin',
    'nav.contact': 'Contact',
    'theme.title': 'Choisir un theme',
    'hero.badge': '⚡ Diagnostic rapide et precis',
    'hero.title.main': 'Decouvrez les pannes de votre voiture',
    'hero.title.span': 'En quelques secondes',
    'hero.subtitle': 'Entrez les details de votre voiture et obtenez des pannes courantes avec des videos de reparation.',
    'form.brand': '🚗 Marque',
    'form.model': '🏷️ Modele',
    'form.engine': '⚙️ Type de moteur',
    'form.size': '🔩 Cylindree',
    'form.year': '📅 Annee (optionnel)',
    'form.submit': '🔍 Lancer le diagnostic',
    'form.brandPH': '-- Choisir la marque --',
    'form.modelPH': '-- Choisir le modele --',
    'form.enginePH': '-- Choisir le moteur --',
    'form.sizePH': '-- Choisir la cylindree --',
    'form.yearPH': '-- Toutes les annees --',
    'loading': '',
    'results.title': 'Problemes courants pour ',
    'results.found': 'Problemes trouves',
    'results.high': 'Gravite elevee',
    'results.videos': 'Videos tutoriels',
    'results.none.title': 'Aucun probleme correspondant',
    'results.none.desc': "Essayez d'autres filtres ou ajoutez des donnees depuis l'administration.",
    'error.carsLoad': 'Impossible de charger la liste des voitures',
    'error.noResults': 'Aucun resultat correspondant',
    'error.server': 'Echec de connexion au serveur',
    'problem.default': 'Probleme',
    'solution.default': 'Aucun texte de solution disponible pour le moment',
    'sev.high': '🔴 Gravite elevee',
    'sev.med': '🟡 Gravite moyenne',
    'sev.low': '🟢 Gravite faible',
    'video.title': 'Video tutoriel',
    'video.subtitle': 'Regardez la video puis suivez les etapes',
    'video.placeholder': "Aucune video n'est disponible pour cette panne", 
    'solution.heading': '📝 Texte de solution'
  }
};

function t(key) {
  const langPack = I18N[currentLang] || I18N.ar;
  return langPack[key] || I18N.ar[key] || key;
}

function applyStaticTranslations() {
  const navLinks = document.querySelectorAll('header nav a');
  if (navLinks[0]) navLinks[0].textContent = t('nav.home');
  if (navLinks[1]) navLinks[1].textContent = t('nav.engines');
  if (navLinks[2]) navLinks[2].textContent = t('nav.videos');
  if (navLinks[3]) navLinks[3].textContent = t('nav.admin');
  if (navLinks[4]) navLinks[4].textContent = t('nav.contact');

  const logoSub = document.querySelector('.logo-sub');
  if (logoSub) logoSub.textContent = t('logo.sub');

  const themeTitle = document.querySelector('.theme-picker-title');
  if (themeTitle) themeTitle.textContent = t('theme.title');

  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) heroBadge.textContent = t('hero.badge');

  const heroTitleMain = document.querySelector('.hero h1');
  const heroTitleSpan = document.querySelector('.hero h1 span');
  if (heroTitleMain && heroTitleSpan) {
    heroTitleMain.childNodes[0].textContent = t('hero.title.main');
    heroTitleSpan.textContent = t('hero.title.span');
  }

  const heroSubtitle = document.querySelector('.hero p');
  if (heroSubtitle) heroSubtitle.textContent = t('hero.subtitle');

  const labels = document.querySelectorAll('.form-card .field label');
  if (labels[0]) labels[0].childNodes[1].textContent = ` ${t('form.brand').replace('🚗', '').trim()}`;
  if (labels[1]) labels[1].childNodes[1].textContent = ` ${t('form.model').replace('🏷️', '').trim()}`;
  if (labels[2]) labels[2].childNodes[1].textContent = ` ${t('form.engine').replace('⚙️', '').trim()}`;
  if (labels[3]) labels[3].childNodes[1].textContent = ` ${t('form.size').replace('🔩', '').trim()}`;
  if (labels[4]) labels[4].childNodes[1].textContent = ` ${t('form.year').replace('📅', '').trim()}`;

  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) searchBtn.textContent = t('form.submit');

  const loadingText = document.querySelector('#loading p');
  if (loadingText) loadingText.textContent = t('loading');

  const resultsTitleNode = document.querySelector('.results-title');
  if (resultsTitleNode) {
    resultsTitleNode.childNodes[0].textContent = t('results.title');
  }

  const statLabels = document.querySelectorAll('.stats .lbl');
  if (statLabels[0]) statLabels[0].textContent = t('results.found');
  if (statLabels[1]) statLabels[1].textContent = t('results.high');
  if (statLabels[2]) statLabels[2].textContent = t('results.videos');

  const videoTitle = document.getElementById('videoTitle');
  if (videoTitle && !document.querySelector('.problem-card.selected')) {
    videoTitle.textContent = t('video.title');
  }

  const videoSubtitle = document.getElementById('videoSubtitle');
  if (videoSubtitle && !document.querySelector('.problem-card.selected')) {
    videoSubtitle.textContent = t('video.subtitle');
  }

  const videoPlaceholder = document.querySelector('.video-placeholder p');
  if (videoPlaceholder && !document.querySelector('.problem-card.selected')) {
    videoPlaceholder.textContent = t('video.placeholder');
  }

  const stepsHeading = document.querySelector('#stepsSection h4');
  if (stepsHeading && document.getElementById('stepsSection').style.display !== 'block') {
    stepsHeading.textContent = t('solution.heading');
  }
}

function goHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getThemePicker() {
  return document.getElementById('themePicker');
}

function setActiveSwatch(theme) {
  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.classList.toggle('active', swatch.dataset.theme === theme);
  });
}

async function syncAdminSessionBadge() {
  const badge = document.getElementById('adminSessionBadge');
  if (!badge) {
    return;
  }

  try {
    const response = await fetch('/auth/me', { credentials: 'include' });
    badge.hidden = !response.ok;
  } catch (_) {
    badge.hidden = true;
  }
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
  const picker = getThemePicker();
  if (!picker) {
    return;
  }
  picker.classList.toggle('open');
}

function setLang(lang = 'ar') {
  const normalized = String(lang || 'ar').toLowerCase();
  currentLang = I18N[normalized] ? normalized : 'ar';
  const isArabic = currentLang === 'ar';
  document.documentElement.lang = isArabic ? 'ar' : currentLang;
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  localStorage.setItem('mecano_lang', currentLang);

  document.querySelectorAll('.lang-btn-h').forEach((btn) => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === currentLang);
  });

  applyStaticTranslations();
  if (availableCars.length) {
    applyCarFilters();
  }
}

function initHeaderEnhancements() {
  const storedTheme = localStorage.getItem('mecano_theme') || 'dark';
  applyTheme(storedTheme);

  const storedLang = localStorage.getItem('mecano_lang') || 'ar';
  setLang(storedLang);
  syncAdminSessionBadge();

  document.addEventListener('click', (event) => {
    const picker = getThemePicker();
    if (!picker || !picker.classList.contains('open')) {
      return;
    }

    const clickedThemeButton = event.target.closest('.theme-btn');
    const insidePicker = event.target.closest('#themePicker');
    if (!insidePicker && !clickedThemeButton) {
      picker.classList.remove('open');
    }
  });
}

function uniqueValues(list, key) {
  return [...new Set(list.map(item => item[key]).filter(v => v !== null && v !== undefined && String(v).trim() !== ''))];
}

function fillSelect(selectId, values, placeholder, formatter = (v) => v) {
  const select = document.getElementById(selectId);
  const currentValue = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;

  values.forEach(value => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = formatter(value);
    select.appendChild(option);
  });

  if (values.map(String).includes(currentValue)) {
    select.value = currentValue;
  }
}

function extractYoutubeId(value) {
  if (!value) {
    return null;
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return raw;
  }

  const match = raw.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeSeverity(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'high') {
    return 'high';
  }
  if (normalized === 'low') {
    return 'low';
  }
  return 'med';
}

function applyCarFilters() {
  const selectedBrand = document.getElementById('carBrand').value;
  const selectedModel = document.getElementById('carModel').value;
  const selectedType = document.getElementById('engineType').value;
  const selectedSize = document.getElementById('engineSize').value;

  const byBrand = selectedBrand ? availableCars.filter(c => c.brand === selectedBrand) : availableCars;
  fillSelect('carModel', uniqueValues(byBrand, 'model').sort(), t('form.modelPH'));

  const byModel = selectedModel ? byBrand.filter(c => c.model === selectedModel) : byBrand;
  fillSelect('engineType', uniqueValues(byModel, 'engine_type').sort(), t('form.enginePH'));

  const byType = selectedType ? byModel.filter(c => c.engine_type === selectedType) : byModel;
  const sizes = uniqueValues(byType, 'engine_size').sort((a, b) => Number(a) - Number(b));
  fillSelect('engineSize', sizes, t('form.sizePH'), (v) => `${v} L`);

  const bySize = selectedSize ? byType.filter(c => String(c.engine_size) === selectedSize) : byType;
  const years = uniqueValues(bySize, 'year').sort((a, b) => Number(b) - Number(a));
  fillSelect('carYear', years, t('form.yearPH'));
}

async function initCarDropdowns() {
  try {
    const response = await fetch('/cars');
    if (!response.ok) {
      throw new Error(t('error.carsLoad'));
    }

    const data = await response.json();
    availableCars = data.cars || [];

    fillSelect('carBrand', uniqueValues(availableCars, 'brand').sort(), t('form.brandPH'));
    applyCarFilters();

    document.getElementById('carBrand').addEventListener('change', () => {
      document.getElementById('carModel').value = '';
      document.getElementById('engineType').value = '';
      document.getElementById('engineSize').value = '';
      document.getElementById('carYear').value = '';
      applyCarFilters();
    });

    document.getElementById('carModel').addEventListener('change', () => {
      document.getElementById('engineType').value = '';
      document.getElementById('engineSize').value = '';
      document.getElementById('carYear').value = '';
      applyCarFilters();
    });

    document.getElementById('engineType').addEventListener('change', () => {
      document.getElementById('engineSize').value = '';
      document.getElementById('carYear').value = '';
      applyCarFilters();
    });

    document.getElementById('engineSize').addEventListener('change', applyCarFilters);
  } catch (err) {
    alert(err.message);
  }
}

/* ══════════════════════════════════════════
   MAIN FUNCTION
══════════════════════════════════════════ */

async function searchProblems() {
  const brand = document.getElementById('carBrand').value;
  const model = document.getElementById('carModel').value;
  const engType = document.getElementById('engineType').value;
  const engSize = document.getElementById('engineSize').value;
  const yearRaw = document.getElementById('carYear').value;

  if (!brand || !engType || !engSize) {
    shake(document.querySelector('.form-card'));
    highlight(!brand ? 'carBrand' : !engType ? 'engineType' : 'engineSize');
    return;
  }

  const resultsEl = document.getElementById('results');
  resultsEl.classList.add('visible');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('loading').classList.add('active');
  document.getElementById('resultsContent').style.display = 'none';
  document.getElementById('video-section').classList.remove('visible');

  try {
    const response = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand,
        model: model || null,
        engine_type: engType,
        engine_size: Number(engSize),
        year: yearRaw ? Number(yearRaw) : null
      })
    });

    if (!response.ok) {
      throw new Error(response.status === 404 ? t('error.noResults') : t('error.server'));
    }

    const data = await response.json();
    const problems = data.map((item, idx) => ({
      id: idx + 1,
      name: item.title || `${t('problem.default')} ${idx + 1}`,
      desc: item.description || '',
      icon: '🔧',
      sev: normalizeSeverity(item.danger_level),
      tags: item.tags || ['من قاعدة البيانات'],
      videoId: extractYoutubeId(item.video_url),
      solutionText: item.solution_text || t('solution.default')
    }));

    renderResults(brand, model, yearRaw, engType, engSize, problems);
  } catch (err) {
    document.getElementById('loading').classList.remove('active');
    alert(err.message);
  }
}


function renderResults(brand, model, year, engType, engSize, problems) {
  document.getElementById('loading').classList.remove('active');
  document.getElementById('resultsContent').style.display = 'block';

  // Title & badge
  const label = brand + (model ? ' ' + model : '') + (year ? ' (' + year + ')' : '');
  document.getElementById('carTitle').textContent = label;

  const engLabels = {
    essence: 'Gasoline', gasoline: 'Gasoline',
    diesel: 'Diesel',
    hybride: 'Hybrid', hybrid: 'Hybrid',
    electrique: 'Electric', electric: 'Electric',
    gpl: 'LPG', lpg: 'LPG'
  };
  document.getElementById('engineBadge').textContent =
    '⚙️ ' + (engLabels[engType] || engType) + ' · ' + engSize + ' L';

  // Stats
  const high = problems.filter(p => p.sev === 'high').length;
  document.getElementById('statTotal').textContent  = problems.length;
  document.getElementById('statHigh').textContent   = high;
  document.getElementById('statVideos').textContent = problems.filter(p=>p.videoId).length;

  // Render cards
  const list = document.getElementById('problemsList');
  list.innerHTML = '';

  if (!problems.length) {
    list.innerHTML = `<div class="problem-card"><div class="problem-info"><div class="problem-name">${t('results.none.title')}</div><div class="problem-desc">${t('results.none.desc')}</div></div></div>`;
    return;
  }

  problems.forEach((p, i) => {
    const sevClass = { high: 'sev-high', med: 'sev-med', low: 'sev-low' }[p.sev];
    const tagClass = { high: 'tag-sev-high', med: 'tag-sev-med', low: 'tag-sev-low' }[p.sev];
    const sevLabel = { high: t('sev.high'), med: t('sev.med'), low: t('sev.low') }[p.sev];

    const card = document.createElement('div');
    card.className = 'problem-card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.style.animation = 'fadeUp .4s ease both';
    card.innerHTML = `
      <div class="problem-icon ${sevClass}">${p.icon}</div>
      <div class="problem-info">
        <div class="problem-name">${p.name}</div>
        <div class="problem-desc">${p.desc}</div>
        <div class="problem-meta">
          <span class="tag ${tagClass}">${sevLabel}</span>
          ${p.tags.map(t => `<span class="tag tag-gray">${t}</span>`).join('')}
        </div>
      </div>
      <div class="problem-arrow">←</div>
    `;
    card.onclick = () => selectProblem(card, p);
    list.appendChild(card);
  });

  // Hide video section until selection
  document.getElementById('video-section').classList.remove('visible');
}

function selectProblem(card, problem) {
  // Deselect all
  document.querySelectorAll('.problem-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  // Show video section
  const vs = document.getElementById('video-section');
  vs.classList.add('visible');
  vs.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Update header
  document.getElementById('videoTitle').textContent    = problem.name;
  document.getElementById('videoSubtitle').textContent = t('video.subtitle');

  // Embed YouTube
  const frame = document.getElementById('videoFrame');
  if (problem.videoId) {
    frame.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${problem.videoId}?rel=0&modestbranding=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
  } else {
    frame.innerHTML = `<div class="video-placeholder"><div class="ph-icon">📚</div><p>${t('video.placeholder')}</p></div>`;
  }

  // Solution text
  const stepsSection = document.getElementById('stepsSection');
  const stepsList    = document.getElementById('stepsList');
  const heading = stepsSection.querySelector('h4');
  if (heading) {
    heading.textContent = t('solution.heading');
  }
  stepsList.innerHTML = `<div class="step-item"><div>${escapeHtml(problem.solutionText).replaceAll('\n', '<br/>')}</div></div>`;
  stepsSection.style.display = 'block';
}

/* ── Helpers ── */
function shake(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake .4s ease';
}

function highlight(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ef4444';
  el.focus();
  setTimeout(() => el.style.borderColor = '', 1500);
}

// Add shake keyframe
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-6px)}
  80%{transform:translateX(6px)}
}`;
document.head.appendChild(style);

// Allow Enter key
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchProblems();
});

async function boot() {
  initHeaderEnhancements();
  await initCarDropdowns();
}

boot();
