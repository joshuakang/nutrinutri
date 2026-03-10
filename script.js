const posts = [
  {
    title: "7 High-Protein Breakfasts That Keep You Full",
    excerpt: "Simple breakfast formulas to hit your protein target before noon.",
    topic: "Meal Planning",
    date: "2026-02-22",
    readTime: "6 min",
    link: "#",
  },
  {
    title: "Creatine for Women: Benefits, Safety, and Dosage",
    excerpt: "What current studies suggest about performance, recovery, and cognition.",
    topic: "Supplements",
    date: "2026-02-14",
    readTime: "8 min",
    link: "#",
  },
  {
    title: "How to Build a Fat Loss Plate (Without Tracking Every Calorie)",
    excerpt: "A visual plate method using fiber, protein, and volume foods.",
    topic: "Weight Management",
    date: "2026-01-29",
    readTime: "7 min",
    link: "#",
  },
  {
    title: "Pre-Workout Nutrition Timing for Busy Schedules",
    excerpt: "Practical fueling timing windows for morning and evening training.",
    topic: "Sports Nutrition",
    date: "2026-01-16",
    readTime: "5 min",
    link: "#",
  },
  {
    title: "The Fiber Gap: Why Most Adults Miss the Mark",
    excerpt: "How to add 10g extra fiber daily with low-effort food swaps.",
    topic: "Gut Health",
    date: "2025-12-21",
    readTime: "6 min",
    link: "#",
  },
  {
    title: "Reading Supplement Labels Without Getting Misled",
    excerpt: "A quick checklist to evaluate ingredient forms and dosage quality.",
    topic: "Supplements",
    date: "2025-12-04",
    readTime: "9 min",
    link: "#",
  },
];

const postsGrid = document.querySelector("#posts-grid");
const filtersWrap = document.querySelector("#topic-filters");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

let activeTopic = "All";
let searchTerm = "";

const topics = ["All", ...new Set(posts.map((post) => post.topic))];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildFilters() {
  filtersWrap.innerHTML = "";

  topics.forEach((topic) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = topic;
    btn.className = "filter-btn";
    if (topic === activeTopic) btn.classList.add("active");

    btn.addEventListener("click", () => {
      activeTopic = topic;
      buildFilters();
      renderPosts();
    });

    filtersWrap.appendChild(btn);
  });
}

function renderPosts() {
  const filtered = posts.filter((post) => {
    const topicOk = activeTopic === "All" || post.topic === activeTopic;
    const searchOk =
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.topic.toLowerCase().includes(searchTerm);

    return topicOk && searchOk;
  });

  postsGrid.innerHTML = "";

  filtered.forEach((post) => {
    const article = document.createElement("article");
    article.className = "post-card";
    article.innerHTML = `
      <div class="post-meta">
        <span>${post.topic}</span>
        <span>${post.readTime}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="post-meta">
        <span>${formatDate(post.date)}</span>
        <a href="${post.link}">Read more</a>
      </div>
    `;

    postsGrid.appendChild(article);
  });

  emptyState.hidden = filtered.length > 0;
}

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderPosts();
});

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  siteNav.classList.toggle("open");
});

document.querySelector("#year").textContent = new Date().getFullYear();

buildFilters();
renderPosts();
