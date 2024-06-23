import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ userName: "", password: "" });
  const [error, setError] = useState<string>("");

  const handleInput = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before making a new request

    if (!data.userName || !data.password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to login");
      }

      const responseData = await response.json();
      const { userName, name, id } = responseData.user;
      localStorage.setItem("userData", JSON.stringify({ userName, name, id }));

      navigate("/notes");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <input
            type="text"
            name="userName"
            value={data.userName}
            onChange={handleInput}
            required
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            required
            name="password"
            value={data.password}
            onChange={handleInput}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Submit
        </button>
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        <h6 className="my-2">
          don't have account?{" "}
          <button className="underline" onClick={() => navigate("/")}>
            Register
          </button>
        </h6>
      </form>
    </div>
  );
}

export default Login;
