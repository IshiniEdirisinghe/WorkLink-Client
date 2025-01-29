import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectPage = () => {
  const { projectId } = useParams(); // Get projectId from URL
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch project details based on projectId
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
        setProjectDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details.');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Project Details</h1>
      {projectDetails ? (
        <div>
          <h2>{projectDetails.title}</h2>
          <p>{projectDetails.description}</p>
          <p>
            <strong>Budget:</strong> ${projectDetails.budget}
          </p>
          <p>
            <strong>Deadline:</strong> {projectDetails.deadline}
          </p>
        </div>
      ) : (
        <p>No details available for this project.</p>
      )}
    </div>
  );
};

export default ProjectPage;
