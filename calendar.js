document.addEventListener("DOMContentLoaded", function () {
  const calendarDays = document.getElementById("calendarDays");
  const monthAndYear = document.getElementById("monthAndYear");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const eventModal = document.getElementById("eventModal");
  const closeModal = document.querySelector(".close");
  const addEventBtn = document.getElementById("addEventBtn");
  const deleteEventBtn = document.getElementById("deleteEventBtn");
  const eventInput = document.getElementById("eventInput");

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let selectedDate;
  let events = JSON.parse(localStorage.getItem("events")) || {};

  function renderCalendar(month, year) {
    calendarDays.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();

    monthAndYear.textContent = `${new Date(year, month).toLocaleString("default", {
      month: "long",
    })} ${year}`;

    for (let i = firstDay; i > 0; i--) {
      const day = document.createElement("div");
      day.classList.add("prev-month-day");
      day.textContent = prevDaysInMonth - i + 1;
      calendarDays.appendChild(day);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.classList.add("current-month-day");
      day.textContent = i;
      day.addEventListener("click", () => openModal(new Date(year, month, i)));
      if (events[`${year}-${month}-${i}`]) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.textContent = events[`${year}-${month}-${i}`];
        day.appendChild(eventDiv);
      }
      calendarDays.appendChild(day);
    }
  }

  function openModal(date) {
    selectedDate = date;
    eventModal.style.display = "block";
    eventInput.value = events[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] || "";
  }

  function closeModalHandler() {
    eventModal.style.display = "none";
  }

  function addEvent() {
    const eventText = eventInput.value.trim();
    if (eventText) {
      events[`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`] = eventText;
      localStorage.setItem("events", JSON.stringify(events));
      renderCalendar(currentMonth, currentYear);
      closeModalHandler();
    }
  }

  function deleteEvent() {
    delete events[`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`];
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar(currentMonth, currentYear);
    closeModalHandler();
  }

  prevBtn.addEventListener("click", () => {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
  });

  closeModal.addEventListener("click", closeModalHandler);
  addEventBtn.addEventListener("click", addEvent);
  deleteEventBtn.addEventListener("click", deleteEvent);
  window.addEventListener("click", (event) => {
    if (event.target === eventModal) {
      closeModalHandler();
    }
  });

  renderCalendar(currentMonth, currentYear);
});
