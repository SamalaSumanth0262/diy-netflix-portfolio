"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "./DIYPortfolioForm.css";

const schema = yup.object().shape({
  userId: yup.string().required(),
  name: yup.string().required(),
  bio: yup.string(),
  profileImage: yup.string().url(),
  topPicks: yup.array().of(yup.string()),
  skills: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      iconUrl: yup.string().url().required(),
    })
  ),
  projects: yup.array().of(
    yup.object().shape({
      title: yup.string().required(),
      description: yup.string(),
      imageUrl: yup.string().url(),
    })
  ),
  email: yup.string().email(),
  linkedin: yup.string().url(),
  github: yup.string().url(),
});

const DIYPortfolioForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userId: "",
      name: "",
      bio: "",
      profileImage: "",
      topPicks: Array(6).fill(""),
      skills: [{ name: "", iconUrl: "" }],
      projects: [{ title: "", description: "", imageUrl: "" }],
      email: "",
      linkedin: "",
      github: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://diy-netflix-portfolio-backend.vercel.app/api/createDatoCmsContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("🚀 ~ onSubmit ~ result:", result);

      if (result.success) {
        alert("✅ Portfolio created successfully!");
      } else {
        alert("⚠️ Something went wrong. Check console.");
        console.error(result.error);
      }
    } catch (error) {
      alert("❌ Error submitting form");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="diy-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="form-title">
          🎬 Create Your Netflix-Inspired Portfolio
        </h2>

        <section className="form-section">
          <h3>Basic Info</h3>
          <div className="form-grid">
            <input {...register("userId")} placeholder="Unique User ID" />
            <input {...register("name")} placeholder="Full Name" />
            <textarea {...register("bio")} placeholder="Short Bio" />
            <input
              {...register("profileImage")}
              placeholder="Profile Image URL"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>Top Picks</h3>
          <div className="form-grid">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                {...register(`topPicks.${index}`)}
                placeholder={`Top Pick ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="form-section">
          <h3>Skills</h3>
          <div className="form-grid">
            <input {...register(`skills.0.name`)} placeholder="Skill Name" />
            <input {...register(`skills.0.iconUrl`)} placeholder="Icon URL" />
          </div>
        </section>

        <section className="form-section">
          <h3>Projects</h3>
          <div className="form-grid">
            <input
              {...register(`projects.0.title`)}
              placeholder="Project Title"
            />
            <textarea
              {...register(`projects.0.description`)}
              placeholder="Project Description"
            />
            <input
              {...register(`projects.0.imageUrl`)}
              placeholder="Image URL"
            />
          </div>
        </section>

        <section className="form-section">
          <h3>Contact Info</h3>
          <div className="form-grid">
            <input {...register("email")} placeholder="Email" />
            <input {...register("linkedin")} placeholder="LinkedIn URL" />
            <input {...register("github")} placeholder="GitHub URL" />
          </div>
        </section>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "🚀 Creating Portfolio..." : "🚀 Create My Portfolio"}
        </button>
      </form>
    </div>
  );
};

export default DIYPortfolioForm;
