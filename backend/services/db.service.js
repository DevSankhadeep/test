require("dotenv").config();
const mongo = require("mongoose");

const url = process.env.DB_URL;
 mongo.connect(url);
  
// find all
const findAllRecord = async (schema) => {
  const dbRes = await schema.find();
  return dbRes;
};
//find one 
const findOneRecord = async (query,schema) => {
  const dbRes = await schema.findOne(query);
  return dbRes;
};
// create new
const createNewRecord = async (data, schema) => {
  const dbRes = await new schema(data).save();
  return dbRes;
};

// update
const updateRecord = async (id, data, schema) => {
  const dbRes = await schema.findByIdAndUpdate(id, data, { new: true });
  return dbRes;
};

// delete
const deleteRecord = async (id, schema) => {
  const dbRes = await schema.findByIdAndDelete(id);
  return dbRes;
};

// ✅ Correct export
module.exports = {
  findAllRecord,
  createNewRecord,
  updateRecord,
  deleteRecord,
  findOneRecord
};  
