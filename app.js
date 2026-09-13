const files = [
  'Soal_UAS_10_AKL_Duplikat.json',
  'Soal_UAS_10_BDP_Duplikat.json',
  'Soal_UAS_10_RPL_Duplikat.json',
  'Soal_UAS_11_RPL_Duplikat.json',
  'Soal_UAS_12_RPL_Duplikat.json'
];

const state = { packages: [], active: null, index: 0, answers: [], review: false };
const $ = (id) => document.getElementById(id);
const views = ['home-view', 'quiz-view', 'summary-view'];

const escapeHTML = (str) => String(str).replace(/[&<>'"]/g, (tag) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag]));

async function loadPackages() {
  $('package-list').innerHTML = '<p>Memuat paket soal…</p>';
  try {
    state.packages = await Promise.all(files.map(async (file) => {
      const response = await fetch(`bank-soal/${file}`);
      if (!response.ok) throw new Error(`Gagal memuat ${file}`);
      return { ...await response.json(), file };
    }));
    renderPackages();
  } catch (error) {
    $('package-list').innerHTML = '<p>Bank soal belum bisa dimuat. Jalankan website melalui server lokal.</p><button id="retry-button" class="btn-secondary" style="width:100%;margin-top:16px;">Coba lagi</button>';
    document.getElementById('retry-button').addEventListener('click', loadPackages);
  }
}

function renderPackages() {
  $('package-list').innerHTML = state.packages.map((item, index) => {
    const title = item.file.includes('10_AKL') || item.file.includes('10_BDP')
      ? 'MPP'
      : item.file.includes('10_RPL')
        ? 'Konsentrasi Keahlian'
        : item.mata_pelajaran;

    return `
      <button class="pkg-card" type="button" data-package="${index}">
        <div class="pkg-card-inner">
          <div class="pkg-header">
            <span class="pkg-tag">${escapeHTML(item.kelas)}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <h3 class="pkg-title">${escapeHTML(title)}</h3>
          <div class="pkg-meta">
            <span class="pkg-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${item.soal.length} Soal</span>
          </div>
        </div>
      </button>`;
  }).join('');
  document.querySelectorAll('[data-package]').forEach((button) => button.addEventListener('click', () => startQuiz(Number(button.dataset.package))));
}

function showView(id) {
  views.forEach((view) => $(view).classList.toggle('hidden', view !== id));
  window.scrollTo(0, 0);
}

function startQuiz(packageIndex, review = false) {
  state.active = state.packages[packageIndex];
  state.index = 0;
  state.review = review;
  state.answers = JSON.parse(localStorage.getItem(`ruang-soal:${state.active.file}`) || '[]');
  showView('quiz-view');
  renderQuestion();
}

function renderQuestion() {
  const item = state.active.soal[state.index];
  $('question-index').textContent = `Soal ${item.nomor} / ${state.active.soal.length}`;
  $('progress-fill').style.transform = `scaleX(${(state.index + 1) / state.active.soal.length})`;

  const qText = item.pertanyaan;
  const splitIndex = qText.indexOf('\n');
  if (splitIndex !== -1) {
    $('question-text').innerHTML = escapeHTML(qText.substring(0, splitIndex)) + `<div class="code-block">${escapeHTML(qText.substring(splitIndex + 1))}</div>`;
  } else {
    $('question-text').innerHTML = escapeHTML(qText);
  }

  $('options-list').innerHTML = item.opsi.map((option) => `
    <label class="opt-card">
      <input type="radio" name="answer" value="${escapeHTML(option.label)}" ${state.answers[state.index] === option.label ? 'checked' : ''} ${state.review ? 'disabled' : ''}>
      <div class="opt-box">${escapeHTML(option.label)}</div>
      <div class="opt-text">${escapeHTML(option.teks)}</div>
    </label>`).join('');

  document.querySelectorAll('input[name="answer"]').forEach((input) =>
    input.addEventListener('change', () => {
      state.answers[state.index] = input.value;
      localStorage.setItem(`ruang-soal:${state.active.file}`, JSON.stringify(state.answers));
    })
  );
  
  $('previous-button').disabled = state.index === 0;
  $('next-button').textContent = state.index === state.active.soal.length - 1 ? 'Selesai' : 'Berikutnya';
}

function finishQuiz() {
  $('summary-title').textContent = state.active.mata_pelajaran;
  $('summary-answered').textContent = `${state.answers.filter(Boolean).length} / ${state.active.soal.length}`;
  showView('summary-view');
}

$('back-home').addEventListener('click', () => showView('home-view'));
$('previous-button').addEventListener('click', () => { if (state.index > 0) { state.index--; renderQuestion(); window.scrollTo(0, 0); } });
$('next-button').addEventListener('click', () => { if (state.index < state.active.soal.length - 1) { state.index++; renderQuestion(); window.scrollTo(0, 0); } else finishQuiz(); });
$('restart-button').addEventListener('click', () => { localStorage.removeItem(`ruang-soal:${state.active.file}`); startQuiz(state.packages.indexOf(state.active)); });
$('review-button').addEventListener('click', () => startQuiz(state.packages.indexOf(state.active), true));

loadPackages();