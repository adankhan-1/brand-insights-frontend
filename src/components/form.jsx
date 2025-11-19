import React, { useState } from "react";
import { useForm } from "react-hook-form";

const InsightForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false); // New state for metrics visibility
  const [metrics, setMetrics] = useState(null); // To store metrics from backend response

  const onSubmit = async (data) => {
    setSubmitError(null);
    setShowMetrics(false);
    try {
      const payload = {
        name: data.brandName,
        website: data.brandWebsite,
        email: data.contactEmail,
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      setSubmittedData(payload);
      setMetrics(result.visibilityMetrics); // Save metrics from response
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  if (submittedData) {
    return (
      <div className="confirmation">
        <h2>Submission Successful</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="48"
          height="48"
          className="size-6"
          style={{ color: "green", verticalAlign: "middle", marginLeft: 8 }}
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>

        <p>
          <strong>Brand Name:</strong> {submittedData.name}
        </p>
        <p>
          <strong>Brand Website:</strong> {submittedData.website}
        </p>
        <p>
          <strong>Contact Email:</strong> {submittedData.email}
        </p>

        <div className="confirmation-buttons">
          <button onClick={() => setShowMetrics((prev) => !prev)}>
            {showMetrics ? "Hide Visibility Metrics" : "See Visibility Metrics"}
          </button>
          <button className="secondary" onClick={() => setSubmittedData(null)}>
            Submit Another
          </button>
        </div>

        {showMetrics && metrics && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#05101b",
              color: "#bcbbbb",
              textAlign: "left",
              maxWidth: "400px",
            }}
          >
            <p>
              <strong>Search Score:</strong> {metrics.searchScore}
            </p>
            <p>
              <strong>Top Keywords:</strong> {metrics.topKeywords.join(", ")}
            </p>
            <p>
              <strong>Average Search Position:</strong>{" "}
              {metrics.averageSearchPosition}
            </p>
            <p>
              <strong>Page Load Speed:</strong> {metrics.pageLoadSpeed}
            </p>
            <p>
              <strong>Mobile Usability:</strong> {metrics.mobileUsability}
            </p>
            <p>
              <strong>Competitor Rank:</strong> {metrics.competitorRank}
            </p>
            <p>
              <strong>Brand Mentions:</strong> {metrics.brandMentions}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="form-container">
      <form className="brand-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Brand Insights Form</h1>

        <label htmlFor="brandName">Brand Name</label>
        <input
          id="brandName"
          {...register("brandName", {
            required: "Brand Name is required",
            maxLength: 50,
          })}
          placeholder="Enter Brand Name"
        />
        {errors.brandName && (
          <p className="error">{errors.brandName.message}</p>
        )}

        <label htmlFor="brandWebsite">Brand Website</label>
        <input
          id="brandWebsite"
          type="url"
          {...register("brandWebsite", {
            required: "Brand Website is required",
            pattern: {
              value: /^(https?:\/\/|www\.)[^\s]+(\.[a-z]{2,})(\/[^\s]*)?$/i,
              message: "Enter a valid URL",
            },
          })}
          placeholder="https://example.com"
        />
        {errors.brandWebsite && (
          <p className="error">{errors.brandWebsite.message}</p>
        )}

        <label htmlFor="contactEmail">Contact Email</label>
        <input
          id="contactEmail"
          type="email"
          {...register("contactEmail", {
            required: "Contact Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          placeholder="user@example.com"
        />
        {errors.contactEmail && (
          <p className="error">{errors.contactEmail.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {submitError && <p className="error submit-error">{submitError}</p>}
      </form>
    </div>
  );
};

export default InsightForm;