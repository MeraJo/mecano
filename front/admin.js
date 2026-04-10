const API_BASE = window.location.origin;

const state = {
  cars: [],
  problems: [],
  solutions: [],
  tagSearch: {
    query: '',
    scope: 'all'
  }
};

const els = {
  statusBar: document.getElementById('statusBar'),
  carsTable: document.getElementById('carsTable'),
  problemsTable: document.getElementById('problemsTable'),
  solutionsTable: document.getElementById('solutionsTable'),
  linksTable: document.getElementById('linksTable')
};

function setStatus(message, isError = false) {
  els.statusBar.textContent = message;
  els.statusBar.className = `status-bar ${isError ? 'tag-err' : 'tag-ok'}`;
}

async function syncAdminSessionBadge() {
  const badge = document.getElementById('adminSessionBadge');
  if (!badge) {
    return;
  }

  try {
    const response = await request('/auth/me');
    badge.hidden = false;
    if (!response?.admin) {
      badge.hidden = true;
      window.location.replace('/login.html');
    }
  } catch (_) {
    badge.hidden = true;
    window.location.replace('/login.html');
  }
}

function parseTags(value) {
  if (!value) {
    return [];
  }

  return [...new Set(String(value)
    .split(/[,;\n|]/)
    .map((tag) => tag.trim())
    .filter(Boolean))];
}

function tagsMatch(tags, query) {
  if (!query) {
    return true;
  }

  return parseTags(tags).some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
}

function renderTagList(tags) {
  const values = Array.isArray(tags) ? tags : parseTags(tags);
  if (!values.length) {
    return '<span class="tag-pill secondary">-</span>';
  }

  return `<div class="tag-list">${values.map((tag) => `<span class="tag-pill">${safeText(tag)}</span>`).join('')}</div>`;
}

function truncateText(value, max = 80) {
  const text = String(value ?? '').trim();
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}...`;
}

function getClosestMatchId(items, id) {
  return items.find((item) => Number(item.id) === Number(id));
}

function getSelectedTagQuery() {
  return document.getElementById('tagSearchQuery').value.trim();
}

function getSelectedTagScope() {
  return document.getElementById('tagSearchScope').value;
}

function applyTagFilter() {
  state.tagSearch.query = getSelectedTagQuery();
  state.tagSearch.scope = getSelectedTagScope();
  renderAllTables();
}

function clearTagFilter() {
  document.getElementById('tagSearchQuery').value = '';
  document.getElementById('tagSearchScope').value = 'all';
  state.tagSearch.query = '';
  state.tagSearch.scope = 'all';
  renderAllTables();
}

function selectedClass(kind, id) {
  return `${kind}-${id}`;
}

function showDuplicateSuggestion(err) {
  if (err?.suggestedId) {
    setStatus(`${err.message}. أقرب ID فارغ: ${err.suggestedId}`, true);
    return;
  }

  setStatus(err.message, true);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    const msg = payload?.error || payload?.message || `HTTP ${response.status}`;
    const error = new Error(msg);
    error.status = response.status;
    error.suggestedId = payload?.suggested_id;
    throw error;
  }

  return payload;
}

function getNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function safeText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeDangerLevel(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'low' || normalized === 'high') {
    return normalized;
  }
  return 'medium';
}

function dangerLabel(value) {
  const level = normalizeDangerLevel(value);
  return {
    low: 'منخفض',
    medium: 'متوسط',
    high: 'مرتفع'
  }[level];
}

function renderCars(cars) {
  if (!cars.length) {
    els.carsTable.innerHTML = '<tr><td colspan="7">لا توجد سيارات</td></tr>';
    return;
  }

  els.carsTable.innerHTML = cars.map((car) => `
    <tr class="clickable-row" data-kind="car" data-id="${safeText(car.id)}">
      <td>${safeText(car.id)}</td>
      <td>${safeText(car.brand)}</td>
      <td>${safeText(car.model)}</td>
      <td>${safeText(car.engine_type)}</td>
      <td>${safeText(car.engine_size)}</td>
      <td>${safeText(car.year)}</td>
      <td>${renderTagList(car.tags)}</td>
    </tr>
  `).join('');
}

function renderProblems(problems) {
  if (!problems.length) {
    els.problemsTable.innerHTML = '<tr><td colspan="5">لا توجد أعطال</td></tr>';
    return;
  }

  els.problemsTable.innerHTML = problems.map((problem) => `
    <tr class="clickable-row" data-kind="problem" data-id="${safeText(problem.id)}">
      <td>${safeText(problem.id)}</td>
      <td>${safeText(problem.title)}</td>
      <td>${safeText(problem.description)}</td>
      <td>${safeText(dangerLabel(problem.danger_level))}</td>
      <td>${renderTagList(problem.tags)}</td>
    </tr>
  `).join('');
}

function renderSolutions(solutions) {
  if (!solutions.length) {
    els.solutionsTable.innerHTML = '<tr><td colspan="6">لا توجد حلول لهذه المشكلة</td></tr>';
    return;
  }

  els.solutionsTable.innerHTML = solutions.map((solution) => `
    <tr class="clickable-row" data-kind="solution" data-id="${safeText(solution.id)}">
      <td>${safeText(solution.id)}</td>
      <td>${safeText(solution.problem_id)}</td>
      <td>${safeText(truncateText(solution.solution_title || 'حل', 42))}</td>
      <td>${safeText(truncateText(solution.solution_body || '', 90))}</td>
      <td>${safeText(truncateText(solution.video_url || '', 60))}</td>
      <td>${renderTagList(solution.tags)}</td>
    </tr>
  `).join('');
}

function renderLinks(items) {
  if (!items.length) {
    els.linksTable.innerHTML = '<tr><td colspan="4">لا توجد روابط لهذه السيارة</td></tr>';
    return;
  }

  els.linksTable.innerHTML = items.map((item) => `
    <tr>
      <td>${safeText(item.title)}</td>
      <td>${safeText(item.description)}</td>
      <td>
        ${(item.solutions || []).map((solution) => `
          <div class="solution-block">
            <div class="solution-title">${safeText(solution.title || 'حل')}</div>
            <div class="solution-body">${safeText(solution.body || '')}</div>
          </div>
        `).join('') || '<span class="tag-pill secondary">-</span>'}
      </td>
      <td>${renderTagList(item.tags)}</td>
    </tr>
  `).join('');
}

function filterCars(items) {
  const query = state.tagSearch.query;
  const scope = state.tagSearch.scope;
  if (scope !== 'all' && scope !== 'cars') {
    return [];
  }
  return items.filter((item) => tagsMatch(item.tags, query));
}

function filterProblems(items) {
  const query = state.tagSearch.query;
  const scope = state.tagSearch.scope;
  if (scope !== 'all' && scope !== 'problems') {
    return [];
  }
  return items.filter((item) => tagsMatch(item.tags, query));
}

function filterSolutions(items) {
  const query = state.tagSearch.query;
  const scope = state.tagSearch.scope;
  if (scope !== 'all' && scope !== 'solutions') {
    return [];
  }
  return items.filter((item) => tagsMatch(item.tags, query));
}

function renderAllTables() {
  renderCars(filterCars(state.cars));
  renderProblems(filterProblems(state.problems));
  renderSolutions(filterSolutions(state.solutions));
  wireClickableRows();
}

function wireClickableRows() {
  document.querySelectorAll('tr.clickable-row').forEach((row) => {
    row.addEventListener('click', () => {
      const kind = row.dataset.kind;
      const id = Number(row.dataset.id);
      editItem(kind, id);
    });
  });
}

function editItem(kind, id) {
  const formMap = {
    car: 'carForm',
    problem: 'problemForm',
    solution: 'solutionForm'
  };

  if (kind === 'car') {
    const item = getClosestMatchId(state.cars, id);
    if (!item) return;
    document.getElementById('carId').value = item.id ?? '';
    document.getElementById('carBrand').value = item.brand || '';
    document.getElementById('carModel').value = item.model || '';
    document.getElementById('carEngineType').value = item.engine_type || '';
    document.getElementById('carEngineSize').value = item.engine_size ?? '';
    document.getElementById('carYear').value = item.year ?? '';
    document.getElementById('carTags').value = (item.tags || []).join(', ');
    setStatus(`تم تحميل السيارة رقم ${item.id} للتعديل`);
  }

  if (kind === 'problem') {
    const item = getClosestMatchId(state.problems, id);
    if (!item) return;
    document.getElementById('problemId').value = item.id ?? '';
    document.getElementById('problemTitle').value = item.title || '';
    document.getElementById('problemDescription').value = item.description || '';
    document.getElementById('problemDangerLevel').value = normalizeDangerLevel(item.danger_level);
    document.getElementById('problemTags').value = (item.tags || []).join(', ');
    setStatus(`تم تحميل العطل رقم ${item.id} للتعديل`);
  }

  if (kind === 'solution') {
    const item = getClosestMatchId(state.solutions, id);
    if (!item) return;
    document.getElementById('solutionId').value = item.id ?? '';
    document.getElementById('solutionProblemId').value = item.problem_id ?? '';
    document.getElementById('solutionTitle').value = item.solution_title || '';
    document.getElementById('solutionBody').value = item.solution_body || '';
    document.getElementById('solutionVideoUrl').value = item.video_url || '';
    document.getElementById('solutionTags').value = (item.tags || []).join(', ');
    setStatus(`تم تحميل الحل رقم ${item.id} للتعديل`);
  }

  const formId = formMap[kind];
  if (formId) {
    document.getElementById(formId).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function loadCars() {
  const data = await request('/cars');
  state.cars = data.cars || [];
  renderAllTables();
}

async function loadProblems() {
  const data = await request('/problems');
  state.problems = data || [];
  renderAllTables();
}

async function loadSolutions() {
  const data = await request('/solutions');
  state.solutions = data || [];
  renderAllTables();
}

async function loadLinksByCar() {
  const carId = getNumber(document.getElementById('linkCarId').value);
  if (!carId) {
    throw new Error('أدخل Car ID لعرض الأعطال المرتبطة');
  }
  const data = await request(`/car-problems/${carId}`);
  renderLinks(data || []);
}

document.getElementById('carsLoadBtn').addEventListener('click', async () => {
  try {
    await loadCars();
    setStatus('تم تحميل السيارات');
  } catch (err) {
    setStatus(err.message, true);
  }
});

document.getElementById('problemsLoadBtn').addEventListener('click', async () => {
  try {
    await loadProblems();
    setStatus('تم تحميل الأعطال');
  } catch (err) {
    setStatus(err.message, true);
  }
});

document.getElementById('solutionsLoadBtn').addEventListener('click', async () => {
  try {
    await loadSolutions();
    setStatus('تم تحميل الحلول');
  } catch (err) {
    setStatus(err.message, true);
  }
});

document.getElementById('linksLoadBtn').addEventListener('click', async () => {
  try {
    await loadLinksByCar();
    setStatus('تم تحميل روابط السيارة والأعطال');
  } catch (err) {
    setStatus(err.message, true);
  }
});

document.getElementById('adminLogoutLink').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (_) {
    // Continue redirect even if request fails.
  }
  window.location.replace('/');
});

document.getElementById('tagSearchBtn').addEventListener('click', applyTagFilter);
document.getElementById('tagSearchResetBtn').addEventListener('click', clearTagFilter);
document.getElementById('tagSearchQuery').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    applyTagFilter();
  }
});
document.getElementById('tagSearchScope').addEventListener('change', applyTagFilter);

const carForm = document.getElementById('carForm');
carForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const mode = event.submitter?.dataset?.mode;

  const id = getNumber(document.getElementById('carId').value);
  const payload = {
    id,
    brand: document.getElementById('carBrand').value.trim(),
    model: document.getElementById('carModel').value.trim(),
    engine_type: document.getElementById('carEngineType').value || null,
    engine_size: getNumber(document.getElementById('carEngineSize').value),
    year: getNumber(document.getElementById('carYear').value),
    tags: document.getElementById('carTags').value.trim() || null
  };

  try {
    if (mode === 'create') {
      await request('/cars', { method: 'POST', body: JSON.stringify(payload) });
      setStatus('تم إنشاء سيارة جديدة');
    } else if (mode === 'update') {
      if (!id) {
        throw new Error('أدخل ID السيارة للتحديث');
      }
      await request(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setStatus(`تم تحديث السيارة رقم ${id}`);
    }
    await loadCars();
  } catch (err) {
    showDuplicateSuggestion(err);
  }
});

document.getElementById('carDeleteBtn').addEventListener('click', async () => {
  const id = getNumber(document.getElementById('carId').value);
  if (!id) {
    setStatus('أدخل ID السيارة للحذف', true);
    return;
  }

  try {
    await request(`/cars/${id}`, { method: 'DELETE' });
    setStatus(`تم حذف السيارة رقم ${id}`);
    await loadCars();
  } catch (err) {
    setStatus(err.message, true);
  }
});

const problemForm = document.getElementById('problemForm');
problemForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const mode = event.submitter?.dataset?.mode;

  const id = getNumber(document.getElementById('problemId').value);
  const payload = {
    id,
    title: document.getElementById('problemTitle').value.trim(),
    description: document.getElementById('problemDescription').value.trim() || null,
    danger_level: normalizeDangerLevel(document.getElementById('problemDangerLevel').value),
    tags: document.getElementById('problemTags').value.trim() || null
  };

  try {
    if (mode === 'create') {
      await request('/problems', { method: 'POST', body: JSON.stringify(payload) });
      setStatus('تم إنشاء عطل جديد');
    } else if (mode === 'update') {
      if (!id) {
        throw new Error('أدخل ID العطل للتحديث');
      }
      await request(`/problems/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setStatus(`تم تحديث العطل رقم ${id}`);
    }
    await loadProblems();
  } catch (err) {
    showDuplicateSuggestion(err);
  }
});

document.getElementById('problemDeleteBtn').addEventListener('click', async () => {
  const id = getNumber(document.getElementById('problemId').value);
  if (!id) {
    setStatus('أدخل ID العطل للحذف', true);
    return;
  }

  try {
    await request(`/problems/${id}`, { method: 'DELETE' });
    setStatus(`تم حذف العطل رقم ${id}`);
    await loadProblems();
  } catch (err) {
    setStatus(err.message, true);
  }
});

const solutionForm = document.getElementById('solutionForm');
solutionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const mode = event.submitter?.dataset?.mode;

  const id = getNumber(document.getElementById('solutionId').value);
  const payload = {
    id,
    problem_id: getNumber(document.getElementById('solutionProblemId').value),
    solution_title: document.getElementById('solutionTitle').value.trim(),
    solution_body: document.getElementById('solutionBody').value.trim(),
    video_url: document.getElementById('solutionVideoUrl').value.trim() || null,
    tags: document.getElementById('solutionTags').value.trim() || null
  };

  try {
    if (mode === 'create') {
      if (!payload.problem_id || !payload.solution_title || !payload.solution_body) {
        throw new Error('املأ Problem ID وعنوان الحل ومحتوى الحل');
      }
      await request('/solutions', { method: 'POST', body: JSON.stringify(payload) });
      setStatus('تم إنشاء حل جديد');
    } else if (mode === 'update') {
      if (!id) {
        throw new Error('أدخل ID الحل للتحديث');
      }
      await request(`/solutions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          solution_title: payload.solution_title,
          solution_body: payload.solution_body,
          video_url: payload.video_url,
          tags: payload.tags
        })
      });
      setStatus(`تم تحديث الحل رقم ${id}`);
    }
    await loadSolutions();
  } catch (err) {
    showDuplicateSuggestion(err);
  }
});

document.getElementById('solutionDeleteBtn').addEventListener('click', async () => {
  const id = getNumber(document.getElementById('solutionId').value);
  if (!id) {
    setStatus('أدخل ID الحل للحذف', true);
    return;
  }

  try {
    await request(`/solutions/${id}`, { method: 'DELETE' });
    setStatus(`تم حذف الحل رقم ${id}`);
    await loadSolutions();
  } catch (err) {
    setStatus(err.message, true);
  }
});

const linkForm = document.getElementById('linkForm');
linkForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const carId = getNumber(document.getElementById('linkCarId').value);
  const problemId = getNumber(document.getElementById('linkProblemId').value);

  if (!carId || !problemId) {
    setStatus('أدخل Car ID و Problem ID للربط', true);
    return;
  }

  try {
    await request('/car-problems', {
      method: 'POST',
      body: JSON.stringify({ car_id: carId, problem_id: problemId })
    });
    setStatus('تم ربط السيارة بالعطل بنجاح');
    await loadLinksByCar();
  } catch (err) {
    setStatus(err.message, true);
  }
});

async function boot() {
  await syncAdminSessionBadge();
  try {
    await Promise.all([loadCars(), loadProblems(), loadSolutions()]);
    setStatus('تم تحميل البيانات الأساسية. يمكنك البدء بالإدارة.');
  } catch (err) {
    setStatus(`تعذر التحميل الأولي: ${err.message}`, true);
  }
}

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || 'Unknown request error';
  setStatus(msg, true);
});

boot();
