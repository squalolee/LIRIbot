require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var userCommand = process.argv[2];
var userSearch = process.argv[3];

if (process.argv.length > 4) {
    for (var i = 4; i < process.argv.length; i++) {
        userSearch += "+" + process.argv[i];
    }
}

if (userCommand === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        userCommand = dataArr[0];
        userSearch = dataArr[1];
        liriSearch();
    })
}
else {
    liriSearch()
}

function liriSearch() {
    if (userCommand === "movie-this") {
        if (userSearch === undefined) {
            userSearch = "Mr. Nobody"
        };
        axios.get("http://www.omdbapi.com/?t=" + userSearch + "&apikey=trilogy").then(
            function (response) {
                //    * Title of the movie.
                console.log("Title: " + response.data.Title);
                //    * Year the movie came out.
                console.log("Release year: " + response.data.Year);
                //    * IMDB Rating of the movie.
                console.log("IMDB Rating: " + response.data.imdbRating);
                //    * Rotten Tomatoes Rating of the movie.
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                //    * Country where the movie was produced.
                console.log("Produced in: " + response.data.Country);
                //    * Language of the movie.
                console.log("Language: " + response.data.Language);
                //    * Plot of the movie.
                console.log("Plot: " + response.data.Plot);
                //    * Actors in the movie.
                console.log("Actors: " + response.data.Actors);

                var text = "Title: " + response.data.Title + ", " + "Release year: " + response.data.Year + ", " + "IMDB Rating: " + response.data.imdbRating + ", " + "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + ", " + "Produced in: " + response.data.Country + ", " + "Language: " + response.data.Language + ", " + "Plot: " + response.data.Plot + ", " + "Actors: " + response.data.Actors + "|";

                fs.appendFile("log.txt", text, function (err) {
                    console.log("------");
                    console.log("Successfully logged data!")
                });
            })
    };
    if (userCommand === "spotify-this-song") {
        if (userSearch === undefined) {
            userSearch = "The Sign"
        }
        spotify
            .search({ type: 'track', query: userSearch, limit: 1 })
            .then(function (response) {
                console.log("------");
                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Song: " + response.tracks.items[0].name);
                console.log("Preview: " + response.tracks.items[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);

                var text = "Artist: " + response.tracks.items[0].artists[0].name + ", " + "Song: " + response.tracks.items[0].name + ", " + "Preview: " + response.tracks.items[0].preview_url + ", " + "Album: " + response.tracks.items[0].album.name + "|";

                fs.appendFile("log.txt", text, function (err) {
                    console.log("------");
                    console.log("Successfully logged data!")
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    if (userCommand === "concert-this") {
        axios.get("https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp").then(
            function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    console.log("------");
                    console.log("Venue: " + response.data[i].venue.name);
                    console.log("Location: " + response.data[i].venue.location);
                    console.log("Date: " + moment(response.data[i].datetime).format('LL'));

                    var text = "Band: " + response.data[i].artist.name + ", " + "Venue: " + response.data[i].venue.name + ", " + "Location: " + response.data[i].venue.location + ", " + "Date: " + moment(response.data[i].datetime).format('LL') + "|";

                    fs.appendFile("log.txt", text, function (err) {
                        console.log("------");
                        console.log("Successfully logged data!")
                    });
                }
            })
    }
}