const mongoose = require('mongoose');
const Material = require('./models/material');

mongoose.connect('mongodb://127.0.0.1:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleMaterial = new Material({
  name: 'Sample Material',
  price: 10.99,
  state: 'Sample State',
  qty: 100,
  created_on: '2023-10-01',
});

sampleMaterial.save((err) => {
  if (err) {
    console.error('Error inserting sample material:', err);
  } else {
    console.log('Sample material inserted successfully.');
  }
  mongoose.connection.close();
});
