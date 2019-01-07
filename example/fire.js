const Fire = require('../index');
const fire = new Fire();
fire.start();
setTimeout(_ => fire.inc(15), 5000); // the fire is heating up
setTimeout(_ => fire.dec(5), 15000); // the fire goes out