import React, { useState, useEffect } from "react";

// Mock API Responses
const API_RESPONSES = {
  userInfo: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  addressInfo: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  paymentInfo: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      {
        name: "cardholderName",
        type: "text",
        label: "Cardholder Name",
        required: true,
      },
    ],
  },
};

const DynamicForm = () => {
  const [formType, setFormType] = useState("userInfo");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  // Fetch Form Fields based on Selection
  useEffect(() => {
    setFormFields(API_RESPONSES[formType].fields || []);
    setFormData({});
    setErrors({});
    setProgress(0);
  }, [formType]);

  // Handle Field Changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    calculateProgress({ ...formData, [name]: value });
  };

  // Calculate Progress
  const calculateProgress = (data) => {
    const requiredFields = formFields.filter((field) => field.required);
    const filledFields = requiredFields.filter((field) => data[field.name]);
    setProgress((filledFields.length / requiredFields.length) * 100);
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData((prev) => [...prev, formData]);
      setFormData({});
      setErrors({});
      setProgress(0);
      alert("Form submitted successfully!");
    }
  };

  // Edit Data
  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete Data
  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    alert("Entry deleted successfully.");
  };

  return (
    <div className="container">
      <h1>Dynamic Form</h1>

      {/* Dropdown to Select Form Type */}
      <select
        value={formType}
        onChange={(e) => setFormType(e.target.value)}
        className="form-select"
      >
        <option value="userInfo">User Information</option>
        <option value="addressInfo">Address Information</option>
        <option value="paymentInfo">Payment Information</option>
      </select>

      {/* Form Rendering */}
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "dropdown" ? (
              <select
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="form-control"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="form-control"
              />
            )}
            {errors[field.name] && (
              <small className="text-danger">{errors[field.name]}</small>
            )}
          </div>
        ))}

        {/* Progress Bar */}
        <div className="progress mt-3">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
            role="progressbar"
          >
            {Math.round(progress)}%
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>

      {/* Submitted Data Table */}
      {submittedData.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              {formFields.map((field) => (
                <th key={field.name}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {formFields.map((field) => (
                  <td key={field.name}>{data[field.name]}</td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicForm;
