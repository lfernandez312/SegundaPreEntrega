const templatesController = require ('../controllers/product.controller');

const router = app => {
    app.use('/', templatesController)
}


module.exports = router;