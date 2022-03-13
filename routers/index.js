const coursesRouter = require('./courses');
const postsRouter = require('./posts');

function route(app) {
    app.use("/api/posts", postsRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;