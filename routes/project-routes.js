const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const { route } = require('.');
const router  = express.Router();

const Project = require('../models/project-model');
const Task = require('../models/task-model');


// Retrieve list of projects
router.get("/projects", (req, res, next) => {
    Project.find()
        .populate('tasks')
        .then( response => {
            res.json(response);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});


// Create new project
router.post("/projects", (req, res, next) => {
    Project.create({
        title: req.body.title,
        description: req.body.description,
        tasks: []
    })
    .then( response => {
        res.json(response);
    })
    .catch( err => {
        res.status(500).json(err);
    });
});


// Retrieve details of a specific project
router.get('/projects/:projectId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findById(req.params.projectId)
        .populate('tasks')
        .then( project => {
            res.json(project);
        })
        .catch( err => {
            res.status(500).json(err);
        });
});


// Update a project
router.put('/projects/:projectId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndUpdate(req.params.projectId, req.body)
        .then( () => {
            res.json({ message: `Project with ${req.params.projectId} is updated successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});


// Delete a project
router.delete('/projects/:projectId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndRemove(req.params.projectId)
        .then( () => {
            res.json({ message: `Project with ${req.params.projectId} is removed successfully.` });
        })
        .catch( err => {
            res.status(500).send(err);
        });
});


module.exports = router;