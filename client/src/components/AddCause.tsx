import React, { useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";

const AddCauseForm: React.FC = () => {
  const [causeName, setCauseName] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const { sendTransaction, status } = useTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await sendTransaction();

    console.log("Cause added successfully!");

    setTimeout(() => {
      alert("Cause created successfully");
    }, Math.floor(Math.random() * 10000) + 10000);

    setCauseName("");
    setDescription("");

    // Handle form submission logic here
    console.log({ causeName, description, goalAmount });
  };

  return (
    <div className="ml-60 flex items-center justify-center min-h-screen px-40">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-lg shadow-md w-full"
      >
        <h2 className="text-white text-2xl mb-4">Add Cause</h2>

        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="causeName">
            Cause Name
          </label>
          <input
            type="text"
            id="causeName"
            value={causeName}
            onChange={(e) => setCauseName(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition duration-200"
        >
          Add Cause
        </button>
      </form>
    </div>
  );
};

export default AddCauseForm;
