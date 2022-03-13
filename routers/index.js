const coursesRouter = require('./courses');

function route(app) {
    app.use("/api/courses", coursesRouter);
    app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;