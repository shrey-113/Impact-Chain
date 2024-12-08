import { useState, useEffect } from "react";
import { UseCauseCard } from "./UseCauseCard.tsx";

export const Validate = () => {
  const [causes, setCauses] = useState([]);

  // Retrieve causes from local storage
  useEffect(() => {
    // Fetch the JSON data from the public folder
    fetch("/allCauses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch causes");
        }
        return response.json();
      })
      .then((data) => setCauses(data))
      .catch((error) => console.error("Error fetching causes:", error));
  }, []);

  // State to track validation
  const [validatedCauses, setValidatedCauses] = useState<{ [key: number]: boolean }>({});

  const handleThumbsUp = (id: number) => {
    // Show confirmation alert
    const confirmed = window.confirm("You are about to validate this cause. Do you want to proceed?");
    if (confirmed) {
      setValidatedCauses((prev) => ({ ...prev, [id]: true }));
      alert("Thank you for validating!");
    }
  };

  const handleThumbsDown = (id: number) => {
    alert("You have declined to validate this cause.");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {causes.map((cause: any) => (
        <div key={cause.id} className="flex flex-col justify-center items-center">
          <UseCauseCard title={cause.title} description={cause.description} />
          <button
            className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded mt-2"
          >
            Download Data
          </button>
          <div className="flex mt-2">
            <button
              onClick={() => handleThumbsUp(cause.id)}
              className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded mr-2 flex items-center"
            >
              <span className="mr-1">👍</span> {/* Thumbs up icon */}
              Validate
            </button>
            <button
              onClick={() => handleThumbsDown(cause.id)}
              className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded flex items-center"
            >
              <span className="mr-1">👎</span> {/* Thumbs down icon */}
              Refute
            </button>
          </div>
          {validatedCauses[cause.id] && (
            <span className="mt-2 text-green-500">Validated</span>
          )}
        </div>
      ))}
    </div>
  );
};