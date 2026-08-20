const mongoose = require('mongoose');
require('dotenv').config();

const Operator = require('./models/Operator');
const Route = require('./models/Route');
const Trip = require('./models/Trip');

function generateSeats() {
  const seats = [];
  for (let i = 1; i <= 10; i++) {
    seats.push({ seatNumber: `A${i}`, type: 'seater', isBooked: false });
  }
  return seats;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, seeding...');

  await Operator.deleteMany({});
  await Route.deleteMany({});
  await Trip.deleteMany({});

  const operator = await Operator.create({ name: 'RedLine Travels', type: 'bus' });

  const route = await Route.create({
    operator: operator._id,
    source: 'Nagpur',
    destination: 'Pune',
    distanceKm: 700
  });

  const trip = await Trip.create({
    route: route._id,
    date: '2026-08-25',
    departureTime: '09:00',
    arrivalTime: '20:00',
    price: 899,
    seats: generateSeats()
  });

  console.log('Seed complete!');
  console.log('Trip ID:', trip._id.toString());

  mongoose.disconnect();
}

seed();