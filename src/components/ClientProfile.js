import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientProfile = () => {
  const [client, setClient] = useState(null); // Holds client data

  useEffect(() => {
    // Fetch client data from the API
    axios.get('http://localhost:5000/api/client')
      .then(response => setClient(response.data))
      .catch(error => console.error('Error fetching client data:', error));
  }, []);

  return (
    <div className="client-profile">
      <h1>Client Profile</h1>
      {client ? (
        <div>
          <p><strong>First Name:</strong> {client.firstName}</p>
          <p><strong>Last Name:</strong> {client.lastName}</p>
          <p><strong>Company Name:</strong> {client.companyName}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Company Number:</strong> {client.companyNumber}</p>
        </div>
      ) : (
        <p>Loading client data...</p>
      )}
    </div>
  );
};

export default ClientProfile;
