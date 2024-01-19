import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose, { now } from 'mongoose'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 3003

app.listen(port, () => {
    console.log (`listening on port: ${port}`)
})

mongoose.connect(process.env.DATABASE_URL)

const journeySchema = new mongoose.Schema({
    CountryName: String,
    date: Date,
    Hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    Flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight'
    },
})

const hotelSchema = new mongoose.Schema({
    name: String,
    link: String,
    address: String,
    durationofStay: Number,
    roomtype: String
})

const flightSchema = new mongoose.Schema({
    airline: String,
    departureFrom: String,
    departureTime: String,
    arrivalTo: String,
    arrivalTime: String
})

const essentialSchema = new mongoose.Schema({
    title: String
})

const userSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    }
})

// const userSchema = new mongoose.Schema({
//     userEmail: {
//         type: String,
//         required: true
//     },
//     lastLogin: {
//         type: Date,
//         required: true
//     }
// })

app.get('/', (req,res) => {
  res.json({message: "Server running"})
})

const Journey = mongoose.model('Journey', journeySchema)
const Flight = mongoose.model('Flight', flightSchema)
const Hotel = mongoose.model('Hotel', hotelSchema)
const Essentials = mongoose.model('Essentials', essentialSchema)
const User = mongoose.model('user', userSchema)

app.get('/journey', async (req, res) => {
    try {
        const journeys = await Journey.find({}).populate('Hotel').populate('Flight');
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/hotel', async (req,res) => {
    const newhotel = await Hotel.find({})
    res.json(newhotel)
})

app.get('/flight', async (req,res) => {
    const newflight = await Flight.find({})
    res.json(newflight)
})

app.get('/essentials', async (req,res) => {
    const newessential = await Essentials.find({})
    res.json(newessential)
})

app.post('/journey/new', async (req, res) => {
    try {
        const { journey, flight, hotel } = req.body;
        console.log(req.body)
        const newFlight = new Flight(flight);
        await newFlight.save();

        const newHotel = new Hotel(hotel);
        await newHotel.save();

        const newJourney = new Journey({
            ...journey,
            Flight: newFlight._id,
            Hotel: newHotel._id
        });

        await newJourney.save();
        res.status(200).json(newJourney);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/journey/:id', async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id).populate('Hotel').populate('Flight');
        res.json(journey);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.delete('/journey/:id', (req, res) => {
    Journey.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.put('/journey/:id', (req, res) => {
    const updatedData = req.body;

    Journey.updateOne({"_id": req.params.id}, updatedData)
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.post('/hotel/new', (req, res) => {
    const hotelData = req.body;
    const myHotel = new Hotel({
        name: hotelData.name,
        link: hotelData.link,
        address: hotelData.address,
        durationofStay: hotelData.durationofStay,
        roomtype: hotelData.roomtype
    });

    myHotel.save()
    .then(() => {
        console.log(`New hotel ${hotelData.name}, was added to the database`);
        res.status(200).json({ message: 'Hotel added successfully', hotelId: myHotel._id });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: error.message });
    });
});

app.get('/hotel/:id', async (req, res) => {
    const hotel = await Hotel.findById(req.params.id)
    console.log(hotel)
    res.json(hotel)
})

app.delete('/hotel/:id', (req, res) => {
    Hotel.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    }) 
})

app.put('/hotel/:id', (req, res) => {
    Hotel.updateOne({"_id": req.params.id}, {})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.post('/flight/new', (req, res) => {
     const flightData = req.body;
    const myFlight = new Flight({
        airline: flightData.airline,
        departureFrom: flightData.departureFrom,
        departureTime: flightData.departureTime,
        arrivalTo: flightData.arrivalTo,
        arrivalTime:flightData.arrivalTime
    });

    myFlight.save()
    .then(() => {
        console.log(`New flight ${flightData.airline}, was added to the database`);
        res.status(200).json({ message: 'Flight added successfully', flightId: myFlight._id });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: error.message });
    });
});

app.get('/flight/:id', async (req, res) => {
    const flight = await Flight.findById(req.params.id)
    console.log(flight)
    res.json(flight)
})

app.delete('/flight/:id', (req, res) => {
    Flight.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.put('/flight/:id', (req, res) => {
    Flight.updateOne({"_id": req.params.id}, {})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.post('/essentials/new', (req, res) => {
    const essentials = req.body
    const myEssentials = new Essentials({title: essentials.title})
    myEssentials.save()
    .then(() => {
        console.log(`New essential ${essentials.title}, was added to the data base`)
        res.status(200).json(myEssentials)
    })
    .catch(error => console.error(error))
})

app.get('/essentials/:id', async (req, res) => {
    const essentials = await Essentials.findById(req.params.id)
    console.log(essentials)
    res.json(essentials)
})

app.delete('/essentials/:id', (req, res) => {
    Essentials.deleteOne({"_id": req.params.id})
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.put('/essentials/:id', (req, res) => {
    const updateData = req.body;
    Essentials.updateOne({"_id": req.params.id}, updateData)
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

app.post('/user/login', async (req, res) => {
    const now = new Date();

    if (await User.countDocuments({ "userEmail": req.body.userEmail }) === 0) {
        const newUser = new User({
            userEmail: req.body.userEmail,
            lastLogin: now
        });
        newUser.save()
            .then(() => {
                res.sendStatus(200);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    } else {
        await User.findOneAndUpdate({ "userEmail": req.body.userEmail }, { lastLogin: now });
        res.sendStatus(200);
    }
});