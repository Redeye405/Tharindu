// Default Seed Projects
const defaultProjects = [
  {
    id: "default-1",
    title: "Enterprise LAN Network Planning",
    category: "networking",
    description: "Structured network layout and IP subnetting designed for a three-story corporate office.",
    details: "This project showcases full topology design in Cisco Packet Tracer, allocating subnet ranges using Variable Length Subnet Masking (VLSM). Includes setting up routing protocols (OSPF), VLAN divisions, DHCP server pools, and configuring access control list (ACL) rules to secure administrative sectors. Tested on physical Cisco switches and router hardware (2911 series).",
    tech: ["Packet Tracer", "OSPF", "VLAN", "VLSM"],
    image: "assets/networking_project.png"
  },
  {
    id: "default-2",
    title: "Motherboard Diagnostic & Repair",
    category: "hardware",
    description: "Component-level repair of hardware components with voltage analysis and faulty RAM regulator replacement.",
    details: "Detailed hardware investigation of a dead motherboard that would not complete POST. Conducted diagnostics using a digital multimeter and debug cards, identifying a faulty power regulator on the DDR3 RAM power rail. Replaced SMD components using a hot air rework station. Restored system stability and successfully booted to system bios.",
    tech: ["Multimeter", "Soldering", "SMD Rework", "BIOS POST"],
    image: "assets/hardware_project.png"
  },
  {
    id: "default-3",
    title: "Student Inventory Database Web-App",
    category: "webdev",
    description: "SQL database registry integrated with a clean responsive web admin panel to catalog laboratory assets.",
    details: "A web application developed with HTML, CSS, and an SQL backend to organize physical hardware inventory. Implemented normal forms database schema tables (Primary & Foreign keys, join statements), allowing laboratory instructors to query stocks, filter items by status, and edit records seamlessly.",
    tech: ["HTML", "CSS", "SQL Queries", "Database Design"],
    image: "assets/webdev_project.png"
  }
];

// Global State
let projects = [];
let currentFilter = "all";

// DOM Elements
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-btn");
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");
const projectsGrid = document.getElementById("projects-grid-container");
const filterBtns = document.querySelectorAll(".filter-btn");

// Modals
const detailsModalEl = document.getElementById("details-modal");
const closeDetailsBtn = document.getElementById("close-details-modal");

// Contact Form
const contactForm = document.getElementById("portfolio-contact-form");
const submitStatus = document.getElementById("submit-status-message");

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadProjects();
  setupEventListeners();
  initObservers();
});

// --- THEME MANAGEMENT ---
function initTheme() {
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("portfolio_theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const moonIcon = themeBtn.querySelector(".moon-icon");
  const sunIcon = themeBtn.querySelector(".sun-icon");
  
  if (theme === "light") {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  } else {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  }
}

// --- PROJECT HANDLING ---
function loadProjects() {
  projects = [...defaultProjects];
  renderProjects();
}

function renderProjects() {
  projectsGrid.innerHTML = "";
  
  const filteredProjects = currentFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === currentFilter);
    
  if (filteredProjects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="no-projects">
        <i class="ri-folder-open-line"></i>
        <p>No projects found in this category.</p>
      </div>
    `;
    return;
  }
  
  filteredProjects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card glass scroll-reveal";
    card.dataset.id = project.id;
    
    // Format category label
    let catLabel = project.category;
    if (catLabel === "webdev") catLabel = "Web Dev & SQL";
    else if (catLabel === "networking") catLabel = "Networking";
    else if (catLabel === "hardware") catLabel = "Hardware";
    
    const techListHTML = project.tech.map(t => `<li>${t.trim()}</li>`).join("");
    
    card.innerHTML = `
      <div class="project-img-wrapper">
        <span class="project-category-badge">${catLabel}</span>
        <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy">
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="project-tech">
          ${techListHTML}
        </ul>
      </div>
    `;
    
    card.addEventListener("click", () => openDetailsModal(project));
    projectsGrid.appendChild(card);
    
    // Small delay to trigger reveal transition on dynamically added cards
    setTimeout(() => {
      card.classList.add("active");
    }, 50);
  });
}

function filterProjects(e) {
  const clickedBtn = e.target;
  filterBtns.forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");
  
  currentFilter = clickedBtn.dataset.filter;
  renderProjects();
}

// --- MODAL CONTROLS ---
function openModal(modal) {
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restore scroll
}

function openDetailsModal(project) {
  document.getElementById("modal-project-title").innerText = project.title;
  document.getElementById("modal-project-img").src = project.image;
  
  let catLabel = project.category;
  if (catLabel === "webdev") catLabel = "Web Dev & SQL";
  else if (catLabel === "networking") catLabel = "Networking";
  else if (catLabel === "hardware") catLabel = "Hardware";
  
  document.getElementById("modal-project-category").innerText = catLabel;
  
  const techContainer = document.getElementById("modal-project-tech");
  techContainer.innerHTML = project.tech.map(t => `<li>${t.trim()}</li>`).join("");
  
  document.getElementById("modal-project-description").innerText = project.description;
  document.getElementById("modal-project-full-text").innerText = project.details || project.description;
  
  openModal(detailsModalEl);
}

// (Removed project upload functionality)

function handleContactSubmit(e) {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  
  // Disable button and show sending state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Sending...`;
  
  // Reset message layout
  submitStatus.className = "submit-status";
  submitStatus.innerText = "";
  
  // Mock sending latency
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    
    // Display Success Feedback
    submitStatus.classList.add("success");
    submitStatus.innerHTML = `<i class="ri-checkbox-circle-line"></i> Message sent successfully! Tharindu will respond soon.`;
    
    contactForm.reset();
    
    // Fade out status message after 5 seconds
    setTimeout(() => {
      submitStatus.className = "submit-status";
      submitStatus.innerText = "";
    }, 5000);
  }, 1500);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Theme Toggle
  themeBtn.addEventListener("click", toggleTheme);
  
  // Mobile Nav Toggle
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const menuIcon = menuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      menuIcon.className = "ri-close-line";
    } else {
      menuIcon.className = "ri-menu-line";
    }
  });
  
  // Close menu on nav links click (mobile)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const menuIcon = menuBtn.querySelector("i");
      menuIcon.className = "ri-menu-line";
    });
  });
  
  // Scroll header handler
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  
  // Project category filters
  filterBtns.forEach(btn => {
    btn.addEventListener("click", filterProjects);
  });
  
  // Modal Open/Close handlers
  closeDetailsBtn.addEventListener("click", () => closeModal(detailsModalEl));
  
  // Close modal when clicking on overlay background
  window.addEventListener("click", (e) => {
    if (e.target === detailsModalEl) {
      closeModal(detailsModalEl);
    }
  });
  
  // Form submissions
  contactForm.addEventListener("submit", handleContactSubmit);
}

// --- INTERSECTION OBSERVERS (SCROLL REVEALS & HIGHLIGHTS) ---
function initObservers() {
  // 1. Scroll-reveal animation observer
  const revealElements = document.querySelectorAll(".scroll-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        
        // Specific animation trigger for skills bar fills
        if (entry.target.id === "skills") {
          animateSkillsBars();
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  // 2. Active nav link highlight on scroll
  const sections = document.querySelectorAll("section");
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: "-20% 0px -50% 0px"
  });
  
  sections.forEach(sec => navObserver.observe(sec));
}

function animateSkillsBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  bars.forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = width;
  });
}
