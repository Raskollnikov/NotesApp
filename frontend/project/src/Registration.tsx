import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    // Optionally load user data from localStorage when component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []); // Empty dependency array to run once on mount

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!userData.userName || !userData.name || !userData.password) {
      console.log("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const savedUser = await response.json(); // Parse response JSON
      const { userName, name, id } = savedUser;

      // Save user data to localStorage
      localStorage.setItem("userData", JSON.stringify({ userName, name, id }));

      console.log("User registered successfully!");

      // Clear input fields after successful registration
      setUserData({ userName: "", name: "", password: "" });

      // Navigate to notes route
      navigate("/notes");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="userName" className="font-medium">
              Username:
            </label>
            <input
              required
              type="text"
              name="userName"
              placeholder="Username"
              value={userData.userName}
              onChange={handleInput}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium">
              Name:
            </label>
            <input
              required
              type="text"
              name="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleInput}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium">
              Password:
            </label>
            <input
              required
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInput}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 rounded font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </div>
        <h6 className="my-2">
          already have an account?{" "}
          <button className="underline" onClick={() => navigate("/login")}>
            Login
          </button>
        </h6>
      </form>
    </div>
  );
}

export default Registration;
