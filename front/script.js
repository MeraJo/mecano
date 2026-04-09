
/* Frontend results now come from the backend /search endpoint. */

let availableCars = [];

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

function applyCarFilters() {
  const selectedBrand = document.getElementById('carBrand').value;
  const selectedModel = document.getElementById('carModel').value;
  const selectedType = document.getElementById('engineType').value;
  const selectedSize = document.getElementById('engineSize').value;

  const byBrand = selectedBrand ? availableCars.filter(c => c.brand === selectedBrand) : availableCars;
  fillSelect('carModel', uniqueValues(byBrand, 'model').sort(), '-- اختر الموديل --');

  const byModel = selectedModel ? byBrand.filter(c => c.model === selectedModel) : byBrand;
  fillSelect('engineType', uniqueValues(byModel, 'engine_type').sort(), '-- اختر نوع المحرك --');

  const byType = selectedType ? byModel.filter(c => c.engine_type === selectedType) : byModel;
  const sizes = uniqueValues(byType, 'engine_size').sort((a, b) => Number(a) - Number(b));
  fillSelect('engineSize', sizes, '-- اختر السعة --', (v) => `${v} L`);

  const bySize = selectedSize ? byType.filter(c => String(c.engine_size) === selectedSize) : byType;
  const years = uniqueValues(bySize, 'year').sort((a, b) => Number(b) - Number(a));
  fillSelect('carYear', years, '-- كل السنوات --');
}

async function initCarDropdowns() {
  try {
    const response = await fetch('/cars');
    if (!response.ok) {
      throw new Error('تعذر تحميل قائمة السيارات');
    }

    const data = await response.json();
    availableCars = data.cars || [];

    fillSelect('carBrand', uniqueValues(availableCars, 'brand').sort(), '-- اختر الماركة --');
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
      throw new Error(response.status === 404 ? 'لا توجد نتائج مطابقة' : 'فشل الاتصال بالخادم');
    }

    const data = await response.json();
    const problems = data.map((item, idx) => ({
      id: idx + 1,
      name: item.title || `مشكلة ${idx + 1}`,
      desc: item.description || '',
      icon: '🔧',
      sev: 'med',
      tags: item.tags || ['من قاعدة البيانات'],
      videoId: extractYoutubeId(item.video_url),
      solutionText: item.solution_text || 'لا يوجد نص حل مسجل حالياً'
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

  if (!problems.length) {
    list.innerHTML = '<div class="problem-card"><div class="problem-info"><div class="problem-name">لا توجد مشاكل مطابقة</div><div class="problem-desc">جرّب تغيير بيانات البحث أو أضف بيانات من لوحة الإدارة.</div></div></div>';
    return;
  }

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
  if (problem.videoId) {
    frame.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${problem.videoId}?rel=0&modestbranding=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
  } else {
    frame.innerHTML = `<div class="video-placeholder"><div class="ph-icon">📚</div><p>لا يوجد فيديو لهذا العطل حالياً</p></div>`;
  }

  // Solution text
  const stepsSection = document.getElementById('stepsSection');
  const stepsList    = document.getElementById('stepsList');
  const heading = stepsSection.querySelector('h4');
  if (heading) {
    heading.textContent = '📝 نص الحل';
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

initCarDropdowns();
