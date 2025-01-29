import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProposalForm from './ProposalForm';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (err) {
        setError('');// set error to empty string
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  // Fallback for hardcoded projects (remove for production)
  const fallbackProjects = [
    { _id: '1', title: 'Sample Project A', description: 'Description A' },
    { _id: '2', title: 'Sample Project B', description: 'Description B' },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <div className="project-list">
      <h1>Available Projects</h1>
      {error && <p className="error-message">{error}</p>}
      
      <div>
        {displayProjects.map((project) => (
          <div key={project._id} className="project-item">
            <div>
              <strong>{project.title}</strong>
              <p>{project.description}</p>
            </div>
            <button onClick={() => setSelectedProject(project._id)}>
              Submit Proposal
            </button>
          </div>
        ))}
      </div>

      {selectedProject && <ProposalForm projectId={selectedProject} />}
    </div>
  );
};

export default ProjectList;
