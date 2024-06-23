import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";

function Notes() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [userData, setUserData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    console.log(storedUser);

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserId(userData.id);
      setUserData(userData);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const dataJson = await response.json();
        setAllData(dataJson);
      } catch (error) {
        console.error("Error fetching additional data:", error.message);
      }
    };

    fetchData();
  }, [userId]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const handleDelete = async (id) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:3000/note/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Optimistically update UI
      setAllData((prevData) => ({
        ...prevData,
        notes: prevData.notes.filter((note) => note.id !== id),
      }));

      console.log("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const { userName } = userData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const makeRequest = await fetch(
        `http://localhost:3000/users/${userId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, userId }),
        }
      );

      if (!makeRequest.ok) {
        throw new Error("Failed to add note");
      }

      const newNote = await makeRequest.json();
      setAllData((prevData) => ({
        ...prevData,
        notes: [...prevData.notes, newNote],
      }));

      console.log("Note added successfully!");

      setTitle("");
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-2xl p-8 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome, {userName}!
        </h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="note"
            >
              Enter your note:
            </label>
            <input
              type="text"
              placeholder="Note"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Add Note
          </button>
        </form>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-4">My Notes</h2>
          {allData?.notes?.length > 0 ? (
            allData.notes.map((each) => (
              <div
                key={each.id}
                className="mb-2 p-4 bg-white rounded-lg shadow-md flex justify-between"
              >
                {each.title}
                <RiDeleteBin5Line
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(each.id)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-600">No notes available.</p>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          navigate("/login");
          localStorage.removeItem("userData");
        }}
        className="mt-6 text-red-600 font-bold underline hover:text-red-700"
      >
        Log out
      </button>
    </div>
  );
}

export default Notes;
