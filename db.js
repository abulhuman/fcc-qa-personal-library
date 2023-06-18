const mongoose = require('mongoose');

async function connectMongoose(uri) {
  const beforeConnect = () => {
    const { exec } = require('child_process');

    exec('curl ifconfig.me/ip', (error, stdout, _stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`exec 'curl ifconfig.me/ip' => stdout: "${stdout}"`);
      // console.error(`stderr: ${stderr}`);
    });
  };
  beforeConnect();
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

