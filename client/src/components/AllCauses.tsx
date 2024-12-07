import {  useState } from "react";
import { UseCauseCard } from "./UseCauseCard.tsx";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export const AllCauses = () => {
  // Retrieve causes from local storage
  const [causes] = useState(() => {
    const storedCauses = localStorage.getItem('causes');
    return storedCauses ? JSON.parse(storedCauses) : [];
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {causes.map((cause:any) => (
        <div key={cause.id} className="flex justify-center">
          <Link to={`/ngo/cause/${cause.id}`}> {/* Create a link for each card */}
            <UseCauseCard title={cause.title} description={cause.description} />
          </Link>
        </div>
      ))}
    </div>
  );
};