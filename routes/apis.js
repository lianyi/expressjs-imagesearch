var express = require('express'),
    router = express.Router(),
    searchHistory = require('../model/schema'),
    Search = require('bing.search');

var search = new Search(process.env.BING_ACCOUNT_KEY);

router.get('/imagesearch/*?', function (req, res, next) {

    var term = req.params[0];
    if (!term) return res.json([]);
    var offset = (isNaN(req.query.offset) || req.query.offset === null || req.query.offset === undefined )
        ? 0 : req.query.offset * 10; // Multiplied by ten as search returns top ten results

    // Set up schema to create new document
    var newSearch = new searchHistory();
    newSearch.term = term;

    // Save the term
    newSearch.save(function (err) {
        if (err) return console.error(err);
        console.log('Search term "' + term + '" saved successfully');
    });

    // Perform Bing Search
    search.images(term, {top: 10, skip: offset}, function (err, results) {
            var arr = [];
            if (err) {
                return res.json(arr);
            } else {
                results.forEach(function (item) {
                    arr.push({
                        url: item.url,
                        title: item.title,
                        thumbnail: item.thumbnail.url,
                        context: item.sourceUrl
                    });
                });
                res.json(arr);
            }
        }
    );
});

router.get('/latest/imagesearch', function (req, res, next) {
    searchHistory.find({},
        {_id: 0, __v: 0}) //  Removes _id ,__v from json response
        .sort({when: -1}) // Sorts by when desc order
        .exec(function (err, docs) { // Executes callback
            if (err) {
                console.log('Unable to find documents');
                res.json(err);
            } else {
                res.json(docs);
            }
        });
});

module.exports = router;
