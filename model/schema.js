var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Connect to database
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);

var searchHistory = new Schema({
    term: String,
    when: String
});

searchHistory.pre('save', function (next) {
    // if when doesn't exist, assign the new date()
    this.when = this.when || new Date();
    next();
});

module.exports = mongoose.model('SearchHistory', searchHistory);