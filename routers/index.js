const coursesRouter = require('./courses');
const postsRouter = require('./posts');
const documentController = require('./document');
function route(app) {
    app.use("/api/posts", postsRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/api/document", documentController);
    app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;