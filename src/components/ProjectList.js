import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]); // Holds project data

  useEffect(() => {
    // Fetch projects data from the API
    axios.get('http://localhost:5000/api/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching project data:', error));
  }, []);

  return (
    <div className="project-list">
      <h2>Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project, index) => (
            <li key={index} className="project-item">
              <h3>{project.title}</h3>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ${project.budget}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

export default ProjectList;
