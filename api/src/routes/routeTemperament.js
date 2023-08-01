const { Router } = require ('express');

const router = Router();
const getTemperaments = require('../Controllers/getTemperaments');

router.get('/', getTemperaments)

module.exports = router