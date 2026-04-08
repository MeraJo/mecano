const API_BASE = window.location.origin;

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

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
    throw new Error(msg);
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

function renderCars(cars) {
  if (!cars.length) {
    els.carsTable.innerHTML = '<tr><td colspan="6">لا توجد سيارات</td></tr>';
    return;
  }

  els.carsTable.innerHTML = cars.map((car) => `
    <tr>
      <td>${safeText(car.id)}</td>
      <td>${safeText(car.brand)}</td>
      <td>${safeText(car.model)}</td>
      <td>${safeText(car.engine_type)}</td>
      <td>${safeText(car.engine_size)}</td>
      <td>${safeText(car.year)}</td>
    </tr>
  `).join('');
}

function renderProblems(problems) {
  if (!problems.length) {
    els.problemsTable.innerHTML = '<tr><td colspan="3">لا توجد أعطال</td></tr>';
    return;
  }

  els.problemsTable.innerHTML = problems.map((problem) => `
    <tr>
      <td>${safeText(problem.id)}</td>
      <td>${safeText(problem.title)}</td>
      <td>${safeText(problem.description)}</td>
    </tr>
  `).join('');
}

function renderSolutions(solutions) {
  if (!solutions.length) {
    els.solutionsTable.innerHTML = '<tr><td colspan="3">لا توجد حلول لهذه المشكلة</td></tr>';
    return;
  }

  els.solutionsTable.innerHTML = solutions.map((solution) => `
    <tr>
      <td>${safeText(solution.id)}</td>
      <td>${safeText(solution.problem_id)}</td>
      <td>${safeText(solution.solution_text)}</td>
    </tr>
  `).join('');
}

function renderLinks(items) {
  if (!items.length) {
    els.linksTable.innerHTML = '<tr><td colspan="3">لا توجد روابط لهذه السيارة</td></tr>';
    return;
  }

  els.linksTable.innerHTML = items.map((item) => `
    <tr>
      <td>${safeText(item.title)}</td>
      <td>${safeText(item.description)}</td>
      <td>${safeText((item.solutions || []).join(' | '))}</td>
    </tr>
  `).join('');
}

async function loadCars() {
  const data = await request('/cars');
  renderCars(data.cars || []);
}

async function loadProblems() {
  const data = await request('/problems');
  renderProblems(data || []);
}

async function loadSolutionsByProblem() {
  const problemId = getNumber(document.getElementById('solutionProblemId').value);
  if (!problemId) {
    throw new Error('أدخل Problem ID لعرض الحلول');
  }
  const data = await request(`/solutions/${problemId}`);
  renderSolutions(data || []);
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
    await loadSolutionsByProblem();
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

const carForm = document.getElementById('carForm');
carForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const mode = event.submitter?.dataset?.mode;

  const id = getNumber(document.getElementById('carId').value);
  const payload = {
    brand: document.getElementById('carBrand').value.trim(),
    model: document.getElementById('carModel').value.trim(),
    engine_type: document.getElementById('carEngineType').value.trim() || null,
    engine_size: getNumber(document.getElementById('carEngineSize').value),
    year: getNumber(document.getElementById('carYear').value)
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
    setStatus(err.message, true);
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
    title: document.getElementById('problemTitle').value.trim(),
    description: document.getElementById('problemDescription').value.trim() || null
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
    setStatus(err.message, true);
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
    problem_id: getNumber(document.getElementById('solutionProblemId').value),
    solution_text: document.getElementById('solutionText').value.trim()
  };

  try {
    if (mode === 'create') {
      if (!payload.problem_id || !payload.solution_text) {
        throw new Error('املأ Problem ID ونص الحل');
      }
      await request('/solutions', { method: 'POST', body: JSON.stringify(payload) });
      setStatus('تم إنشاء حل جديد');
    } else if (mode === 'update') {
      if (!id) {
        throw new Error('أدخل ID الحل للتحديث');
      }
      await request(`/solutions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ solution_text: payload.solution_text })
      });
      setStatus(`تم تحديث الحل رقم ${id}`);
    }
    await loadSolutionsByProblem();
  } catch (err) {
    setStatus(err.message, true);
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
    await loadSolutionsByProblem();
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
  try {
    await Promise.all([loadCars(), loadProblems()]);
    setStatus('تم تحميل البيانات الأساسية. يمكنك البدء بالإدارة.');
  } catch (err) {
    setStatus(`تعذر التحميل الأولي: ${err.message}`, true);
  }
}

boot();
