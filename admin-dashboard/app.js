const productList = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");

const API_URL = "http://localhost:5000/api/products";

// Function to upload images
async function uploadImages(files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/products/upload", {
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

  const imagesInput = document.getElementById("images");
  const uploadedImages = await uploadImages(imagesInput.files);

  const newProduct = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    sizes: document.getElementById("sizes").value.split(",").map(s => s.trim()),
    colors: document.getElementById("colors").value.split(",").map(c => c.trim()),
    color_images: uploadedImages.reduce((acc, image, index) => {
      acc[document.getElementById("colors").value.split(",")[index]] = image;
      return acc;
    }, {}),
    image: uploadedImages[0], // Use the first image as the main image
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  addProductForm.reset();
  fetchProducts();
});

// Function to fetch and display products
async function fetchProducts() {
  productList.innerHTML = "";
  const response = await fetch(API_URL);
  const products = await response.json();

  products.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price}</td>
      <td>
        <button class="edit" onclick="editProduct('${product._id}')">Edit</button>
        <button class="delete" onclick="deleteProduct('${product._id}')">Delete</button>
      </td>
    `;

    productList.appendChild(row);
  });
}

// Delete a product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  }
}

// Load products on page load
fetchProducts();
