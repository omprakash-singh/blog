const mongoose = require('mongoose');
const app = require('./index');

const DB = 'mongodb://localhost:27017/DB-practice-8-passport';

mongoose.connect(DB, {
     useFindAndModify: true,
     useCreateIndex: true,
     useUnifiedTopology: true,
     useNewUrlParser: true
}).then(() => {
     console.log('DB connect sucessfully...');
}).catch((err) => {
     console.log(err);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
     console.log(`server start port at ${port}`);
});
