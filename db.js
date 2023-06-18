const mongoose = require('mongoose');

async function connectMongoose(uri) {
  const databaseName = 'personal-library';
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => console.log('Connected to ' + databaseName));

  const closeDatabase = () => {
    db.close().then(() => {
      console.log(
        `Mongoose disconnected from db: ${databaseName} on app termination`
      );
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => {
    console.log('Ctrl+C pressed in Terminal or got "SIGTERM"');
    closeDatabase();
  });
  process.on('SIGINT', () => {
    closeDatabase();
  });
}

module.exports = connectMongoose;
