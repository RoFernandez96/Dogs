const axios = require('axios')
const { API_KEY } = process.env;
const { temperament, Dog } = require('../db');
const isUUID = require ('../utils/isUUID')


module.exports = async (req, res) => {
    const {id} = req.params;
    //Comprobando si 'id' es o no un UUID para buscar en base de datos o en API
    if (isUUID(id)){
        try{
            const DogByIdDbRaw = await Dog.findByPk(id, {
                include: [{
                  model: temperament,
                  attributes: ['name'],
                  through: {
                    attributes: []  
                  }
                }] 
        })
        if (!DogByIdDbRaw) throw new Error('Dog not found!') // formatea la data para que llegue igual que los datos de la api
          const DogByIdDb = {
            id: DogByIdDbRaw.dataValues.id,
            name: DogByIdDbRaw.dataValues.name,
            height: DogByIdDbRaw.dataValues.height,
            weight: DogByIdDbRaw.dataValues.weight,
            life_span: DogByIdDbRaw.dataValues.life_span,
            image: DogByIdDbRaw.dataValues.image,
            temperament: DogByIdDbRaw.dataValues.temperaments.map(t => t.name)
            
          }
          
        res.status(200).json(DogByIdDb);
    }   catch(error){
        res.status(404).json({ error: error.message });
    }
        }else {
        try {
      const response = (await axios(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)).data;
      const apiFind = response.find(b => b.id == id)
      const apiDog = {                               // organiza todos los datos traidos del response de "apiFind"
        id: apiFind.id,
        name: apiFind.name,
        image: apiFind.image 
          ? apiFind.image.url
          : "https://img2.freepng.es/20180330/qge/kisspng-dog-puppy-silhouette-clip-art-bone-dog-5abe49d6e6fc19.0846729215224201829461.jpg",
        temperament: apiFind.temperament ? apiFind.temperament.split(", ") : [],
        life_span: apiFind.life_span,
        height: apiFind.height.metric,
        weight: apiFind.weight.metric
      };
      res.status(200).json(apiDog);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}