const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//exists
const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.foundDish = foundDish;
    next();
  }
  next({
    status: 404,
    message: `Dish with id ${dishId} does not exist.`,
  });
};

//verify dish, pass all criteria
const verifyDish = (req, res, next) => {
  const {
    data: { name, description, price, image_url },
  } = req.body;
  //name missin or empty
  if (!name || name == "")
    return next({ status: 400, message: "Dish must include a name" });
  //desc missing or empty
  if (!description || description == "")
    return next({ status: 400, message: "Dish must include a description" });
  //price not specified at all
  if (!price)
    return next({ status: 400, message: "Dish must include a price" });
  //price added, but is either zero or not a number
  if (typeof price !== "number" || price <= 0)
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  //image url is empty or missing
  if (!image_url || image_url == "")
    return next({ status: 400, message: "Dish must include an image_url" });
  else {
    //object as a whole
    res.locals.newDish = {
      id: nextId(),
      name: name,
      description: description,
      price: price,
      image_url: image_url,
    };
    next();
  }
};

//create
const create = (req, res, next) => {
  dishes.push(res.locals.newDish);
  res.status(201).json({ data: res.locals.newDish });
};

//read
const read = (req, res, next) => {
  res.json({ data: res.locals.foundDish });
};

//list
const list = (req, res, next) => {
  res.json({ data: dishes });
};

//update
const update = (req, res, next) => {
  const originalDish = res.locals.foundDish;
  const {
    data: { id, name, price, description, image_url },
  } = req.body;
  //if ID exists but does not match current dishId
  if (id && id !== req.params.dishId)
    return next({
      status: 400,
      message: `Dish id ${id} does not match dish id ${req.params.dishId}`,
    });
  
  //object as a whole
  res.locals.foundDish = {
    id: originalDish.id,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  res.json({ data: res.locals.foundDish });
};

module.exports = {
  dishExists,
  list,
  create: [verifyDish, create],
  read: [dishExists, read],
  update: [dishExists, verifyDish, update],
};