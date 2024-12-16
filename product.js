async function loadProduct() {
    // Retrieve the product ID from the URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
  
    try {
      // Fetch product data
      const response = await fetch("products.json");
      const products = await response.json();
  
      // Find the specific product by ID
      const product = products.find((item) => item.id == productId);
  
      if (!product) {
        document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
        return;
      }
  
      // Populate product details
      document.getElementById("product-image").innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:300px; height:auto; border-radius: 8px;">
      `;
      document.getElementById("product-name").textContent = product.name;
      document.getElementById("product-price").textContent = `Price: $${product.price}`;
  
      // Render Colors dynamically from product.colors array
      const colorContainer = document.getElementById("product-colors");
      product.colors.forEach((color) => {
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color-option");
  
        // Validate color or use fallback
        const isValidColor = CSS.supports("background-color", color.toLowerCase());
        if (isValidColor) {
          colorDiv.style.backgroundColor = color.toLowerCase(); // Set valid color
        } else {
          colorDiv.classList.add("invalid"); // Use fallback for invalid colors
          colorDiv.title = "Invalid color"; // Tooltip for invalid color
        }
  
        colorDiv.title = color; // Tooltip showing the color name
  
        // Add click functionality to highlight selected color
        colorDiv.addEventListener("click", () => {
          document.querySelectorAll(".color-option").forEach((c) => c.classList.remove("selected"));
          colorDiv.classList.add("selected");
          updateProductImage(product, color);
        });
  
        colorContainer.appendChild(colorDiv);
      });
  
      // Render Sizes dynamically from product.sizes array
      const sizeContainer = document.getElementById("product-sizes");
      product.sizes.forEach((size) => {
        const sizeDiv = document.createElement("div");
        sizeDiv.classList.add("size-option");
        sizeDiv.textContent = size;
  
        // Add click functionality to highlight selected size
        sizeDiv.addEventListener("click", () => {
          document.querySelectorAll(".size-option").forEach((s) => s.classList.remove("selected"));
          sizeDiv.classList.add("selected");
        });
  
        sizeContainer.appendChild(sizeDiv);
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      document.getElementById("product-details").innerHTML = `<p>Error loading product. Please try again later.</p>`;
    }
  }
  
  // Function to update the product image when a color is selected
  function updateProductImage(product, selectedColor) {
    if (product.color_images && product.color_images[selectedColor]) {
      document.getElementById("product-image").innerHTML = `
        <img src="${product.color_images[selectedColor]}" alt="${product.name} (${selectedColor})" style="width:300px; height:auto; border-radius: 8px;">
      `;
    }
  }
  
  // Load the product on page load
  loadProduct();
  