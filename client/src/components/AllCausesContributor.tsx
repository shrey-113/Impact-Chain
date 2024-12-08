import { useState, useEffect } from "react";
import { UseCauseCard } from "./UseCauseCard.tsx";

export const AllCausesContributor = () => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {causes.map((cause: any) => (
        <div key={cause.id} className="flex justify-center">
          <UseCauseCard title={cause.title} description={cause.description} />
        </div>
      ))}
    </div>
  );
};
