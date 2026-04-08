
/* ══════════════════════════════════════════
   DATA — مشاكل شائعة حسب نوع المحرك
══════════════════════════════════════════ */
const problemsDB = {
  essence: [
    {
      id: 1,
      name: "مشكلة الشمعات (البوجيهات)",
      desc: "تآكل شمعات الإشعال يؤدي إلى اهتزاز المحرك وصعوبة في الإقلاع وزيادة استهلاك الوقود.",
      icon: "⚡",
      sev: "high",
      tags: ["شمعات", "إشعال"],
      videoId: "3rGIBFj6fBo",
      steps: [
        "افصل سلبي البطارية قبل البدء",
        "أزل غطاء المحرك وحدد موقع البوجيهات",
        "استخدم مفتاح البوجي المناسب لإخراجها",
        "فحص حالة الشمعة (لون، تآكل، ترسبات)",
        "ضع الشمعات الجديدة وشدّها بالعزم المناسب",
        "أعد توصيل أسلاك الإشعال وجرّب الإقلاع"
      ]
    },
    {
      id: 2,
      name: "تسريب في نظام الوقود",
      desc: "تسريب بنزين من خراطيم أو موصلات الوقود، خطير جداً ويجب إصلاحه فوراً.",
      icon: "⛽",
      sev: "high",
      tags: ["وقود", "تسريب"],
      videoId: "k8pWGHbONew",
      steps: [
        "أوقف المحرك فوراً وابتعد عن مصادر النار",
        "تفقد خراطيم الوقود بصرياً",
        "استخدم كاشف التسريب لتحديد الموقع",
        "استبدل الخرطوم أو القطعة التالفة",
        "تأكد من إحكام جميع الوصلات"
      ]
    },
    {
      id: 3,
      name: "مشكلة الحاقن (الانجكتور)",
      desc: "انسداد أو عطل في حاقن الوقود يتسبب في اختلال خليط الهواء والوقود.",
      icon: "💉",
      sev: "med",
      tags: ["حاقن", "وقود"],
      videoId: "Ry0MFq-hfhc",
      steps: [
        "استخدم جهاز OBD-II لقراءة أكواد الأعطال",
        "أزل شريحة الحاقنات",
        "نظّف الحاقنات بالمنظف المتخصص",
        "في حالة العطل الكامل، استبدل الحاقن",
        "امسح أكواد الأعطال وجرّب المحرك"
      ]
    },
    {
      id: 4,
      name: "عطل مستشعر الأكسجين (Lambda)",
      desc: "المستشعر التالف يؤثر على نسبة خليط الوقود ويزيد انبعاثات العادم.",
      icon: "📡",
      sev: "med",
      tags: ["مستشعر", "عادم"],
      videoId: "zVHJ_H1IzLg",
      steps: [
        "اقرأ كود الخطأ بجهاز OBD",
        "حدد موقع المستشعر على أنبوب العادم",
        "استخدم مفتاح المستشعر المتخصص",
        "فكّ المستشعر القديم وركّب الجديد",
        "امسح الأكواد وأعِد ضبط منظومة الوقود"
      ]
    },
    {
      id: 5,
      name: "مشكلة في عمود الكمبريسور",
      desc: "أصوات طقطقة عند الانعطاف تدل على تلف مفصل الكمبريسور أو أسطوانة الزيت.",
      icon: "🔗",
      sev: "low",
      tags: ["نقل الحركة", "صوت"],
      videoId: "9Y4pQQ7AXPI",
      steps: [
        "تأكد من مصدر الصوت عند الانعطاف",
        "افحص مستوى الزيت في صندوق التروس",
        "فكّ العجلة وتفقد الكمبريسور بصرياً",
        "غيّر مجموعة الكمبريسور التالفة",
        "أعد تركيب العجلة وجرّب الانعطاف"
      ]
    }
  ],

  diesel: [
    {
      id: 1,
      name: "انسداد فلتر الجسيمات (FAP/DPF)",
      desc: "تراكم السناج في فلتر العادم يؤدي إلى ضعف المحرك وظهور ضوء التحذير.",
      icon: "🌫️",
      sev: "high",
      tags: ["FAP", "عادم", "ديزل"],
      videoId: "oFJ3uIhV0xk",
      steps: [
        "تحقق من ضوء FAP في لوحة القيادة",
        "جرّب القيادة على الطريق السريع 20 دقيقة (Régénération active)",
        "إذا استمرت المشكلة، أزل الفلتر",
        "نظّف بمنظف متخصص أو استبدله",
        "امسح كود الخطأ وأعِد ضبط ECU"
      ]
    },
    {
      id: 2,
      name: "عطل بومبة الغازوال",
      desc: "ضغط الوقود المنخفض يمنع الإقلاع السليم أو يتسبب في خمود المحرك.",
      icon: "💧",
      sev: "high",
      tags: ["بومبة", "وقود", "ديزل"],
      videoId: "5-sxIHBKrCc",
      steps: [
        "قِس ضغط مضخة الوقود بمقياس مخصص",
        "افحص فلتر الغازوال أولاً (قد يكون الحل)",
        "إذا كانت المضخة تالفة، افصل الخراطيم",
        "ركّب المضخة الجديدة من نفس المواصفات",
        "هوّد النظام من الهواء قبل الإقلاع"
      ]
    },
    {
      id: 3,
      name: "مشكلة نظام الـ EGR",
      desc: "انسداد صمام EGR يسبب دخاناً كثيفاً وزيادة في استهلاك الوقود.",
      icon: "🔄",
      sev: "med",
      tags: ["EGR", "انبعاثات"],
      videoId: "7wRDGqg-Lcc",
      steps: [
        "اقرأ أكواد الأعطال بجهاز التشخيص",
        "حدد موقع صمام EGR (بالقرب من المحرك)",
        "افصل القابس الكهربائي والأنابيب",
        "نظّف الصمام بالمنظف أو استبدله",
        "أعد التركيب وامسح الأكواد"
      ]
    },
    {
      id: 4,
      name: "تسريب الديزل من الحاقنات",
      desc: "تسريب حول الحاقنات يسبب ترسبات زيتية ورائحة وقود داخل المقصورة.",
      icon: "🔧",
      sev: "med",
      tags: ["حاقن", "تسريب"],
      videoId: "bCAnH3RDm5o",
      steps: [
        "تفقد منطقة الحاقنات بحثاً عن آثار زيتية",
        "أزل غطاء المحرك للوصول إلى الحاقنات",
        "استبدل حلقات التسريب (joints de cuivre)",
        "شدّ الحاقنات بعزم محدد",
        "نظّف المنطقة وتأكد من انعدام التسريب"
      ]
    },
    {
      id: 5,
      name: "ضعف عمود التوربو",
      desc: "اهتزاز التوربو أو ضعف الأداء قد يدل على تلف في محاور دوران التوربو.",
      icon: "🌀",
      sev: "low",
      tags: ["توربو", "أداء"],
      videoId: "JQ5QMcmhDgU",
      steps: [
        "افحص خرطوم هواء التوربو",
        "تحقق من مستوى زيت المحرك",
        "أدِر المحرك وانتبه لأي صوت صفير",
        "في حالة التلف، أزل التوربو بالكامل",
        "ركّب توربو جديد أو مُعاد تصنيعه"
      ]
    }
  ],

  hybride: [
    {
      id: 1,
      name: "تدهور خلايا البطارية الهجينة",
      desc: "انخفاض مساحة الشحن وزيادة الاستهلاك يدلان على ضعف خلايا الهجين.",
      icon: "🔋",
      sev: "high",
      tags: ["بطارية", "هجين"],
      videoId: "jf-HAnFQJOM",
      steps: [
        "اقرأ أكواد الخطأ المتعلقة بالبطارية",
        "قِس توازن الخلايا بجهاز متخصص",
        "استبدل الخلايا التالفة فردياً أو كلياً",
        "إعادة ضبط (Calibration) منظومة إدارة البطارية",
        "جرّب دورة شحن كاملة وراقب الأداء"
      ]
    },
    {
      id: 2,
      name: "عطل المحول الكهربائي (Inverter)",
      desc: "الإنفرتر التالف يمنع تحويل الطاقة بين المحرك الكهربائي والبطارية.",
      icon: "⚡",
      sev: "high",
      tags: ["إنفرتر", "كهرباء"],
      videoId: "wHy8XrxLTMs",
      steps: [
        "تحقق من أكواد الخطأ بجهاز خاص بالهجين",
        "افصل الكهرباء الرئيسية (الأورانج كابل)",
        "فك الإنفرتر بحذر تام",
        "استبدله بقطعة أصلية معتمدة",
        "أعد الاختبار بالجهاز التشخيصي"
      ]
    },
    {
      id: 3,
      name: "ضعف مولد الشحن (Generator)",
      desc: "المولد لا يشحن البطارية الهجينة بشكل صحيح مما يستنزف الطاقة.",
      icon: "🔌",
      sev: "med",
      tags: ["مولد", "شحن"],
      videoId: "sU3n2BRSROA",
      steps: [
        "راقب مستوى الشحن على لوحة القيادة",
        "اقرأ قيم الشحن بجهاز OBD",
        "افحص أسلاك المولد",
        "اختبر المولد بالفصل وقياس الجهد",
        "استبدله إذا كانت قراءات الجهد منخفضة"
      ]
    }
  ],

  electrique: [
    {
      id: 1,
      name: "تدهور خلايا البطارية الرئيسية",
      desc: "انخفاض مستمر في المدى الكهربائي يدل على تدهور خلايا Li-Ion.",
      icon: "🔋",
      sev: "high",
      tags: ["بطارية", "كهربائي"],
      videoId: "Q1mklWoKaRc",
      steps: [
        "راقب نسبة تدهور البطارية في إعدادات السيارة",
        "افحص الخلايا بجهاز متخصص (BMS)",
        "تأكد من عدم وجود خلايا بها تسريب حراري",
        "استبدل الموديل البطاري كلياً إن لزم",
        "أعد معايرة نظام إدارة البطارية"
      ]
    },
    {
      id: 2,
      name: "بطء أو فشل الشحن",
      desc: "مشاكل في محطة الشحن أو الـ OBC الداخلي تمنع الشحن الكامل.",
      icon: "⚡",
      sev: "high",
      tags: ["شحن", "OBC"],
      videoId: "6_mCxMWdFYg",
      steps: [
        "جرّب محطة شحن مختلفة",
        "فحص كابل الشحن والموصل",
        "اقرأ أكواد خطأ نظام الشحن",
        "فحص الـ OBC داخل السيارة",
        "تواصل مع الوكالة إذا استمرت المشكلة"
      ]
    },
    {
      id: 3,
      name: "مشكلة في نظام التبريد للبطارية",
      desc: "ارتفاع حرارة البطارية أثناء الشحن أو القيادة يشير إلى عطل نظام التبريد.",
      icon: "❄️",
      sev: "med",
      tags: ["تبريد", "حرارة"],
      videoId: "oE3UMLE_iqk",
      steps: [
        "تحقق من مستوى سائل التبريد الخاص بالبطارية",
        "افحص مضخة التبريد",
        "تفقد الخراطيم عن تسريبات",
        "نظف المبرد من الرواسب",
        "أعد تعبئة السائل وامسح الأكواد"
      ]
    }
  ],

  gpl: [
    {
      id: 1,
      name: "تسريب في نظام الغاز",
      desc: "تسريب غاز البروبان خطير جداً ويجب إيقاف السيارة فوراً.",
      icon: "💨",
      sev: "high",
      tags: ["تسريب", "غاز", "GPL"],
      videoId: "N-a7aV2-bFE",
      steps: [
        "أوقف المحرك وابتعد عن أي شرارة",
        "افتح نوافذ السيارة كلها",
        "استخدم كاشف التسريب على جميع الوصلات",
        "استبدل الخرطوم أو الموصل المعطوب",
        "اطلب فحص النظام من متخصص GPL"
      ]
    },
    {
      id: 2,
      name: "عطل صمام التحويل",
      desc: "صمام التحويل بين البنزين والغاز يتوقف عن العمل بسبب تلف المشغّل.",
      icon: "🔀",
      sev: "med",
      tags: ["صمام", "تحويل"],
      videoId: "cTI7BVFHXHA",
      steps: [
        "تحقق من مؤشر التحويل في لوحة القيادة",
        "افحص جهد تشغيل الصمام بالمفيس",
        "نظف الصمام إذا كان مسدوداً",
        "استبدل الصمام عند التلف الكامل",
        "جرب التحويل يدوياً وتأكد من عمله"
      ]
    }
  ]
};

/* ══════════════════════════════════════════
   MAIN FUNCTION
══════════════════════════════════════════ */
function searchProblems() {
  const brand     = document.getElementById('carBrand').value.trim();
  const model     = document.getElementById('carModel').value.trim();
  const engType   = document.getElementById('engineType').value;
  const engSize   = document.getElementById('engineSize').value;
  const year      = document.getElementById('carYear').value;

  if (!brand || !engType || !engSize) {
    shake(document.querySelector('.form-card'));
    highlight(!brand ? 'carBrand' : !engType ? 'engineType' : 'engineSize');
    return;
  }

  // Show results container
  const resultsEl = document.getElementById('results');
  resultsEl.classList.add('visible');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Show loading
  document.getElementById('loading').classList.add('active');
  document.getElementById('resultsContent').style.display = 'none';
  document.getElementById('video-section').classList.remove('visible');

  setTimeout(() => {
    const problems = problemsDB[engType] || [];
    renderResults(brand, model, year, engType, engSize, problems);
  }, 1400);
}

function renderResults(brand, model, year, engType, engSize, problems) {
  document.getElementById('loading').classList.remove('active');
  document.getElementById('resultsContent').style.display = 'block';

  // Title & badge
  const label = brand + (model ? ' ' + model : '') + (year ? ' (' + year + ')' : '');
  document.getElementById('carTitle').textContent = label;

  const engLabels = {
    essence: 'بنزين', diesel: 'ديزل', hybride: 'هجين', electrique: 'كهربائي', gpl: 'غاز'
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

  problems.forEach((p, i) => {
    const sevClass = { high: 'sev-high', med: 'sev-med', low: 'sev-low' }[p.sev];
    const tagClass = { high: 'tag-sev-high', med: 'tag-sev-med', low: 'tag-sev-low' }[p.sev];
    const sevLabel = { high: '🔴 خطورة عالية', med: '🟡 خطورة متوسطة', low: '🟢 خطورة منخفضة' }[p.sev];

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
  document.getElementById('videoSubtitle').textContent = 'شاهد الفيديو واتبع الخطوات أدناه';

  // Embed YouTube
  const frame = document.getElementById('videoFrame');
  frame.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${problem.videoId}?rel=0&modestbranding=1"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>`;

  // Steps
  const stepsSection = document.getElementById('stepsSection');
  const stepsList    = document.getElementById('stepsList');
  stepsList.innerHTML = problem.steps.map((s, i) =>
    `<div class="step-item">
      <div class="step-num">${i + 1}</div>
      <div>${s}</div>
    </div>`
  ).join('');
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
