# Digital Archive

A modern web application for managing and preserving digital content with a focus on user experience and administrative control.

## Features

- Dynamic page management system
- User authentication and authorization
- Admin dashboard for content management
- Drag-and-drop page editor
- Responsive design
- Dark mode support
- Contact form system
- Archive item management

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- React Beautiful DnD

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-archive.git
   cd digital-archive
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
digital-archive/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   └── pages/            # Public pages
├── components/            # Global components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 