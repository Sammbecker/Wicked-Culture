# E-Commerce Store

A full-featured e-commerce website built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

### 🛍️ Customer Features
- **Product Display**: Browse products with beautiful grid layout
- **Shopping Cart**: Add, remove, and update quantities
- **Discount Codes**: Apply percentage or fixed amount discounts
- **User Authentication**: Secure login and registration
- **Newsletter Signup**: Email subscription for updates
- **Responsive Design**: Works on all devices

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, and delete products
- **Inventory Tracking**: Monitor stock levels
- **Featured Products**: Highlight special products
- **Admin Dashboard**: Overview statistics and management
- **Order Management**: View and manage customer orders

### 🔧 Technical Features
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive styling
- **Prisma**: Type-safe database ORM
- **NextAuth.js**: Secure authentication
- **SQLite**: Local development database
- **Image Optimization**: Next.js Image component

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   The `.env` file is already configured with default values. For production, update:
   ```bash
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Stripe (for payment processing)
   STRIPE_PUBLIC_KEY="pk_test_your-stripe-public-key"
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

   # Email Configuration (for newsletter)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database with sample data**
   ```bash
   node scripts/seed.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123

### Test Discount Codes
- **WELCOME10**: 10% off orders over $50
- **SAVE20**: $20 off orders over $100

## Project Structure

```
ecommerce-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── cart/              # Shopping cart
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configurations
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── seed.js               # Database seeding script
└── public/                   # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/admin/products` - Admin: Get all products
- `POST /api/admin/products` - Admin: Create product
- `PUT /api/admin/products/[id]` - Admin: Update product
- `DELETE /api/admin/products/[id]` - Admin: Delete product

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item quantity
- `DELETE /api/cart/[id]` - Remove cart item
- `GET /api/cart/count` - Get cart items count

### Discount & Checkout
- `POST /api/discount/validate` - Validate discount code
- `POST /api/checkout` - Process checkout
- `POST /api/newsletter` - Newsletter subscription

## Database Schema

The application uses Prisma with the following main models:

- **User**: User accounts and authentication
- **Product**: Product catalog
- **CartItem**: Shopping cart items
- **Order & OrderItem**: Order management
- **DiscountCode**: Promotional codes
- **EmailSubscriber**: Newsletter subscribers

## Development

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add routes in `src/app/api/`
3. **Components**: Create reusable components in `src/components/`
4. **Pages**: Add pages in `src/app/`

### Database Operations
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Apply schema changes to database
npx prisma db push

# View database in Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

## Production Deployment

### Environment Setup
1. Use PostgreSQL for production database
2. Set secure NEXTAUTH_SECRET
3. Configure real Stripe keys for payments
4. Set up email service for newsletters

### Database Migration
```bash
# For production, use migrations instead of db push
npx prisma migrate deploy
```

## Payment Integration

The checkout system is currently simulated. To integrate with Stripe:

1. Install Stripe SDK: `npm install stripe @stripe/stripe-js`
2. Update `/api/checkout` to create Stripe sessions
3. Add webhook handling for payment confirmations
4. Update environment variables with real Stripe keys

## Email Integration

To enable newsletter functionality:
1. Configure SMTP settings in environment variables
2. Set up email templates
3. Implement email sending logic in `/api/newsletter`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy coding! 🚀**
