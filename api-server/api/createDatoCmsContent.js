export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    userId,
    name,
    bio,
    profileImage,
    topPicks,
    skills,
    projects,
    email,
    linkedin,
    github,
  } = req.body;

  const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN;
  const DATOCMS_API_URL = "https://graphql.datocms.com/";

  const mutation = `
    mutation CreateProfile {
      createProfile(data: {
        name: "${name}",
        bio: "${bio}",
        profileImage: "${profileImage}",
        userId: "${userId}",
        email: "${email}",
        linkedin: "${linkedin}",
        github: "${github}",
        topPicks: ${JSON.stringify(topPicks)}
      }) {
        id
        name
      }

      ${skills
        ?.map(
          (_, index) => `
        skill${index}: createSkill(data: { name: "${skills[index].name}", iconUrl: "${skills[index].iconUrl}", userId: "${userId}" }) {
          id
        }
      `
        )
        .join("\n")}

      ${projects
        ?.map(
          (_, index) => `
        project${index}: createProject(data: { title: "${projects[index].title}", description: "${projects[index].description}", imageUrl: "${projects[index].imageUrl}", userId: "${userId}" }) {
          id
        }
      `
        )
        .join("\n")}
    }
  `;

  try {
    const response = await fetch(DATOCMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DATOCMS_API_TOKEN}`,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("DatoCMS error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
