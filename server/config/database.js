const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/apollo-app';

mongoose.connect(DB_URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log('Successfully connected to MongoDB'));
mongoose.connection.on('error', error => console.error(error));

module.exports = mongoose;
