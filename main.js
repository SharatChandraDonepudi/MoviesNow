// Theme toggle
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

if (toggle) {
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      html.setAttribute('data-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
    }
  });
}

// Ticket price display (only on theatres page)
const ticketInput = document.getElementById('ticketCount');
const priceDisplay = document.getElementById('priceDisplay');
const pricePerTicket = 150;

if (ticketInput && priceDisplay) {
  ticketInput.addEventListener('input', () => {
    const count = parseInt(ticketInput.value || "1", 10);
    priceDisplay.textContent = pricePerTicket * count;
  });
}

// Booking logic (only on theatres page)
const theatreTypeSelect = document.getElementById('theatreType');
const theatreSelect = document.getElementById('theatreSelect');
const timeSelect = document.getElementById('timeSelect');
const movieSelect = document.getElementById('movieSelect');

function filterTheatres() {
  if (!theatreTypeSelect || !theatreSelect) return;
  const type = theatreTypeSelect.value;
  for (const opt of theatreSelect.options) {
    const t = opt.getAttribute('data-type');
    if (!t) {
      opt.hidden = false;
      continue;
    }
    if (type === 'any') {
      opt.hidden = false;
    } else {
      opt.hidden = (t !== type);
    }
  }
  const firstVisible = Array.from(theatreSelect.options).find(o => !o.hidden);
  if (firstVisible) {
    theatreSelect.value = firstVisible.value;
  }
}

function getTheatreType() {
  if (!theatreTypeSelect || !theatreSelect) return 'single';
  const manualType = theatreTypeSelect.value;
  if (manualType !== 'any') return manualType;
  const selectedOpt = theatreSelect.options[theatreSelect.selectedIndex];
  return selectedOpt.getAttribute('data-type') || 'single';
}

function filterTimes() {
  if (!timeSelect) return;
  const type = getTheatreType();
  for (const opt of timeSelect.querySelectorAll('option')) {
    const t = opt.getAttribute('data-type');
    if (!t) continue;
    opt.hidden = (t !== type);
  }
  const firstVisible = Array.from(timeSelect.options).find(o => !o.hidden);
  if (firstVisible) timeSelect.value = firstVisible.value;
}

function filterMovies() {
  if (!movieSelect) return;
  const type = getTheatreType();
  for (const opt of movieSelect.querySelectorAll('option')) {
    const forAttr = opt.getAttribute('data-for') || 'single any';
    opt.hidden = !forAttr.includes(type);
  }
  const firstVisible = Array.from(movieSelect.options).find(o => !o.hidden);
  if (firstVisible) movieSelect.value = firstVisible.value;
}

// Attach listeners only if booking elements exist
if (theatreTypeSelect && theatreSelect && timeSelect && movieSelect) {
  theatreTypeSelect.addEventListener('change', () => {
    filterTheatres();
    filterTimes();
    filterMovies();
  });

  theatreSelect.addEventListener('change', () => {
    filterTimes();
    filterMovies();
  });

  // initial setup
  filterTheatres();
  filterTimes();
  filterMovies();
}
