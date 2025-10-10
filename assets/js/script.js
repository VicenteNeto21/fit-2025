// =======================
// Mobile Menu Toggle com animação suave
// =======================
const menuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => mobileMenu.classList.remove('opacity-0', 'scale-y-0'), 10);
      menuBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
    } else {
      mobileMenu.classList.add('opacity-0', 'scale-y-0');
      setTimeout(() => mobileMenu.classList.add('hidden'), 300);
      menuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
    }
  });

  // Fecha o menu ao clicar em um link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('opacity-0', 'scale-y-0');
      setTimeout(() => mobileMenu.classList.add('hidden'), 300);
      menuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
    });
  });
}

// =======================
// Scroll suave para links internos
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =======================
// Schedule Day Tabs
// =======================
const scheduleDays = document.querySelectorAll('.schedule-day');
const scheduleContents = document.querySelectorAll('.schedule-day-content');

scheduleDays.forEach(day => {
  day.addEventListener('click', function () {
    scheduleDays.forEach(d => d.classList.remove('active'));
    this.classList.add('active');
    scheduleContents.forEach(content => content.classList.add('hidden'));
    const dayId = this.getAttribute('data-day');
    document.getElementById(dayId).classList.remove('hidden');
  });
});

// =======================
// Countdown Timer
// =======================
function updateCountdown() {
  const eventDate = new Date('2025-10-21T09:00:00').getTime();
  const now = new Date().getTime();
  const timeLeft = eventDate - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (timeLeft <= 0) {
    daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  daysEl.textContent = days.toString().padStart(2, '0');
  hoursEl.textContent = hours.toString().padStart(2, '0');
  minutesEl.textContent = minutes.toString().padStart(2, '0');
  secondsEl.textContent = seconds.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =======================
// Fade-in animation on scroll
// =======================
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
};

window.addEventListener('load', fadeInOnScroll);
window.addEventListener('scroll', fadeInOnScroll);

// =======================
// Header scroll effect
// =======================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('shadow-lg');
  } else {
    header.classList.remove('shadow-lg');
  }
});

// =======================
// Carregar e renderizar a programação
// =======================
async function loadSchedule() {
  const scheduleContent = document.getElementById('schedule-content');
  const scheduleDays = document.querySelectorAll('.schedule-day');
  let programacao = [];

  try {
    const res = await fetch('assets/data/programacao.json');
    programacao = await res.json();
  } catch (e) {
    scheduleContent.innerHTML = '<p class="text-center text-red-500">Erro ao carregar a programação.</p>';
    return;
  }

  function render(day) {
    // Filtra por data
    const data = day === 'day1' ? '2025-10-21' : '2025-10-22';
    const eventos = programacao.filter(ev => ev.data === data);

    // Obtém o horário atual para destacar o evento em andamento
    const agora = new Date();
    const hoje = `${agora.getFullYear()}-${(agora.getMonth()+1).toString().padStart(2,'0')}-${agora.getDate().toString().padStart(2,'0')}`;
    const horaAtual = agora.getHours() + agora.getMinutes()/60;

    if (!eventos.length) {
      scheduleContent.innerHTML = `
        <div class="text-center py-20">
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Nenhum evento encontrado para este dia.</h3>
        </div>
      `;
      return;
    }

    scheduleContent.innerHTML = eventos.map(ev => {
      // Verifica se está acontecendo agora
      let acontecendoAgora = '';
      let destaque = '';
      if (ev.data === hoje) {
        const [ini, fim] = ev.horario.split('-').map(h => h.trim());
        const [hIni, mIni] = ini.split(':').map(Number);
        const [hFim, mFim] = fim.split(':').map(Number);
        const iniNum = hIni + (mIni||0)/60;
        const fimNum = hFim + (mFim||0)/60;
        if (horaAtual >= iniNum && horaAtual < fimNum) {
          acontecendoAgora = `
        <span class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#00AFEF]/90 text-white text-xs font-bold animate-pulse shadow">
          <i class="fas fa-bolt"></i> Acontecendo agora
        </span>
      `;
          destaque = 'border-2 border-[#00AFEF] shadow-lg shadow-[#00AFEF]/20';
        }
      }

      // Usa a foto do palestrante se existir, senão mostra ícone padrão (quadrado e ainda maior)
      const fotoPalestrante = ev.foto_palestrante
        ? `<img src="${ev.foto_palestrante}" alt="Foto de ${ev.palestrante}" class="w-32 h-32 object-cover border-2 border-[#00AFEF] shadow-sm rounded-lg">`
        : `<span class="w-32 h-32 flex items-center justify-center rounded-lg bg-gray-200 border-2 border-[#00AFEF] text-[#00AFEF]">
         <i class="fas fa-user text-4xl"></i>
       </span>`;

      return `
        <div class="mb-8">
          <div class="relative bg-white border-l-4 border-[#00AFEF] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${destaque}">
            <div class="flex flex-row items-center justify-between p-6 gap-6">
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <span class="inline-flex items-center gap-2 bg-[#00AFEF]/10 text-[#00AFEF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    <i class="fas fa-clock"></i> ${ev.horario}
                  </span>
                  <span class="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                    <i class="fas fa-map-marker-alt"></i> ${ev.local}
                  </span>
                  ${acontecendoAgora}
                </div>
                <h4 class="text-lg md:text-xl font-bold text-gray-900 mb-1">${ev.nome}</h4>
                <p class="text-gray-700 mb-2 text-sm md:text-base leading-relaxed">${ev.descricao}</p>
                <div class="flex items-center gap-2 mt-2 text-gray-800 text-xs md:text-sm font-semibold">
                  <i class="fas fa-user text-[#00AFEF]"></i> ${ev.palestrante}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Evento dos botões de dia
  scheduleDays.forEach(btn => {
    btn.addEventListener('click', function() {
      scheduleDays.forEach(b => {
        b.classList.remove('bg-[#00AFEF]', 'text-white', 'bg-gray-100', 'text-gray-700');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      this.classList.remove('bg-gray-100', 'text-gray-700');
      this.classList.add('bg-[#00AFEF]', 'text-white');
      render(this.dataset.day);
    });
  });

  // Renderiza o primeiro dia por padrão
  render('day1');
}

document.addEventListener('DOMContentLoaded', loadSchedule);