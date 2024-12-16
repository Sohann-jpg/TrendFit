let products = []; // Array to hold product data

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filters = document.querySelectorAll(".filter");

// Fetch product data from JSON file
async function fetchProducts() {
  try {
    const response = await fetch("products.json");
    products = await response.json(); // Store fetched products in the global array

    renderProducts(products); // Render all products initially
  } catch (error) {
    console.error("Error fetching product data:", error);
    productContainer.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
}

// Function to render products
function renderProducts(filteredProducts) {
  productContainer.innerHTML = ""; // Clear the current product display

  if (filteredProducts.length === 0) {
    productContainer.innerHTML = `<p>No products found!</p>`;
    return;
  }

  filteredProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
        <img src="${product.image}" alt="${product.name}" style="width:100%; height:auto;">
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <p>Sizes: ${product.sizes.join(", ")}</p>
        <p>Colors: ${product.colors.join(", ")}</p>
      </a>
    `;
    productContainer.appendChild(productDiv);
  });
}

// Filter functionality
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();

  // Get selected filter values
  const selectedFilters = Array.from(filters)
    .filter((filter) => filter.checked)
    .map((filter) => filter.value);

  // Filter products based on search and selected filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) =>
        product.category.toLowerCase().includes(filter.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
filters.forEach((filter) => filter.addEventListener("change", applyFilters));

// Fetch and display products on page load
fetchProducts();
