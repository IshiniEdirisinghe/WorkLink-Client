const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  proposalId: {
    type: String,
    required: true,
    unique: true,
  },
  freelancerId: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Proposal', ProposalSchema);
