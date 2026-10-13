/* ============================================================
   Savory Table — Site Interactivity & Reservation Logic
   ============================================================ */

/* ---------- Menu Data ---------- */
const MENU = {
  breakfast: {
    label: "Breakfast",
    emoji: "🥞",
    items: [
      { name: "Golden Buttermilk Pancakes", desc: "Stack of fluffy pancakes with maple syrup, whipped butter & fresh berries.", price: "$11.50", tag: "Chef's Pick" },
      { name: "Farmhouse Breakfast", desc: "Two eggs any style, smoked bacon, grilled tomato, sourdough toast & hash browns.", price: "$13.90", tag: "" },
      { name: "Avocado Toast Royale", desc: "Smashed avocado, poached egg, chili flakes & micro greens on artisan sourdough.", price: "$12.00", tag: "Vegetarian" },
      { name: "Veggie Garden Omelette", desc: "Three-egg omelette filled with spinach, mushrooms, peppers & melted cheddar.", price: "$12.50", tag: "Vegetarian" },
      { name: "Belgian Waffles Deluxe", desc: "Crisp waffles with seasonal fruit compote, vanilla cream & a honey drizzle.", price: "$11.00", tag: "" },
      { name: "Granola & Yogurt Bowl", desc: "House granola, Greek yogurt, honey, chia seeds & fresh seasonal fruit.", price: "$8.90", tag: "Healthy" }
    ]
  },
  lunch: {
    label: "Lunch",
    emoji: "🥗",
    items: [
      { name: "Grilled Chicken Caesar", desc: "Char-grilled chicken, crisp romaine, parmesan, croutons & creamy Caesar dressing.", price: "$14.50", tag: "Popular" },
      { name: "Classic Club Sandwich", desc: "Triple-decker with turkey, bacon, lettuce, tomato & garlic aioli, served with fries.", price: "$13.00", tag: "" },
      { name: "Tuscan Minestrone Soup", desc: "Hearty vegetable & bean soup with fresh herbs, served with warm crusty bread.", price: "$9.50", tag: "Vegetarian" },
      { name: "Beef Burger Stack", desc: "Hand-pressed beef patty, aged cheddar, caramelized onions & house sauce on a brioche bun.", price: "$15.50", tag: "Signature" },
      { name: "Mediterranean Bowl", desc: "Quinoa, roasted vegetables, hummus, olives, feta & a zesty lemon herb dressing.", price: "$13.50", tag: "Vegan Option" },
      { name: "Margherita Flatbread", desc: "Wood-fired flatbread with San Marzano tomato, fresh mozzarella & basil.", price: "$12.50", tag: "Vegetarian" }
    ]
  },
  dinner: {
    label: "Dinner",
    emoji: "🍽️",
    items: [
      { name: "Grilled Ribeye Steak", desc: "12oz prime ribeye, garlic butter, roasted potatoes & seasonal vegetables.", price: "$32.00", tag: "Signature" },
      { name: "Herb-Crusted Salmon", desc: "Oven-roasted Atlantic salmon, lemon beurre blanc, asparagus & wild rice.", price: "$26.50", tag: "" },
      { name: "Mushroom Risotto", desc: "Creamy arborio rice, wild mushrooms, parmesan & a hint of truffle oil.", price: "$19.50", tag: "Vegetarian" },
      { name: "Lemon Butter Chicken", desc: "Pan-seared chicken breast, velvety lemon butter sauce, mashed potatoes & greens.", price: "$22.50", tag: "" },
      { name: "Seafood Linguine", desc: "Prawns, mussels & calamari tossed in a rich white-wine tomato sauce.", price: "$24.00", tag: "Popular" },
      { name: "Chocolate Lava Cake", desc: "Warm molten chocolate cake with vanilla bean ice cream & berries.", price: "$9.00", tag: "Dessert" }
    ]
  }
};

/* ---------- Render Menu ---------- */
const menuPanel = document.getElementById("menuPanel");
const menuTabs = document.querySelectorAll(".menu-tab");

function renderMenu(key) {
  const { items } = MENU[key];
  menuPanel.innerHTML = items
    .map(
      (item) => `
        <article class="menu-item">
          <div class="menu-item-info">
            <div class="menu-item-top">
              <span class="menu-item-name">${item.name}</span>
              <span class="menu-item-dots"></span>
              <span class="menu-item-price">${item.price}</span>
            </div>
            <p class="menu-item-desc">${item.desc}</p>
            ${item.tag ? `<span class="menu-item-tag">${item.tag}</span>` : ""}
          </div>
        </article>`
    )
    .join("");
}

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderMenu(tab.dataset.menu);
  });
});

/* Render the default (breakfast) menu on load */
renderMenu("breakfast");
/* ---------- Mobile Nav Toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", isOpen);
});

/* Close menu on link click (mobile) */
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Navbar scroll state ---------- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

/* ---------- Reservation Form ---------- */
const form = document.getElementById("reservationForm");
const success = document.getElementById("reservationSuccess");
const submitBtn = document.getElementById("submitBtn");

/* Set today as min date  + default */
const dateInput = document.getElementById("date");
const now = new Date();
const today = now.toISOString().split("T")[0];
dateInput.setAttribute("min", today);
dateInput.value = today;

/* Set default time to next hour */
const timeInput = document.getElementById("time");
const roundedHour = new Date(now.getTime() + 3600000);
timeInput.defaultValue = `${String(roundedHour.getHours()).padStart(2, "0")}:${String(roundedHour.getMinutes()).padStart(2, "0")}`;

/* Validation helpers */
function showError(elId, msg) {
  const el = document.getElementById(elId);
  const input = el.previousElementSibling;
  el.textContent = msg;
  if (input) input.classList.toggle("invalid", !!msg);
}

function clearErrors() {
  ["name", "email", "phone", "guests", "date", "time"].forEach((id) => showError(id + "Error", ""));
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validPhone(v) {
  return /^\+?[\d\s\-().]{7,18}$/.test(v);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();
  let valid = true;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const guests = document.getElementById("guests").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name) { showError("nameError", "Please enter your full name."); valid = false; }
  else if (name.length < 2) { showError("nameError", "Name must be at least 2 characters."); valid = false; }

  if (!email) { showError("emailError", "Email is required."); valid = false; }
  else if (!validEmail(email)) { showError("emailError", "Enter a valid email address."); valid = false; }

  if (!phone) { showError("phoneError", "Phone number is required."); valid = false; }
  else if (!validPhone(phone)) { showError("phoneError", "Enter a valid phone number."); valid = false; }

  if (!guests) { showError("guestsError", "Select number of guests."); valid = false; }
  if (!date) { showError("dateError", "Please choose a date."); valid = false; }
  if (!time) { showError("timeError", "Please choose a time."); valid = false; }

  if (!valid) return;

  /* Gather data */
  const mealSelected = document.querySelector('input[name="meal"]:checked');
  const meal = mealSelected ? mealSelected.value : "No preference";
  const requests = document.getElementById("requests").value.trim();

  const booking = {
    id: Date.now(),
    name,
    email,
    phone,
    guests,
    date,
    time,
    meal,
    requests,
    createdAt: new Date().toISOString()
  };

  /* Save to localStorage */
  const bookings = JSON.parse(localStorage.getItem("savoryBookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("savoryBookings", JSON.stringify(bookings));

  /* Show confirmation */
  const guestText = guests === "1" ? "1 guest" : guests === "10+" ? "10+ guests" : `${guests} guests`;
  document.getElementById("successMessage").textContent =
    `Thank you, ${name}! We've reserved a table for ${guestText} on ${date} at ${time} for ${meal}. A confirmation has been sent to ${email}.`;
  form.hidden = true;
  success.hidden = false;
  window.scrollTo({ top: document.getElementById("reservation").offsetTop - 80, behavior: "smooth" });
});

/* New booking button */
document.getElementById("newBookingBtn").addEventListener("click", () => {
  form.reset();
  dateInput.value = today;
  clearErrors();
  form.hidden = false;
  success.hidden = true;
  window.scrollTo({ top: document.getElementById("reservation").offsetTop - 80, behavior: "smooth" });
});

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
