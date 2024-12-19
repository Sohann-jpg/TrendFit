const productList = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");

const API_URL = "https://trendfit-backend.onrender.com/api/products";

// Function to upload images
async function uploadImages(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.images; // Return the uploaded image paths
  } catch (error) {
    console.error("Image Upload Error:", error);
    alert("Failed to upload images. Please check the server and try again.");
    return [];
  }
}

// Function to add a new product
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const imagesInput = document.getElementById("images");
    const uploadedImages = await uploadImages(imagesInput.files);

    if (uploadedImages.length === 0) {
      alert("No images uploaded. Cannot proceed.");
      return;
    }

    const colors = document.getElementById("colors").value.split(",").map((c) => c.trim());
    const newProduct = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      price: parseFloat(document.getElementById("price").value),
      sizes: document.getElementById("sizes").value.split(",").map((s) => s.trim()),
      colors,
      color_images: colors.reduce((acc, color, index) => {
        acc[color] = uploadedImages[index] || ""; // Use empty string if no image is provided
        return acc;
      }, {}),
      image: uploadedImages[0], // Use the first image as the main image
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error(`Failed to add product with status ${response.status}`);
    }

    alert("Product added successfully!");
    addProductForm.reset();
    fetchProducts();
  } catch (error) {
    console.error("Add Product Error:", error);
    alert("Failed to add product. Please try again.");
  }
});

// Function to fetch and display products
async function fetchProducts() {
  productList.innerHTML = "";
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch products with status ${response.status}`);
    }

    const products = await response.json();
    products.forEach((product) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <button class="edit" onclick="editProduct('${product._id}')">Edit</button>
          <button class="delete" onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
      `;

      productList.appendChild(row);
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    alert("Failed to fetch products. Please check the server.");
  }
}

// Delete a product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Failed to delete product with status ${response.status}`);
      }

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("Failed to delete product. Please try again.");
    }
  }
}

// Load products on page load
fetchProducts();
