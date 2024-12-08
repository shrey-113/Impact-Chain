import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const CauseDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the cause ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    file: null as File | null,
    description: "",
  });
  const [cause, setCause] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    // Fetch causes from the JSON file in the public folder
    fetch("/AllCauses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch causes");
        }
        return response.json();
      })
      .then((causesData) => {
        // Find the cause by ID
        const foundCause = causesData.find(
          (cause: { id: string }) => cause.id === id
        );
        if (foundCause) {
          setCause(foundCause);
        }
      })
      .catch((error) => console.error("Error fetching cause details:", error));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="p-4 ml-60 bg-zinc-900 text-white rounded-lg shadow-lg">
      {cause ? (
        <>
          <h2 className="mt-2 text-2xl font-semibold">{cause.title}</h2>
          <p className="mt-2 text-gray-300">{cause.description}</p>

          <h2 className="mt-4 text-xl font-semibold">Add Dataset</h2>
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium" htmlFor="name">
                Dataset Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium" htmlFor="file">
                Upload File:
              </label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="description"
              >
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-2xl font-semibold">Climate Change</h2>
          <p className="mt-2 text-gray-300">
            Addressing the impacts of climate change through initiatives that
            promote renewable energy and sustainability.
          </p>

          <h2 className="mt-4 text-xl font-semibold">Add Dataset</h2>
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium" htmlFor="name">
                Dataset Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium" htmlFor="file">
                Upload File:
              </label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="description"
              >
                Description:
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};
