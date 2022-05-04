const coursesRouter = require('./courses');
const postsRouter = require('./posts');
const profilesRouter = require('./profile');
const authRouter = require('./auth');
const notificationRouter = require('./notification');
const documentRouter = require('./document');
const searchController = require('./search')
const examController = require('./exam');
const articleRouter  = require('./article');
const typeCategoryRouter = require('./typeCategory');

function route(app) {
    app.use("/api/search", searchController)
    app.use("/api/posts", postsRouter);
    app.use("/api/courses", coursesRouter);
    app.use("/api/profiles", profilesRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/notification", notificationRouter);
    app.use("/api/document", documentRouter);
    app.use("/api/article", articleRouter);
    app.use("/api/exam", examController);
    app.use("/api/type-category", typeCategoryRouter);
    //app.use("/", (req, res) => res.send('hello'));
}

module.exports = route;