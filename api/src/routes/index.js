const { Router } = require('express');
const routeDogs = require ('./routeDogs');
const routeTemperament = require('./routeTemperament');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/dogs', routeDogs);
router.use('/temperaments', routeTemperament)


module.exports = router;
