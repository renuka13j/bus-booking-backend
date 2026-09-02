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

function getDateString(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const operatorNames = ['RedLine Travels', 'GreenLine Express', 'BlueDart Travels'];

const routeDefs = [
  { source: 'Nagpur', destination: 'Pune', distanceKm: 700, departureTime: '09:00', arrivalTime: '20:00', price: 899 },
  { source: 'Pune', destination: 'Nagpur', distanceKm: 700, departureTime: '21:00', arrivalTime: '08:00', price: 899 },
  { source: 'Mumbai', destination: 'Pune', distanceKm: 150, departureTime: '07:00', arrivalTime: '10:30', price: 399 },
  { source: 'Pune', destination: 'Mumbai', distanceKm: 150, departureTime: '17:00', arrivalTime: '20:30', price: 399 },
  { source: 'Delhi', destination: 'Jaipur', distanceKm: 280, departureTime: '06:30', arrivalTime: '12:00', price: 549 },
  { source: 'Jaipur', destination: 'Delhi', distanceKm: 280, departureTime: '15:00', arrivalTime: '20:30', price: 549 },
  { source: 'Bangalore', destination: 'Chennai', distanceKm: 350, departureTime: '08:00', arrivalTime: '14:00', price: 649 },
  { source: 'Chennai', destination: 'Bangalore', distanceKm: 350, departureTime: '16:00', arrivalTime: '22:00', price: 649 },
];

const DAYS_AHEAD = 365; 

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, seeding...');

  await Operator.deleteMany({});
  await Route.deleteMany({});
  await Trip.deleteMany({});

  const operators = {};
  for (const name of operatorNames) {
    operators[name] = await Operator.create({ name, type: 'bus' });
  }

  let tripCount = 0;

  for (let i = 0; i < routeDefs.length; i++) {
    const rd = routeDefs[i];
    const operatorName = operatorNames[i % operatorNames.length]; // rotate operators across routes

    const route = await Route.create({
      operator: operators[operatorName]._id,
      source: rd.source,
      destination: rd.destination,
      distanceKm: rd.distanceKm,
    });

    for (let day = 0; day < DAYS_AHEAD; day++) {
      await Trip.create({
        route: route._id,
        date: getDateString(day),
        departureTime: rd.departureTime,
        arrivalTime: rd.arrivalTime,
        price: rd.price,
        seats: generateSeats(),
      });
      tripCount++;
    }
  }

  console.log(`Seed complete! Created ${routeDefs.length} routes and ${tripCount} trips (next ${DAYS_AHEAD} days).`);

  mongoose.disconnect();
}

seed();