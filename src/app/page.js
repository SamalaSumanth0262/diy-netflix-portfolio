'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import './DIYPortfolioForm.css';

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
      userId: '',
      name: '',
      bio: '',
      profileImage: '',
      topPicks: Array(6).fill(''),
      skills: [{ name: '', iconUrl: '' }],
      projects: [{ title: '', description: '', imageUrl: '' }],
      email: '',
      linkedin: '',
      github: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Submitted data:', data);
    // TODO: POST to Netlify function or your backend to save in DatoCMS
  };

  return (
    <div className="form-container">
      <form className="diy-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="form-title">🎬 Create Your Netflix-Inspired Portfolio</h2>

        <section className="form-section">
          <h3>Basic Info</h3>
          <div className="form-grid">
            <input {...register('userId')} placeholder="Unique User ID" />
            <input {...register('name')} placeholder="Full Name" />
            <textarea {...register('bio')} placeholder="Short Bio" />
            <input {...register('profileImage')} placeholder="Profile Image URL" />
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
            <input {...register(`projects.0.title`)} placeholder="Project Title" />
            <textarea {...register(`projects.0.description`)} placeholder="Project Description" />
            <input {...register(`projects.0.imageUrl`)} placeholder="Image URL" />
          </div>
        </section>

        <section className="form-section">
          <h3>Contact Info</h3>
          <div className="form-grid">
            <input {...register('email')} placeholder="Email" />
            <input {...register('linkedin')} placeholder="LinkedIn URL" />
            <input {...register('github')} placeholder="GitHub URL" />
          </div>
        </section>

        <button type="submit" className="submit-button">🚀 Create My Portfolio</button>
      </form>
    </div>
  );
};

export default DIYPortfolioForm;
