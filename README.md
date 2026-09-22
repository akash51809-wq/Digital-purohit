# Veliora TechWorks Portfolio

A premium, multi-page company portfolio website with a secure admin dashboard for a technology startup. Built with Next.js, TypeScript, PostgreSQL, and Prisma.

## 🌟 Features

### Client-Facing Website
- **Modern Design**: Luxury, future-ready tech brand aesthetic
- **Responsive**: Mobile-first design with smooth animations
- **SEO Optimized**: Meta tags, structured data, and performance optimized
- **Pages**: Home, About, Services, Portfolio, Blog, Contact

### Admin Dashboard
- **Secure Authentication**: JWT-based authentication with role-based access
- **Content Management**: CRUD operations for all content types
- **Analytics Dashboard**: Real-time statistics and insights
- **Media Manager**: Upload and manage images and files
- **User Management**: Admin and Editor roles

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: Firebase Firestore
- **Authentication**: JWT, bcryptjs
- **UI Components**: Lucide React icons, React Hook Form
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd veliora-techworks-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Firebase configuration:
   ```env
   # Firebase configuration is already set up
   # Just ensure your Firebase project is properly configured
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3001"
   JWT_SECRET="your-jwt-secret-here"
   ```

4. **Set up the database**
   ```bash
   # Seed Firebase with initial data
   npm run firebase:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3001`

## 🗄️ Database Schema

The application uses Firebase Firestore with the following main collections:

- **Users**: Admin and editor accounts
- **Services**: Company service offerings
- **Projects**: Portfolio projects with categories and technologies
- **Posts**: Blog posts with SEO metadata
- **Contacts**: Contact form submissions
- **Media**: File uploads and media management

See `FIREBASE_SETUP.md` for detailed collection schemas.

## 🔐 Admin Access

1. **Seed the database** with initial admin user:
   ```bash
   npm run firebase:seed
   ```
2. **Access the admin dashboard** at `/admin`
3. **Login credentials**:
   - Email: `velioratechworks@gmail.com`
   - Password: `Veliora@2025`
4. **Default features**:
   - Dashboard with analytics
   - Content management (Posts, Projects, Services)
   - Contact form submissions
   - Media library
   - User management

## 🎨 Design System

### Colors
- **Primary**: Gold/Yellow (#ecc94b)
- **Accent**: Orange (#f97316)
- **Dark**: Charcoal (#212529)
- **Background**: White/Light Gray

### Typography
- **Display**: Poppins (headings)
- **Body**: Inter (body text)

### Components
- Reusable UI components in `/src/components/ui`
- Layout components in `/src/components/layout`
- Section components in `/src/components/sections`

## 📱 Pages Structure

```
/                 - Homepage with hero, services, portfolio preview
/about           - Company overview, mission, vision, team
/services        - Detailed service offerings
/portfolio       - Project showcase with filtering
/blog            - Blog posts and insights
/contact         - Contact form and information
/admin           - Secure admin dashboard
/admin/posts     - Blog post management
/admin/projects  - Portfolio management
/admin/contacts  - Contact submissions
/admin/media     - Media library
/admin/users     - User management
/admin/settings  - Site settings
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run firebase:seed` - Seed Firebase with initial data

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   └── (pages)/        # Public pages
├── components/         # React components
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@veliora-techworks.com or create an issue in the repository.

---

**Veliora TechWorks 2026** - Building intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.