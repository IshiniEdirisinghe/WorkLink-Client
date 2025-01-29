const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Proposal = require('../models/Proposal');
const Notification = require('../models/Notification');
const Project = require('../models/Project');
const Freelancer = require('../models/Freelancer');

const router = express.Router(); 

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    // Hardcoded project
    const hardcodedProjects = [
      {
        _id: '64d9b2e2e4a8c5f8541e6e50',
        title: 'Website Development',
        description: 'Create a responsive e-commerce website for a local business.',
        clientId: '64d9b2e2e4a8c5f8541e6d99',
        budget: 500,
        deadline: '2025-02-10',
      },
      {
        _id: '64d9b2e2e4a8c5f8541e6e51',
        title: 'Mobile App Design',
        description: 'Design a sleek and modern UI for a fitness tracker app.',
        clientId: '64d9b2e2e4a8c5f8541e6d100',
        budget: 700,
        deadline: '2025-03-01',
      },
    ];

    res.json(hardcodedProjects); // Send the hardcoded projects as a response
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});


// Fetch a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ error: 'Error fetching project details' });
  }
});

// Fetch projects along with associated proposals
router.get('/with-proposals', async (req, res) => {
  try {
    const projectsWithProposals = await Project.aggregate([
      {
        $lookup: {
          from: 'proposals', // Collection name for proposals
          localField: '_id', // Field in Project
          foreignField: 'projectId', // Field in Proposal
          as: 'proposals',
        },
      },
    ]);

    res.json(projectsWithProposals);
  } catch (error) {
    console.error('Error fetching projects with proposals:', error);
    res.status(500).json({ error: 'Error fetching projects with associated proposals' });
  }
});

// Proposal submission route
router.post('/', upload.single('proposal'), async (req, res) => {
  try {
    const { freelancerId, projectId } = req.body;

    if (!freelancerId || !projectId) {
      return res.status(400).json({ error: 'freelancerId and projectId are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const proposalId = uuidv4();
    const newProposal = new Proposal({
      proposalId,
      freelancerId,
      projectId,
      filePath: req.file.path,
    });

    await newProposal.save();

    const project = await Project.findById(projectId).select('title clientId');
    const freelancer = await Freelancer.findById(freelancerId).select('firstName lastName');

    if (!project || !freelancer) {
      return res.status(404).json({ error: 'Project or Freelancer not found' });
    }

    const notification = new Notification({
      clientId: project.clientId,
      message: `${freelancer.firstName} ${freelancer.lastName} has submitted a proposal for your project "${project.title}".`,
      proposalId: newProposal._id,
      projectId,
    });

    await notification.save();

    res.status(201).json({ message: 'Proposal submitted successfully and notification sent.', proposalId });
  } catch (error) {
    console.error('Error saving proposal or generating notification:', error);

    if (error instanceof multer.MulterError) {
      return res.status(500).json({ error: 'File upload error' });
    }

    res.status(500).json({ error: 'Failed to submit the proposal.' });
  }
});

// Get notifications for a client
router.get('/notifications', async (req, res) => {
  try {
    const clientId = req.user._id; // Assume client ID comes from authentication middleware
    const notifications = await Notification.find({ clientId });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications.' });
  }
});

// Handle notification actions (view proposal, accept, or reject)
router.post('/notifications/:id', async (req, res) => {
  try {
    const { action } = req.body;
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    const proposal = await Proposal.findById(notification.proposalId);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found.' });
    }

    const freelancerId = proposal.freelancerId;

    if (action === 'accept') {
      proposal.status = 'accepted';
      await proposal.save();

      const freelancerNotification = new Notification({
        clientId: freelancerId,
        message: `Your proposal for the project "${notification.message}" has been accepted.`,
      });
      await freelancerNotification.save();
    } else if (action === 'reject') {
      proposal.status = 'rejected';
      await proposal.save();

      const freelancerNotification = new Notification({
        clientId: freelancerId,
        message: `Your proposal for the project "${notification.message}" has been rejected.`,
      });
      await freelancerNotification.save();
    } else if (action === 'view') {
      return res.json({ proposal });
    } else {
      return res.status(400).json({ error: 'Invalid action.' });
    }

    await notification.delete();

    res.json({ message: `Proposal ${action}ed successfully.` });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Error updating notification.' });
  }
});

// Error handling middleware for invalid file uploads
router.use((err, req, res, next) => {
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;


