// src/App.js
// ---------------------------------------------
// 🛒 Simple E-commerce + PayPal Payment Integration
// ---------------------------------------------

// Step 1: Install PayPal’s React SDK

// Run this in your frontend folder (the same one with src):

// >> npm install @paypal/react-paypal-js


import React, { useState, useEffect } from "react";
import axios from "axios";

// Import PayPal components
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function App() {
  // 🧠 State to store list of products
  const [products, setProducts] = useState([]);

  // 🧠 State to store new product form data
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  // 📦 Load all products when the page first opens
  useEffect(() => {
    axios
      .get("http://localhost:5000/simple-ecom/products")
      .then((res) => setProducts(res.data)) // set the list of products from backend
      .catch((err) => console.log(err)); // print any error in console
  }, []);

  // ✏️ When user types in the input boxes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // update the correct field
  };

  // ➕ Add a new product to the backend
  const addProduct = () => {
    axios
      .post("http://localhost:5000/simple-ecom/products", form)
      .then(() => {
        alert("✅ Product added!");
        window.location.reload(); // refresh the product list
      })
      .catch(() => alert("❌ Error adding product"));
  };

  return (
    // 🟢 Step 1: Wrap the entire app with PayPalScriptProvider
    // This loads PayPal SDK (the system that allows payments)
    <PayPalScriptProvider
      options={{
        // "client-id": "YOUR_SANDBOX_CLIENT_ID_HERE", // 👈 replace with your sandbox ID
        "client-id": "AVdEVIGs2EVyUNKGM_P6dHfNE1zPuTfx_ruYUD_Yqvzgj-m_9pfQArYd1DrxBq4YEvMxxUZnJcU5bku4", // 👈 replace with your sandbox ID
        currency: "USD", // or "EUR", "KES", etc.
      }}
    >
      <div style={{ padding: "20px" }}>
        <h2>🛍 Simple E-commerce Demo</h2>

        {/* 🧾 Product form for adding new products */}
        <div style={{ marginBottom: "20px" }}>
          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="price"
            placeholder="Price"
            onChange={handleChange}
            style={{ marginRight: "10px" }}
          />
          <input
            name="description"
            placeholder="Description"
            onChange={handleChange}
            style={{ marginRight: "10px" }}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>

        <hr />

        {/* 🧩 Step 2: Display all products */}
        <h3>🧾 All Products</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((p) => (
            <li
              key={p._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              {/* Show basic product info */}
              <b>{p.name}</b> - ${p.price}
              <br />
              <small>{p.description}</small>
              <br />
              <br />

              {/* 💳 Step 3: PayPal button for each product */}
              <PayPalButtons
                // When user clicks PayPal button
                createOrder={(data, actions) => {
                  // Tell PayPal what product (and price) they are buying
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: p.name, // Product name
                        amount: {
                          value: p.price, // Product price
                        },
                      },
                    ],
                  });
                }}
                // When payment is approved successfully
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert("✅ Payment successful! Thank you, " + details.payer.name.given_name);
                    console.log("Payment details:", details);
                  });
                }}

                // If something goes wrong
                onError={(err) => {
                  console.error(err);
                  alert("❌ Payment failed. Please try again.");
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
