try {
    use("movieStore");

    db.getCollection("movies").drop();
    // create a new collection called "movies"
    db.createCollection(
        "movies", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["title", "director", "year", "genre"],
                properties: {
                    title: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    director: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    year: {
                        bsonType: "int",
                        description: "must be an integer and is required"
                    },
                    genre: {
                        enum: ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller", "Western", "Sci-Fi"],
                        description: "can only be one of the enum values and is required"
                    },
                    boxOfficeAmount: {
                        bsonType: "double",
                        description: "must be a double and is required"
                    }
                }
            }
        },
        "validationLevel": "strict",
        "validationAction": "warn"
    }
    );

    // insert a few documents into the movies collection

    db.getCollection("movies").insertMany([

        {
            title: "The Shawshank Redemption",
            director: "Frank Darabont",
            year: 1994,
            genre: "drama",
            boxOfficeAmount: 912.8
        },
        {
            title: "Pulp Fiction",
            director: "Quentin Tarantino",
            year: 1994,
            genre: "crime",
            boxOfficeAmount: 936.7
        },
        {
            title: "The Godfather",
            director: "Francis Ford Coppola",
            year: 1972,
            genre: "crime",
            boxOfficeAmount: 916.6
        },
        {
            title: "Inception",
            director: "Christopher Nolan",
            year: 2010,
            genre: "action",
            boxOfficeAmount: 81.2
        }

    ]);

    // Define 10 normal genres
    const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller", "Western", "Sci-Fi"];

    // Generate 300 movie documents
    const moviesList = [];
    for (let i = 1; i <= 300; i++) {
        moviesList.push({
            title: `Movie Title ${i}`,
            director: `Director ${i}`,
            year: 2000 + (i % 21), // Random year between 2000 and 2020
            genre: genres[i % genres.length], // Pick genre from the defined genres
            boxOfficeAmount: parseFloat((Math.random() * 14000).toFixed(2)) // Random box office amount
        });
    }

    // Insert 300 documents into the movies collection
    db.getCollection("movies").insertMany(moviesList);

    // create a actor collection
    db.getCollection("actors").drop();
    db.createCollection(
        "actors", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "dob", "country"],
                properties: {
                    name: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    dob: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    },
                    country: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    isProducer: {
                        bsonType: "bool",
                        description: "must be a boolean",

                    }
                }
            },
        },
        "validationLevel": "strict",
        "validationAction": "warn"
    });

    // insert a few documents into the actors collection
    db.getCollection("actors").insertMany([
        {
            name: "Morgan Freeman",
            dob: new Date("1937-06-01"),
            country: "USA",
            isProducer: false
        },
        {
            name: "Tim Robbins",
            dob: new Date("1958-10-16"),
            country: "USA",
            isProducer: false
        },
        {
            name: "Bruce Willis",
            dob: new Date("1955-03-19"),
            country: "USA",
            isProducer: true
        },
        {
            name: "Samuel L. Jackson",
            dob: new Date("1948-12-21"),
            country: "USA",
            isProducer: true
        }
    ]);


    const actors = [];
    for (let i = 1; i <= 32; i++) {
        actors.push({
            name: `Actor ${i}`,
            dob: new Date(1970 + (i % 30), i % 12, i % 28), // Random DOB between 1970 and 1999
            country: `Country ${i % 5}`, // Random country between Country 0 and Country 4
            isProducer: i % 4 === 0 // Every third actor is a producer
        });
    }

    // Insert 25 documents into the actors collection
    db.getCollection("actors").insertMany(actors);


    db.getCollection("actorAndProducer").drop();
    db.createCollection(
        "actorAndProducer", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["producerActor", "producedMovie", "isReleased"],
                properties: {
                    producerActor: {
                        bsonType: "objectId",
                        description: "must be a string and is required"
                    },
                    producedMovie: {
                        bsonType: "objectId",
                        description: "must be a date and is required"
                    },
                    isReleased: {
                        bsonType: "bool",
                        description: "must be a boolean"
                    },
                    releaseDate: {
                        bsonType: "date",
                        description: "must be a date"
                    }

                }
            },
        },
        "validationLevel": "strict",
        "validationAction": "warn"
    });

    // insert a few documents into the actorAndProducer collection

    // Dynamically associate producers with movies
    const actorsCursor = db.getCollection("actors").find({ isProducer: true });
    const moviesCursor = db.getCollection("movies").find();
    const movies = moviesCursor.toArray();
    const actorItems = actorsCursor.toArray();



    for (let i = 0; i < 128; i++) {
        // Pick a random movie for each producer
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const randomActor = actorItems[Math.floor(Math.random() * actorItems.length)];
        const isReleased = Math.random() > 0.5; // Randomly decide if released
        const releaseDate = isReleased ? new Date(Date.now() - Math.floor(Math.random() * 10000000000 * (115))) : null;
        // console.log(randomActor._id, randomMovie._id, releaseDate, randomMovie, randomActor);
        const item = db.getCollection("actorAndProducer").findOne({
            producerActor: randomActor._id,
            producedMovie: randomMovie._id,
        });
        if (item) {
            item.producerActor = randomActor._id;
            item.producedMovie = randomMovie._id;
            item.isReleased = isReleased;
            item.releaseDate = releaseDate;
            db.getCollection("actorAndProducer").updateOne({
                producerActor: randomActor._id,
                producedMovie: randomMovie._id,
            }, {
                $set: item
            });
        } else {
            db.getCollection("actorAndProducer").insertOne({
                producerActor: randomActor._id,
                producedMovie: randomMovie._id, // Movie's ObjectId
                isReleased: isReleased,
                releaseDate: releaseDate
            });
        }
    }

    console.log("Finished populating actorAndProducer collection.");


    // Perform an aggregation to get the producer details and movie details

    // db.getCollection("actorAndProducer").aggregate([
    //     {
    //         $lookup: {
    //             from: "actors",
    //             localField: "producerActor",
    //             foreignField: "_id",
    //             as: "producerDetails"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "movies",
    //             localField: "producedMovie",
    //             foreignField: "_id",
    //             as: "movieDetails"
    //         }
    //     },

    //     {
    //         $match: { "producerDetails.isProducer": true }
    //     },



    //     {
    //         $project: {
    //             producerDetails: 1,
    //             movieDetails: 1,
    //             isReleased: 1,
    //             releaseDate: 1
    //         }
    //     }
    // ]);

    console.log("Finished performing aggregation.");
    // perform the aggregation with the actors collection with produced movies;
    // 
    console.log("=================[start -> actors collection with produced movies]===============");
    db.getCollection("actors").aggregate([
        {
            $match: { "isProducer": true }
        },
        {
            $lookup: {
                from: "actorAndProducer",
                localField: "_id",
                foreignField: "producerActor",
                as: "producerDetails"
            }
        },
        {
            $lookup: {
                from: "actorAndProducer",
                localField: "_id",
                foreignField: "producerActor",
                as: "movieDetails"
            }
        },

        {
            $project: {
                name: 1,
                dob: 1,
                country: 1,
                producerDetails: 1,
                numberOfMoviesProducer: {
                    $size: "$producerDetails"
                }
            }
        }
    ]).forEach(printjson);
    console.log("================[end -> actors collection with produced movies]================");


    // Perform an aggregation to get the number of movies produced by genre
    console.log("=================[start -> number of movies produced by genre]===============");
    db.getCollection("movies").aggregate([
        {
            $lookup: {
                from: "actorAndProducer",
                localField: "_id",
                foreignField: "producedMovie",
                as: "producerDetails"
            }
        },
        {
            $unwind: "$producerDetails"
        },
        {
            $group: {
                _id: "$genre",
                numberOfMoviesProduced: { $sum: 1 }
            }
        },
        {
            $sort: { numberOfMoviesProduced: -1 }
        }
    ]).forEach(printjson);
    console.log("==================[end -> number of movies produced by genre]==============");

    // Perform an aggregation to get the average age of actors
    console.log("=================[start -> number of movies produced by genre]===============");

    db.getCollection("actors").aggregate([
        {
            $group: {
                _id: null,
                averageAge: {
                    $avg: {
                        $subtract: [
                            { $year: new Date() },
                            { $year: "$dob" }
                        ]
                    }
                }
            }
        }
    ]).forEach(printjson);
    console.log("================[end -> number of movies produced by genre]================");


    // perform the aggregation with the actors collection with produced movies include box-office amounts;
    console.log("=================[start -> actors collection with produced movies with box-office amounts]===============");
    db.getCollection("actors").aggregate([
        {
            $match: { "isProducer": true }
        },
        {
            $lookup: {
                from: "actorAndProducer",
                localField: "_id",
                foreignField: "producerActor",
                as: "producedMovies"
            }
        },
        {
            $unwind: "$producedMovies"
        },
        {
            $lookup: {
                from: "movies",
                localField: "producedMovies.producedMovie",
                foreignField: "_id",
                as: "movieDetails"
            }
        },
        {
            $unwind: "$movieDetails"
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                dob: { $first: "$dob" },
                country: { $first: "$country" },
                totalBoxOfficeAmount: { $sum: "$movieDetails.boxOfficeAmount" },
                numberOfMoviesProduced: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                dob: 1,
                country: 1,
                totalBoxOfficeAmount: 1,
                numberOfMoviesProduced: 1
            }
        }
    ]).forEach(printjson);
    console.log("================[end -> actors collection with produced movies with box-office amounts]================");

    console.log("=================[start -> movies produced grouped by genres and producers]===============");
    db.getCollection("actors").aggregate([
        {
            $match: { "isProducer": true } // Filter only producers
        },
        {
            $lookup: {
                from: "actorAndProducer", // Join with actorAndProducer
                localField: "_id",
                foreignField: "producerActor",
                as: "producedMovies"
            }
        },
        {
            $unwind: "$producedMovies" // Flatten the array of produced movies
        },
        {
            $lookup: {
                from: "movies", // Join with movies to get movie details
                localField: "producedMovies.producedMovie",
                foreignField: "_id",
                as: "movieDetails"
            }
        },
        {
            $unwind: "$movieDetails" // Flatten the movie details
        },
        {
            $group: {
                _id: {
                    producerId: "$_id", // Group by producer
                    producerName: "$name",
                    genre: "$movieDetails.genre" // Group by genre
                },
                totalBoxOfficeAmount: { $sum: "$movieDetails.boxOfficeAmount" }, // Total box office for genre
                numberOfMoviesProduced: { $sum: 1 } // Total movies produced for genre
            }
        },
        {
            $group: {
                _id: {
                    producerId: "$_id.producerId", // Final grouping by producer
                    producerName: "$_id.producerName"
                },
                genres: {
                    $push: {
                        genre: "$_id.genre",
                        totalBoxOfficeAmount: "$totalBoxOfficeAmount",
                        numberOfMoviesProduced: "$numberOfMoviesProduced"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                producerId: "$_id.producerId",
                producerName: "$_id.producerName",
                genres: 1
            }
        }
    ]).forEach(printjson);
    console.log("================[end -> movies produced grouped by genres and producers]================");






} catch (error) {
    console.error(error);
}

