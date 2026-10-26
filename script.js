(() => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const toast = $('#toast');
  let toastTimer;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // NAVIGATION

  $$('[data-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      const target = $(button.dataset.scroll);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const menuToggle = $('.menu-toggle');

  menuToggle.addEventListener('click', () => {
    const nav = $('.nav-links');
    const open = nav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });

  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      $('.nav-links').classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });

  // TRAVEL DATES

  const today = new Date();

  const dateString = date =>
    `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);

  $('#startDate').min = dateString(today);
  $('#startDate').value = dateString(tomorrow);

  $('#endDate').min = dateString(tomorrow);
  $('#endDate').value = dateString(nextWeek);

  $('#startDate').addEventListener('change', () => {
    $('#endDate').min = $('#startDate').value;

    if ($('#endDate').value < $('#startDate').value) {
      $('#endDate').value = $('#startDate').value;
    }
  });

  // NUMBER OF TRAVELLERS

  let guests = 2;

  const guestCount = $('#guestCount');

  $('#guestMinus').addEventListener('click', () => {
    guests = Math.max(1, guests - 1);
    guestCount.textContent = guests;
    persist();
  });

  $('#guestPlus').addEventListener('click', () => {
    guests = Math.min(20, guests + 1);
    guestCount.textContent = guests;
    persist();
  });

  // MR. PASS PERSONALITY

  const mascotSpeech = $('#mascotSpeech');

  const mascotTips = [
    'A rough plan is better than 37 open tabs. Let’s do this.',
    'Pack half the stuff. Bring twice the snacks.',
    'Book the big things. Leave space for happy accidents.',
    'Important reminder: your passport is not a coaster. I AM THE PASSPORT.'
  ];

  let tipIndex = 0;

  setInterval(() => {
    tipIndex = (tipIndex + 1) % mascotTips.length;

    $('#plannerTip').textContent = mascotTips[tipIndex];
  }, 7000);

  // SAVE DATA IN THIS BROWSER

  const STORAGE_KEY = 'passportPleaseTripV1';

  function readSaved() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '{}'
      );
    } catch {
      return {};
    }
  }

  const saved = readSaved();

  if (saved.notes) {
    $('#notes').value = saved.notes;
  }

  if (saved.destination) {
    $('#destination').value = saved.destination;
  }

  if (saved.startDate) {
    $('#startDate').value = saved.startDate;
  }

  if (saved.endDate) {
    $('#endDate').value = saved.endDate;
  }

  if (saved.budget) {
    $('#budget').value = saved.budget;
  }

  if (saved.travelStyle) {
    $('#travelStyle').value = saved.travelStyle;
  }

  if (saved.guests) {
    guests = saved.guests;
    guestCount.textContent = guests;
  }

  if (Array.isArray(saved.checked)) {
    $$('.check-item input').forEach((box, index) => {
      box.checked = !!saved.checked[index];
    });
  }

  // INITIAL ITINERARY

  const schedule = Array.isArray(saved.schedule)
    ? saved.schedule
    : [
        {
          day: 1,
          time: '09:00',
          title: 'Find a local breakfast spot',
          detail: 'Coffee, something flaky, no rushing.',
          icon: '☕',
          vibe: 'Slow start',
          color: '#f1d39a'
        },
        {
          day: 1,
          time: '11:00',
          title: 'Explore the old town',
          detail: 'Wander around and follow the interesting streets.',
          icon: '⌖',
          vibe: 'Curious mode',
          color: '#b9d9ca'
        },
        {
          day: 1,
          time: '14:00',
          title: 'Lunch & people-watching',
          detail: 'Try something you cannot pronounce yet.',
          icon: '♨',
          vibe: 'Food mission',
          color: '#edc6b1'
        },
        {
          day: 1,
          time: '17:30',
          title: 'Golden-hour viewpoint',
          detail: 'Bring water. Take approximately 400 photos.',
          icon: '☼',
          vibe: 'Main character',
          color: '#d7c9e9'
        },
        {
          day: 2,
          time: '09:30',
          title: 'Museum or landmark visit',
          detail: 'Tickets ready, comfy shoes on.',
          icon: '▧',
          vibe: 'Culture fix',
          color: '#b9d9ca'
        },
        {
          day: 2,
          time: '12:30',
          title: 'Street-food treasure hunt',
          detail: 'Split a few things so you can try more.',
          icon: '✳',
          vibe: 'Snack attack',
          color: '#edc6b1'
        },
        {
          day: 2,
          time: '16:00',
          title: 'Free time / happy accident',
          detail: 'No plan. That is the plan.',
          icon: '✦',
          vibe: 'Go with it',
          color: '#d7c9e9'
        },
        {
          day: 3,
          time: '10:00',
          title: 'Souvenir mission',
          detail: 'Buy local, pack light.',
          icon: '♡',
          vibe: 'Little treasure',
          color: '#f1d39a'
        },
        {
          day: 3,
          time: '13:00',
          title: 'Last lunch, no regrets',
          detail: 'One final favourite meal before heading back.',
          icon: '♨',
          vibe: 'One more bite',
          color: '#edc6b1'
        }
      ];

  function persist() {
    const data = {
      destination: $('#destination').value,
      startDate: $('#startDate').value,
      endDate: $('#endDate').value,
      budget: $('#budget').value,
      travelStyle: $('#travelStyle').value,
      guests,
      notes: $('#notes').value,
      checked: $$('.check-item input').map(box => box.checked),
      schedule
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn('Could not save trip data:', error);
    }
  }

  // ESCAPE USER TEXT BEFORE PUTTING IT IN HTML

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  // CREATE THE TRIP

  $('#tripForm').addEventListener('submit', event => {
    event.preventDefault();

    if (!$('#tripForm').reportValidity()) {
      return;
    }

    if ($('#endDate').value < $('#startDate').value) {
      notify('Your return date must be on or after departure.');
      return;
    }

    persist();

    const destination = $('#destination').value.trim();

    mascotSpeech.innerHTML =
      `OHHH, ${escapeHtml(destination.toUpperCase())}!<br>` +
      'MY LITTLE PASSPORT HEART!';

    const mascot = $('#heroMascot');

    mascot.classList.remove('is-excited');

    void mascot.offsetWidth;

    mascot.classList.add('is-excited');

    $('#scheduleQuote').textContent =
      `“${destination}?! I have always wanted to stamp around there.”`;

    notify(`Trip saved! Mr. Pass is READY for ${destination}!`);

    $('#schedule').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  // NOTES

  $('#saveNotes').addEventListener('click', () => {
    persist();

    $('#notesStatus').textContent =
      'Saved just now — your notes live in this browser.';

    notify('Notes saved. Very organised of you.');
  });

  // CHECKLIST

  function updateChecklist() {
    const boxes = $$('.check-item input');

    const count = boxes.filter(box => box.checked).length;

    $('#checkProgress').textContent =
      `${count} / ${boxes.length}`;

    persist();
  }

  $$('.check-item input').forEach(box => {
    box.addEventListener('change', updateChecklist);
  });

  // GOOGLE MAPS SHORTCUT

  $('#mapsButton').addEventListener('click', () => {
    const destination = $('#destination').value.trim();

    const query = destination || 'travel destination';

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      '_blank',
      'noopener,noreferrer'
    );
  });

  // ITINERARY DISPLAY

  let activeDay = 1;

  const scheduleList = $('#scheduleList');

  function renderSchedule() {
    const items = schedule
      .filter(item => Number(item.day) === activeDay)
      .sort((a, b) => a.time.localeCompare(b.time));

    scheduleList.innerHTML = '';

    if (!items.length) {
      scheduleList.innerHTML = `
        <div class="schedule-row">
          <span class="stop-time">ANYTIME</span>
          <div class="stop-main">
            <span class="stop-icon">✦</span>
            <div>
              <div class="stop-title">A beautiful blank space</div>
              <div class="stop-detail">
                Add a stop when inspiration strikes.
              </div>
            </div>
          </div>
          <span class="stop-vibe">✳ Open itinerary</span>
        </div>
      `;
    }

    items.forEach((item, index) => {
      const row = document.createElement('div');

      row.className = 'schedule-row';
      row.style.animationDelay = `${index * 45}ms`;

      row.innerHTML = `
        <div class="stop-time">
          ${escapeHtml(item.time)}
        </div>

        <div class="stop-main">
          <span class="stop-icon"
            style="--stop-color:${escapeHtml(item.color || '#d7e8dc')}">
            ${escapeHtml(item.icon || '✦')}
          </span>

          <div>
            <div class="stop-title">
              ${escapeHtml(item.title)}
            </div>
            <div class="stop-detail">
              ${escapeHtml(item.detail || '')}
            </div>
          </div>

          <button class="remove-stop"
            aria-label="Remove ${escapeHtml(item.title)}"
            title="Remove stop">×</button>
        </div>

        <div class="stop-vibe">
          <span class="vibe-dot"></span>
          ${escapeHtml(item.vibe || 'Your own pace')}
        </div>
      `;

      $('.remove-stop', row).addEventListener('click', () => {
        const index = schedule.indexOf(item);

        if (index > -1) {
          schedule.splice(index, 1);
        }

        renderSchedule();
        persist();

        notify('Stop removed. Room for a plot twist!');
      });

      scheduleList.appendChild(row);
    });

    persist();
  }

  // SWITCH DAYS

  $$('.day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeDay = Number(tab.dataset.day);

      $$('.day-tab').forEach(other => {
        other.classList.toggle('active', other === tab);
      });

      renderSchedule();

      const quotes = [
        '“If we’re late, we’re making an entrance.”',
        '“A snack break is a cultural experience.”',
        '“The best souvenir is a story. Second best: a tiny spoon.”'
      ];

      $('#scheduleQuote').textContent = quotes[activeDay - 1];
    });
  });

  // ADD A STOP

  $('#addStop').addEventListener('click', () => {
    const title = prompt('What is the next stop?');

    if (!title || !title.trim()) {
      return;
    }

    const time = prompt(
      'What time? Use 24-hour format, e.g. 15:30',
      '15:00'
    );

    if (time === null) {
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim())) {
      notify('Please use a time like 09:30 or 15:00.');
      return;
    }

    const detail =
      prompt('Any little notes for this stop?', 'Explore and enjoy.')
      ?? '';

    schedule.push({
      day: activeDay,
      time: time.trim(),
      title: title.trim(),
      detail: detail.trim(),
      icon: '✦',
      vibe: 'New adventure',
      color: '#d7c9e9'
    });

    renderSchedule();

    notify('Stop added to the itinerary!');
  });

  // EXPORT TRIP AS JSON

  $('#exportTrip').addEventListener('click', () => {
    const trip = {
      title: `Passport Please! — ${
        $('#destination').value.trim() || 'My trip'
      }`,
      destination: $('#destination').value,
      departure: $('#startDate').value,
      return: $('#endDate').value,
      budget: $('#budget').value,
      vibe: $('#travelStyle').value,
      travellers: guests,
      notes: $('#notes').value,

      checklist: $$('.check-item').map(item => ({
        task: item.textContent.trim(),
        done: $('input', item).checked
      })),

      itinerary: schedule
        .slice()
        .sort((a, b) =>
          a.day - b.day || a.time.localeCompare(b.time)
        )
    };

    const blob = new Blob(
      [JSON.stringify(trip, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'my-travel-itinerary.json';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    notify('Itinerary exported as a JSON file!');
  });

  // MASCOT PARALLAX

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroArt = $('.hero-art');

    heroArt.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;

      const rect = heroArt.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      $('#heroMascot').style.translate =
        `${x * 10}px ${y * 8}px`;
    });

    heroArt.addEventListener('pointerleave', () => {
      $('#heroMascot').style.translate = '';
    });
  }

  // CLICK MR. PASS FOR A RANDOM REACTION

  $$('.mascot').forEach(mascot => {
    mascot.addEventListener('click', () => {
      mascot.classList.remove('is-excited');

      void mascot.offsetWidth;

      mascot.classList.add('is-excited');

      const messages = [
        'STAMP OF APPROVAL!',
        'I HAVE NO IDEA WHERE I AM. LOVE IT.',
        'DID SOMEONE SAY SNACK BREAK?',
        'I AM A VERY IMPORTANT DOCUMENT.'
      ];

      mascotSpeech.textContent =
        messages[Math.floor(Math.random() * messages.length)];
    });
  });

  // INITIALISE THE PAGE

  renderSchedule();
  updateChecklist();
})();
