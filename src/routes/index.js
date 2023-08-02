const  { Router } = require('express');

const userRoutes = require('./user.routes');
const tagsRoutes = require('./tags.routes');
const notesRoutes = require('./notes.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/tags', tagsRoutes);
routes.use('/notes', notesRoutes);

module.exports = routes;