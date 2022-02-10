function route(app) {
    app.use("/", (req, res) => res.send('hello'));
    
}

module.exports = route;