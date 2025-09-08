require("dotenv").config();
const mongo = require("mongoose");

const url = process.env.DB_URL;
if (!url) {
  // Fail fast on missing configuration to avoid silent misconfigurations
  throw new Error("Missing DB_URL environment variable");
}

// Establish a resilient connection with recommended options
mongo
  .connect(url, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    retryWrites: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
  
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
