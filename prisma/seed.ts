import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed locations first
  await prisma.locations.createMany({
    data: [
      {
        id: 1,
        name: 'Kathmandu',
        address: '123 Kathmandu St',
        city: 'Kathmandu',
      },
      {
        id: 2,
        name: 'Pokhara',
        address: '456 Pokhara Rd',
        city: 'Pokhara',
      }
    ],
    skipDuplicates: true,
  })

  // Then seed vehicles
  await prisma.vehicles.createMany({
    data: [
      {
        name: 'Yamaha R15 V4',
        brand: 'Yamaha',
        model: '2023',
        type: 'bike',
        fuel_type: 'petrol',
        price_per_day: 2500,
        image_url: 'https://bikemandunepal.com/wp-content/uploads/2023/05/yamaha-r15-v4-blue.png',
        description: 'A stylish and powerful sports bike, perfect for city rides and highways.',
        location_id: 1,
        status: 'available',
      },
      {
        name: 'Bajaj Pulsar 150',
        brand: 'Bajaj',
        model: '2022',
        type: 'bike',
        fuel_type: 'petrol',
        price_per_day: 1500,
        image_url: 'https://bajajautonp.com/assets/media/pulsar-150-1.png',
        description: 'Reliable commuter bike, widely popular in Nepal for its mileage and comfort.',
        location_id: 1,
        status: 'available',
      },
      {
        name: 'Suzuki Access 125',
        brand: 'Suzuki',
        model: '2022',
        type: 'scooter',
        fuel_type: 'petrol',
        price_per_day: 1000,
        image_url: 'https://suzukimotorcycle.com/media/images/scooters/access-125-01.png',
        description: 'A comfortable scooter ideal for city errands and short trips.',
        location_id: 1,
        status: 'available',
      },
      {
        name: 'Hyundai i10 Grand',
        brand: 'Hyundai',
        model: '2021',
        type: 'car',
        fuel_type: 'petrol',
        price_per_day: 3500,
        image_url: 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/38325/i10-exterior-right-front-three-quarter-2.jpeg?q=80',
        description: 'Compact hatchback with great mileage and comfort, ideal for small families.',
        location_id: 2,
        status: 'available',
      },
      {
        name: 'Mahindra Scorpio',
        brand: 'Mahindra',
        model: '2023',
        type: 'jeep',
        fuel_type: 'diesel',
        price_per_day: 6000,
        image_url: 'https://mahindrascorpio.com/assets/img/Scorpio-N-3.png',
        description: 'A rugged SUV great for off-road and hilly terrain like Pokhara or Mustang.',
        location_id: 2,
        status: 'available',
      }
    ],
  })

  console.log('🚗 Vehicle seed data inserted successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
