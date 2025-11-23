//! Client-Side Validation (FORM) --> this could also be pasted in Bolierplate  , or new.ejs

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//! Filter Functionality

// Pre-populate form and display active filters on page load
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Display active filter badges
  displayActiveFilters(urlParams);
});

// Clear filters button handler
const clearFiltersBtn = document.getElementById("clearFilters");
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    window.location.href = "/listings";
  });
}

// Display active filter badges
function displayActiveFilters(params) {
  const container = document.getElementById("activeFilters");
  if (!container) return;

  container.innerHTML = "";
  let hasFilters = false;

  const filterLabels = {
    minPrice: "Min Price",
    maxPrice: "Max Price",
    minRating: "Min Rating",
    location: "Location",
    country: "Country",
  };

  for (const [key, value] of params.entries()) {
    if (value && filterLabels[key]) {
      hasFilters = true;
      const badge = document.createElement("span");
      badge.className = "badge bg-primary me-2 mb-2";

      let displayValue = value;
      if (key === "minRating") {
        displayValue = value + "+ ★";
      } else if (key.includes("Price")) {
        displayValue = "₹" + value;
      }

      badge.innerHTML = `
        ${filterLabels[key]}: ${displayValue}
        <button type="button" class="btn-close btn-close-white btn-sm ms-1" 
                onclick="removeFilter('${key}')" aria-label="Remove filter"></button>
      `;
      container.appendChild(badge);
    }
  }

  if (hasFilters) {
    const heading = document.createElement("p");
    heading.className = "mb-2 fw-bold";
    heading.textContent = "Active Filters:";
    container.prepend(heading);
  }
}

// Remove individual filter
function removeFilter(key) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(key);
  const newSearch = urlParams.toString();
  window.location.search = newSearch;
}
