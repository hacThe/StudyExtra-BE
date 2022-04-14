const coursesRouter = require('./courses');
const postsRouter = require('./posts');
const profilesRouter = require('./profile');
const authRouter = require('./auth');
const notificationRouter = require('./notification');
const documentController = require('./document');
const searchController = require('./search')
const examController = require('./exam');

function route(app) {W
    app.use("/api/search", searchController)
    app.use("/api/posts", postsRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/api/profiles", profilesRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/notification", notificationRouter);
    app.use("/api/document", documentController);
    app.use("/api/exam", examController);

    //app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;