function index(req, res) {
    res.render('index', {
        name: 'John'
    });
};

exports.index = index;
