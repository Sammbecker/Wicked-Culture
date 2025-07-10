const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    })

    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      })
      console.log('Admin user created')
    }

    // Check if products already exist
    const existingProducts = await prisma.product.count()
    
    if (existingProducts === 0) {
      // Create sample products
      const products = [
        {
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
          category: 'Electronics',
          stock: 50,
          featured: true,
        },
        {
          name: 'Smart Watch',
          description: 'Feature-rich smartwatch with health monitoring, GPS, and long battery life.',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
          category: 'Electronics',
          stock: 30,
          featured: true,
        },
        {
          name: 'Laptop Backpack',
          description: 'Durable and stylish laptop backpack with multiple compartments and USB charging port.',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
          category: 'Accessories',
          stock: 75,
          featured: false,
        },
        {
          name: 'Coffee Maker',
          description: 'Premium coffee maker with programmable settings and thermal carafe.',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
          category: 'Home & Kitchen',
          stock: 25,
          featured: true,
        },
        {
          name: 'Yoga Mat',
          description: 'Eco-friendly yoga mat with excellent grip and cushioning for all yoga practices.',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
          category: 'Sports & Fitness',
          stock: 100,
          featured: false,
        },
        {
          name: 'Desk Lamp',
          description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
          category: 'Home & Kitchen',
          stock: 40,
          featured: true,
        },
      ]

      await prisma.product.createMany({
        data: products,
      })
      console.log('Sample products created')
    }

    // Check if discount codes already exist
    const existingDiscounts = await prisma.discountCode.count()
    
    if (existingDiscounts === 0) {
      // Create sample discount codes
      const discountCodes = [
        {
          code: 'WELCOME10',
          description: 'Welcome discount for new customers',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minimumAmount: 50,
          maxUses: 100,
          active: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        {
          code: 'SAVE20',
          description: 'Save $20 on orders over $100',
          discountType: 'FIXED_AMOUNT',
          discountValue: 20,
          minimumAmount: 100,
          maxUses: 50,
          active: true,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        },
      ]

      await prisma.discountCode.createMany({
        data: discountCodes,
      })
      console.log('Sample discount codes created')
    }

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()