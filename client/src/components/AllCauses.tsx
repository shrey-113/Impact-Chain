import { useState, useEffect } from "react";
import { UseCauseCard } from "./UseCauseCard.tsx";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export const AllCauses = () => {
  const [causes, setCauses] = useState([]);

  // Retrieve causes from local storage
  useEffect(() => {
    // Fetch the JSON data from the public folder
    fetch("/allCauses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch causes");
        }
        localStorage.setItem("causes", JSON.stringify(response));
        return response.json();
      })
      .then((data) => setCauses(data))
      .catch((error) => console.error("Error fetching causes:", error));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {causes.map((cause: any) => (
        <div key={cause.id} className="flex justify-center">
          <Link to={`/ngo/cause/${cause.id}`}>
            {" "}
            {/* Create a link for each card */}
            <UseCauseCard title={cause.title} description={cause.description} />
          </Link>
        </div>
      ))}
    </div>
  );
};
