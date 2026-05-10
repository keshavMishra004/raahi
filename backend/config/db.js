const mongoose = require('mongoose');

exports.connect = () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/raahi_dashboard';
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connect error', err);
      process.exit(1);
    });
};
