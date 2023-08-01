const { temperament } = require ('../db');

const getTemperaments = async (req, res) => {
    try {
        const allTemperaments = await temperament.findAll();
        res.status(200).json(allTemperaments);

    } catch (error) {
        res.status(400).json({error: error.message });
    }
};

module.exports = getTemperaments;