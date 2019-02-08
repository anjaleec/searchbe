
var controller = require('../controllers/searchController');

const routes = (app) => {

    app.route('/search')

        .get(controller.searchget)

}

module.exports = routes;