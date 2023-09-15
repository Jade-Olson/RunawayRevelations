const mongoose = require("mongoose");
const dbName = "RunawayRevelationsDB";

mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`Connected to database: ${dbName}`))
    .catch(err => console.log(err));