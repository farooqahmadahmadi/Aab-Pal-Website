import { useState, useEffect } from "react";

export default function CompanyInfoForm({ user }) {
  // Role Protection
  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Access Denied
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    company_tagline: "",
    license_number: "",
    license_start_date: "",
    license_expiry_date: "",
    company_phone: "",
    company_email: "",
    company_address: "",
    description: "",
    company_logo: null,
  });

  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]);

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.company_name.trim())
      newErrors.company_name = "Company name is required";

    if (!/^\S+@\S+\.\S+$/.test(formData.company_email))
      newErrors.company_email = "Valid email required";

    if (!formData.company_phone.trim())
      newErrors.company_phone = "Phone number required";

    if (
      formData.license_start_date &&
      formData.license_expiry_date &&
      formData.license_start_date > formData.license_expiry_date
    )
      newErrors.license_expiry_date =
        "Expiry date must be after start date";

    if (formData.description.length > 2500)
      newErrors.description = "Max 2500 characters allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Logo Validation
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG or PNG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB allowed");
      return;
    }

    setFormData({ ...formData, company_logo: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Updated Data:", formData);

    setIsEditing(false);
    alert("Company Info Updated Successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Company Information
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className={`relative ${isEditing ? "cursor-pointer" : ""}`}
            onClick={() =>
              isEditing && document.getElementById("logoInput").click()
            }
          >
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt="Logo"
              className="w-32 h-32 rounded-full object-cover border"
            />
          </div>

          <input
            type="file"
            id="logoInput"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleLogoChange}
          />
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {[
            { label: "Company Name", name: "company_name" },
            { label: "Tagline", name: "company_tagline" },
            { label: "License Number", name: "license_number" },
            { label: "Phone", name: "company_phone" },
            { label: "Email", name: "company_email", type: "email" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-2 text-gray-600 font-medium">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                disabled={!isEditing}
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-600 font-medium">
              Description
            </label>
            <textarea
              disabled={!isEditing}
              maxLength={2500}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 h-40 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            )}
          </div>
        </form>

        {/* Documents Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Company Documents
            </h3>

            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              + Add Document
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Updated At</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-400">
                      No Documents Found
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.document_id} className="border-t">
                      <td className="p-3">{doc.document_id}</td>
                      <td className="p-3">{doc.document_name}</td>
                      <td className="p-3">{doc.document_description}</td>
                      <td className="p-3">{doc.updated_at}</td>
                      <td className="p-3 flex gap-2">
                        <button className="text-blue-600">Edit</button>
                        <button className="text-red-600">Delete</button>
                        <button className="text-green-600">Download</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}