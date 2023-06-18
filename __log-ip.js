
const beforeConnect = () => {
    const { exec } = require('child_process');

    exec('curl ifconfig.me/ip', (error, stdout, _stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`exec 'curl ifconfig.me/ip' => stdout: "${stdout}"`);
    });
  };
  beforeConnect();