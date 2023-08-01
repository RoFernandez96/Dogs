const { Op } = require('sequelize');
const axios = require('axios');
const { temperament, Dog } = require('../db');
const { API_KEY } = process.env;



module.exports = async (req, res) => {
  
    if (req.query.name) {
      
      const name = req.query.name.toLowerCase();
      try {
        const SearchByNameDbRaw = await Dog.findAll({
          attributes: ['id', 'image', 'name', "weight"],
          include: [{
            model: temperament,
            attributes: ['name'],
            through: {
              attributes: []
            }
          }],
          where: {
            name: {
              [Op.like]: `%${name}%`
            }
          }
        });

        const SearchByNameDb = SearchByNameDbRaw?.map(dog => {
          return {
              id: dog.dataValues.id,
              name: dog.dataValues.name,
              height: dog.dataValues.height,
              weight: dog.dataValues.weight,
              life_span: dog.dataValues.life_span,
              image: dog.dataValues.image,
              temperament: dog.dataValues.temperaments?.map(temp => temp.name)
          }
        })
        //Respuesta de la ruta en caso de encontrar en base de datos
        if(SearchByNameDb.length > 0){
          return res.status(200).json(SearchByNameDb);
        }
        ////API
        const allResponse = (await axios(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)).data
        const response = (await axios(`https://api.thedogapi.com/v1/breeds/search?api_key=${API_KEY}&q=${name}`)).data
        const apiSearchByName = response.map (b =>{
          const foundImage = allResponse.find(br => br.reference_image_id === b.reference_image_id)
          return{
            id: b.id,
          name: b.name,
          image: foundImage ? foundImage.image.url : "https://img2.freepng.es/20180330/qge/kisspng-dog-puppy-silhouette-clip-art-bone-dog-5abe49d6e6fc19.0846729215224201829461.jpg",
          weight: b.weight.metric,
          temperament: b.temperament ? b.temperament.split(", ") : [],
          }
          
        })
        
        res.status(200).json([...SearchByNameDb, ...apiSearchByName]); 
      } catch (error) {
        
        res.status(404).json({ error: error.message });
      }
    }
    else {
      res.status(400).json({error: "Bad request"});
    } 
  };