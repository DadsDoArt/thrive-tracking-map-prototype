const stops = [
  {
    id: "clearing",
    title: "Capacity Clearing",
    type: "Orientation",
    summary: "Begin by naming what is using energy, without forcing a fix.",
    micro: "Write one sentence: “Today, the quiet drain might be…”",
    image: "pdf_thumbs/ebook.png",
    icon: "☁",
    x: 50,
    y: 84,
    color: "#efd4c1",
    time: "2-5 min"
  },
  {
    id: "noticing",
    title: "Noticing",
    type: "Observe without fixing",
    summary: "Recognize early drains and preserve nervous system capacity.",
    micro: "Tick one early signal: tension, rapid thoughts, numbness, push-through, or withdrawal.",
    image: "pdf_thumbs/noticing.png",
    icon: "◇",
    x: 25,
    y: 72,
    color: "#eadfbd",
    time: "5-10 min"
  },
  {
    id: "deciding",
    title: "Deciding",
    type: "Choose gentle action",
    summary: "Pick a response before regulation collapses.",
    micro: "Choose the smallest tool that fits: grounding, naming the feeling, or reducing stimulation.",
    image: "pdf_thumbs/deciding.png",
    icon: "↗",
    x: 75,
    y: 72,
    color: "#dfe9df",
    time: "10-20 min"
  },
  {
    id: "neurotype",
    title: "Neurotype Grove",
    type: "ADHD, HSP, dyslexia",
    summary: "See how different capacity patterns drain and restore differently.",
    micro: "Notice which phrase fits today: forced attention, sensory stacking, or rushed integration.",
    image: "pdf_thumbs/neurotype.png",
    icon: "✺",
    x: 31,
    y: 43,
    color: "#f0deb2",
    time: "8-15 min"
  },
  {
    id: "cards",
    title: "Capacity Cards",
    type: "Daily regulation prompts",
    summary: "Use one prompt to interrupt pressure before it becomes collapse.",
    micro: "Ask: “Am I trying to regulate with an empty system?” Then lower the demand by one notch.",
    image: "pdf_thumbs/cards.png",
    icon: "▣",
    x: 69,
    y: 43,
    color: "#e8d7d8",
    time: "1-3 min"
  },
  {
    id: "integrating",
    title: "Living System",
    type: "Integrating",
    summary: "Turn what works into a flexible protocol you can return to.",
    micro: "Complete this: “When I notice __, I will __. If that does not help, my next step is __.”",
    image: "pdf_thumbs/integrating.png",
    icon: "⌂",
    x: 50,
    y: 20,
    color: "#cfe6dc",
    time: "15-30 min"
  }
];

const advice = {
  low: "Take a tiny stop: Capacity Cards or Noticing. The win is returning, not finishing.",
  steady: "Start with a short check-in, then choose any unlocked-looking place. Nothing is mandatory.",
  reflective: "Try Integrating or Neurotype Grove. You have enough room for pattern-spotting today.",
  overloaded: "Go to Capacity Cards. One interruption prompt is enough; no lesson completion needed."
};

const scenarioCopy = {
  living:
    "This version behaves like a tiny app: it remembers the last stop, marks visits, and adapts the next step to capacity.",
  showpiece:
    "This version would be more cinematic for Silvia: a polished clickable tour, founder notes, and a sharper visual story before deeper build decisions."
};

const storeKey = "thrive-course-map-prototype";
const defaultState = {
  current: "clearing",
  visited: [],
  later: [],
  capacity: "steady",
  scenario: "living"
};

let state = loadState();
let previousStopId = state.current;
let movementTimer;

const mapNodes = document.querySelector("#mapNodes");
const avatar = document.querySelector("#avatar");
const resumeText = document.querySelector("#resumeText");
const lessonType = document.querySelector("#lessonType");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonSummary = document.querySelector("#lessonSummary");
const microStep = document.querySelector("#microStep");
const sourceImage = document.querySelector("#sourceImage");
const capacityAdvice = document.querySelector("#capacityAdvice");
const capacityOptions = document.querySelector("#capacityOptions");
const scenarioButtons = document.querySelectorAll("[data-scenario]");
const scenarioCopyEl = document.querySelector("#scenarioCopy");
const visitBtn = document.querySelector("#visitBtn");
const enoughBtn = document.querySelector("#enoughBtn");
const saveLaterBtn = document.querySelector("#saveLaterBtn");
const resetBtn = document.querySelector("#resetBtn");

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(storeKey)) };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function currentStop() {
  return stops.find((stop) => stop.id === state.current) || stops[0];
}

function renderMap() {
  mapNodes.innerHTML = "";
  stops.forEach((stop) => {
    const node = document.createElement("button");
    node.className = "map-node";
    node.style.setProperty("--x", stop.x);
    node.style.setProperty("--y", stop.y);
    node.style.setProperty("--node-color", stop.color);
    node.dataset.stop = stop.id;
    if (state.current === stop.id) node.classList.add("current");
    if (state.visited.includes(stop.id)) node.classList.add("visited");
    if (state.later.includes(stop.id)) node.classList.add("later");
    node.innerHTML = `
      <span class="node-icon">${stop.icon}</span>
      <span class="node-title">${stop.title}</span>
      <span class="node-time">${stop.time}</span>
    `;
    node.addEventListener("click", () => selectStop(stop.id));
    mapNodes.appendChild(node);
  });
}

function renderLesson() {
  const stop = currentStop();
  const previous = stops.find((item) => item.id === previousStopId) || stop;
  const isClimb = previous.id !== stop.id && previous.y - stop.y > 18;
  lessonType.textContent = stop.type;
  lessonTitle.textContent = stop.title;
  lessonSummary.textContent = stop.summary;
  microStep.textContent = stop.micro;
  sourceImage.src = stop.image;
  sourceImage.alt = `Preview of ${stop.title} resource`;
  resumeText.textContent = `Saved at ${stop.title}`;
  capacityAdvice.textContent = advice[state.capacity];
  scenarioCopyEl.textContent = scenarioCopy[state.scenario];
  document.querySelectorAll("[data-capacity]").forEach((button) => {
    button.classList.toggle("active", button.dataset.capacity === state.capacity);
  });
  scenarioButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === state.scenario);
  });
  avatar.classList.remove("is-moving", "is-climbing");
  if (previous.id !== stop.id) {
    avatar.classList.add(isClimb ? "is-climbing" : "is-moving");
    clearTimeout(movementTimer);
    movementTimer = setTimeout(() => {
      avatar.classList.remove("is-moving", "is-climbing");
    }, isClimb ? 1900 : 1250);
  }
  requestAnimationFrame(() => {
    avatar.style.left = `${stop.x}%`;
    avatar.style.top = `${stop.y}%`;
  });
  previousStopId = stop.id;
}

function selectStop(id) {
  state.current = id;
  saveState();
  render();
}

function toggleList(listName, id, forceOn = false) {
  const list = new Set(state[listName]);
  if (forceOn || !list.has(id)) {
    list.add(id);
  } else {
    list.delete(id);
  }
  state[listName] = [...list];
}

function render() {
  renderMap();
  renderLesson();
}

capacityOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-capacity]");
  if (!button) return;
  state.capacity = button.dataset.capacity;
  if (state.capacity === "low" || state.capacity === "overloaded") {
    state.current = state.capacity === "low" ? "noticing" : "cards";
  }
  saveState();
  render();
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.scenario = button.dataset.scenario;
    saveState();
    render();
  });
});

visitBtn.addEventListener("click", () => {
  toggleList("visited", state.current, true);
  saveState();
  render();
});

enoughBtn.addEventListener("click", () => {
  toggleList("visited", state.current, true);
  const currentIndex = stops.findIndex((stop) => stop.id === state.current);
  const next = stops[Math.min(currentIndex + 1, stops.length - 1)];
  state.current = next.id;
  saveState();
  render();
});

saveLaterBtn.addEventListener("click", () => {
  toggleList("later", state.current);
  saveState();
  render();
});

resetBtn.addEventListener("click", () => {
  state = { ...defaultState };
  saveState();
  render();
});

render();
