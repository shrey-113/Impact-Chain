// CauseDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const CauseDetail = () => {
  const { id } = useParams<{ id: string }>(); 
  console.log(id); // Get the cause ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    file: null as File | null,
    description: '',
  });
  const [cause, setCause] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    // Retrieve causes from local storage
    const storedCauses = localStorage.getItem('causes');
    if (storedCauses) {
      const causesData = JSON.parse(storedCauses);
      // Find the cause based on the ID
      //@ts-ignore
      const foundCause = causesData[id-1];
      console.log(foundCause)
      if (foundCause) {
        setCause(foundCause);
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        //@ts-ignore
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve existing causes from local storage
    const storedCauses = localStorage.getItem('causes');
    if (storedCauses) {
      const causesData = JSON.parse(storedCauses);

      // Update the cause with the new dataset information
      const updatedCauses = causesData.map((cause: { id: string; datasets?: any[] }) => {
        if (cause.id === id) {
          // Initialize datasets array if it doesn't exist
          if (!cause.datasets) {
            cause.datasets = [];
          }
          // Add the new dataset to the datasets array
          cause.datasets.push({
            name: formData.name,
            // file: formData.file,
            description: formData.description,
          });
        }
        return cause;
      });

      // Save the updated causes back to local storage
      localStorage.setItem('causes', JSON.stringify(updatedCauses));
    }

    console.log('Form submitted:', formData);
  };

  return (
    <div className="p-4">
      {cause ? (
        <>
          <h2 className="mt-2 text-xl">{cause.title}</h2>
          <p className="mt-2">{cause.description}</p>

          <h2 className="mt-4 text-xl">Add Dataset</h2>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-4">
              <label className="block mb-1" htmlFor="name">Dataset Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="file">Upload File:</label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="description">Description:</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">Submit</button>
          </form>
        </>
      ) : (
        <p>Loading cause details...</p>
      )}
    </div>
  );
};