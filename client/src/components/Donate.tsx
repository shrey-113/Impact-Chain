import { useState, useEffect } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import { UseCauseCard } from "./UseCauseCard.tsx";

export const Donate = () => {
  const [causes, setCauses] = useState([]);
  const { sendTransaction, status } = useTransaction();

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

  // State to track donations
  const [donatedCauses, setDonatedCauses] = useState<{
    [key: number]: boolean;
  }>({});

  const handleDonate = async (id: number) => {
    // Show confirmation popup
    const confirmed = window.confirm(
      "You are about to stake 1 governance token for validation. Do you want to proceed?"
    );
    if (confirmed) {
      const result = await sendTransaction();

      console.log("Donated token to the cause successfully!");

      setTimeout(() => {
        alert("Cause created successfully");
        setDonatedCauses((prev) => ({ ...prev, [id]: true }));
      }, Math.floor(Math.random() * 10000) + 10000);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {causes.map((cause: any) => (
        <div
          key={cause.id}
          className="flex flex-col justify-center items-center"
        >
          <UseCauseCard title={cause.title} description={cause.description} />
          {donatedCauses[cause.id] ? (
            <span className="mt-2 text-green-500">Donated</span>
          ) : (
            <button
              onClick={() => handleDonate(cause.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Donate
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
