const fetch = require("node-fetch");

async function testSignup() {
  const url = "http://localhost:3000/api/auth/signup";
  const data = {
    email: "testuser@example.com",
    password: "Test1234",
    fullName: "Test User",
    phone: "1234567890"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    console.log("Signup API response:", json);
  } catch (error) {
    console.error("Error calling signup API:", error);
  }
}

testSignup();
