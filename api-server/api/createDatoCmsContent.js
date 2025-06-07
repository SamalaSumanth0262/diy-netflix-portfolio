const fetch = require('node-fetch');

const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN;
const DATOCMS_API_URL = 'https://graphql.datocms.com/';
const DATOCMS_ENV = process.env.DATOCMS_ENV || 'main';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const { userId, name, bio, profileImage, topPicks, skills, projects, email, linkedin, github } = data;

  const mutation = `
    mutation CreateProfile($data: CreateProfileInput!, $skills: [CreateSkillInput!], $projects: [CreateProjectInput!]) {
      createProfile(data: $data) {
        id
        name
      }

      ${skills?.map((_, index) => `
        skill${index}: createSkill(data: { name: "${skills[index].name}", iconUrl: "${skills[index].iconUrl}", userId: "${userId}" }) {
          id
        }
      `).join('\n')}

      ${projects?.map((_, index) => `
        project${index}: createProject(data: { title: "${projects[index].title}", description: "${projects[index].description}", imageUrl: "${projects[index].imageUrl}", userId: "${userId}" }) {
          id
        }
      `).join('\n')}
    }
  `;

  const variables = {
    data: {
      name,
      bio,
      profileImage,
      userId,
      email,
      linkedin,
      github,
      topPicks,
    }
  };

  try {
    const response = await fetch(DATOCMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DATOCMS_API_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result }),
    };
  } catch (error) {
    console.error('DatoCMS error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
