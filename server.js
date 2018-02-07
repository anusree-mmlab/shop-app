const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log('server listens on '+process.env.PORT);
});
