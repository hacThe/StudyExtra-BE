const coursesRouter = require('./courses');
const postsRouter = require('./posts');
const profilesRouter = require('./profile');
const authRouter = require('./auth');

function route(app) {
    app.use("/api/posts", postsRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/api/profiles", profilesRouter);
    app.use("/api/auth", authRouter);
    //app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;