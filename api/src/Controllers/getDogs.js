const axios = require('axios')
const { API_KEY } = process.env;
const { temperament, Dog } = require('../db');


module.exports = async(req, res)=>{   // trae los perros creados los cuales estan en la base de datos
    try {
      const DogsDbRaw = await Dog.findAll({
        include: [{
          model: temperament,
          attributes: ['name'],
          through: {
            attributes: []  // tabla intermedia vacia
          }
        }] 
      })

      const DogsDb = DogsDbRaw.map(dog => {
        return {
            id: dog.dataValues.id,
            name: dog.dataValues.name,
            height: dog.dataValues.height,
            weight: dog.dataValues.weight,
            life_span: dog.dataValues.life_span,
            image: dog.dataValues.image,
            temperament: dog.dataValues.temperaments.map(temp => temp.name)
        }
      })
      console.log(DogsDb)

        //Llamado de axios a la url el cual tare todas las razas de perros al home de la api
        const response = (await axios(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)).data;
        //Formateo la respuesta para para coincidir con la data 
        const apiDogs = response.map(dog =>{
          return {
            id: dog.id,
            name: dog.name,
            image: dog.image.url,
            temperament: dog.temperament ? dog.temperament.split(", ") : [],
            life_span: dog.life_span,
            height: dog.height.metric,
            weight: dog.weight.metric
          };
        })
        
        res.status(200).json([...DogsDb, ...apiDogs]); // concatena los creados con los llamados de la api
      } catch (error) {
        res.status(404).json({ error: error.message });
    }
  
}  