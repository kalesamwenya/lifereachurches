# 🙏 Lifereach Church - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Modern, responsive church management and engagement platform built with Next.js, featuring real-time capabilities, member portal, giving system, and content management.

## 🌟 Features

- **🏠 Public Website**: Dynamic homepage, sermons, events, blog, and gallery
- **👥 Member Portal**: Personalized dashboard, giving history, event registration
- **💰 Secure Giving**: Integrated payment system with mobile money and card support
- **📱 Real-time Chat**: Member-to-member messaging with Socket.io
- **🎥 Live Streaming**: Watch services live with interactive chat
- **📚 Library**: Digital books and resources with PDF reader
- **🎙️ Podcast**: Audio sermon library with player
- **📝 Blog & Testimonies**: Content management and community stories
- **🔐 Authentication**: Secure NextAuth.js implementation

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalesamwenya/lifereachurches.git
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=https://content.lifereachchurch.org
   NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (main)/              # Public routes
│   ├── (member)/            # Protected member routes
│   ├── api/                 # API routes
│   ├── error.jsx            # Global error boundary
│   ├── not-found.jsx        # 404 page
│   ├── layout.jsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── header/             # Header components
│   ├── footer/             # Footer components
│   ├── home/               # Homepage sections
│   ├── member/             # Member portal components
│   └── ui/                 # Reusable UI components
├── context/                 # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   ├── ChatContext.jsx     # Real-time chat
│   └── PlayerContext.jsx   # Global media player
├── lib/                     # Utilities and configurations
│   ├── api-client.js       # Axios client with interceptors
│   ├── api-config.js       # API configuration
│   ├── env.js              # Environment validation
│   ├── validations.js      # Zod schemas
│   └── performance.js      # Performance utilities
├── utils/                   # Helper functions
├── public/                  # Static assets
└── .github/                 # GitHub Actions workflows
```

## 🛠️ Built With

### Core Technologies
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Authentication & State
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **React Context API** - State management

### Forms & Validation
- **[Zod](https://zod.dev/)** - Schema validation
- **[React Hook Form](https://react-hook-form.com/)** - Form handling

### Data Fetching & Real-time
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Socket.io Client](https://socket.io/)** - Real-time communication

### UI Components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Hot Toast](https://react-hot-toast.com/)** - Notifications
- **[React PDF](https://react-pdf.org/)** - PDF rendering

### Media
- **[HLS.js](https://github.com/video-dev/hls.js/)** - Video streaming
- **PDF.js** - Document viewer

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size
npm run audit:fix    # Fix security vulnerabilities
npm run type-check   # TypeScript type checking
```

## 🏗️ Architecture

### Routing Strategy
- **App Router**: Leveraging Next.js 13+ App Router
- **Route Groups**: Organized by access level (auth, main, member)
- **Dynamic Routes**: For blog posts, sermons, events, etc.

### Data Flow
```
User Action → Component → API Client → Backend API
                ↓
          Context/State Update
                ↓
          UI Re-render
```

### Authentication Flow
```
Login → NextAuth.js → JWT Token → Protected Routes
                         ↓
                   API Requests (Bearer Token)
```

### Real-time Features
```
Socket.io Connection → Event Listeners → Context Update → UI Update
```

## 🔒 Security Features

- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Environment Validation**: Runtime validation of env variables
- **Input Validation**: Zod schemas for all forms
- **API Error Handling**: Centralized error handling with retry logic
- **Authentication**: NextAuth.js with JWT
- **CSRF Protection**: Built-in Next.js protection

## ⚡ Performance Optimizations

- **Image Optimization**: Next.js Image component with AVIF/WebP
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: @next/bundle-analyzer integration
- **Caching**: API response caching with cache invalidation
- **Lazy Loading**: Dynamic imports for heavy components
- **Sharp**: Fast image processing

## 🎨 Styling Guidelines

- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first breakpoints
- **Design Tokens**: Consistent colors, spacing, typography
- **Dark Mode Ready**: Theme configuration in place

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run E2E tests (when configured)
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set production values

3. **Deploy**
   ```bash
   git push origin master
   ```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |

See `.env.example` for complete list.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Lifereach Church Media Team**
- Website: [https://lifereachchurch.org](https://lifereachchurch.org)
- Email: info@lifereachchurch.org

## 🙏 Acknowledgments

- Next.js Team for the amazing framework
- Vercel for hosting platform
- Open source community for incredible tools

## 📞 Support

For support, email support@lifereachchurch.org or join our Slack channel.

---

**Made with ❤️ for the Kingdom**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
