import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProposalForm.css';

const ProposalForm = ({ projectId }) => {
  const freelancerId = localStorage.getItem('freelancerId'); // Fetch freelancerId from localStorage
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setStatusMessage('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('freelancerId', freelancerId);
    formData.append('projectId', projectId);
    formData.append('proposal', file);

    try {
      const response = await axios.post('http://localhost:5000/api/proposals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatusMessage('Proposal submitted successfully!');
    } catch (error) {
      console.error('Error submitting proposal:', error);
      setStatusMessage('Failed to submit the proposal.');
    }
  };

  return (
    <div>
      <h1>Submit Proposal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Proposal (PDF):</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit Proposal</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default ProposalForm;