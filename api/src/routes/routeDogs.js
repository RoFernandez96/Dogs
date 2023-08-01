
const { Router } = require ('express')

const Dogrouter = Router();

const getDogByIdBreeds = require("../Controllers/getDogByIdBreeds");
const createDogs = require("../controllers/createDogs");
const getDogName = require("../Controllers/getDogName");
const getDogs = require("../controllers/getDogs");


Dogrouter.post("/", createDogs);

Dogrouter.get("/", getDogs);
Dogrouter.get("/search", getDogName);
Dogrouter.get("/:id", getDogByIdBreeds);



module.exports = Dogrouter;
