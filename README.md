# 🎿 Ski Trip Planner

A collaborative web application for planning ski trips with friends. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

This application helps 3-5 friends collaboratively plan a ski trip by allowing them to:

- Browse ski destinations and hotels
- Vote on their preferred destination/hotel combinations
- Track participation and results in real-time
- View pricing and amenities for informed decision-making

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS 4 for responsive design
- **Backend**: Next.js API routes for RESTful endpoints
- **Database**: localStorage for MVP (easily upgradeable to PostgreSQL/MongoDB)
- **API Integration**: liteAPI for real hotel data with graceful fallback to mock data
- **Development**: Turbopack for fast development builds, ESLint for code quality

## 🏃‍♂️ Getting Started

1. **Clone and install dependencies:**

   ```bash
   git clone [your-repo-url]
   cd test1
   npm install
   ```

2. **Set up environment variables (optional for LiteAPI):**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your LiteAPI key:
   # LITEAPI_KEY=your_private_liteapi_key_here
   ```

   **Getting a LiteAPI Key:**
   - Visit [https://www.liteapi.travel/](https://www.liteapi.travel/)
   - Sign up for an account and get your API key
   - The app will work with mock data if no API key is provided

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to start planning your ski trip!

## 🔧 Development Setup

**VS Code Configuration:**

- **Format on Save**: Automatically formats code using Prettier when you save files
- **ESLint Integration**: Real-time linting and auto-fixing
- **Recommended Extensions**: Prettier, ESLint, Tailwind CSS IntelliSense

**Code Quality:**

- **Prettier**: Consistent code formatting across the project
- **ESLint**: TypeScript and React best practices enforcement
- **TypeScript**: Full type safety with strict configuration

## 📁 Project Structure

```
test1/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # Backend API routes
│   │   │   ├── groups/            # Group management
│   │   │   ├── hotels/            # Hotel data (liteAPI integration)
│   │   │   └── votes/             # Voting system
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/                # React components
│   │   ├── DestinationCard.tsx    # Ski destination display
│   │   ├── GroupSetup.tsx         # Initial group creation
│   │   ├── ParticipantsList.tsx   # Member tracking
│   │   ├── SkiTripPlanner.tsx     # Main application
│   │   └── VotingResults.tsx      # Real-time results
│   ├── data/                      # Mock data and fallbacks
│   │   └── mockData.ts            # Ski destinations and hotels
│   ├── services/                  # Business logic
│   │   ├── database.ts            # Data persistence layer
│   │   └── liteApi.ts             # Hotel API integration
│   └── types/                     # TypeScript definitions
│       └── index.ts               # Core data types
├── .github/
│   └── copilot-instructions.md    # AI development guidelines
├── .vscode/
│   ├── extensions.json            # Recommended VS Code extensions
│   ├── settings.json              # VS Code workspace settings
│   └── tasks.json                 # Development tasks
├── .prettierrc                    # Prettier configuration
└── .prettierignore               # Prettier ignore rules
```

## ✨ Key Features

### 🏔️ Destination Browsing

- **3 Ski Destinations**: Aspen Snowmass, Whistler Blackcomb, and Vail
- **Hotel Options**: Multiple hotels per destination with real pricing and amenities
- **Visual Cards**: Rich destination cards with images and pricing

### 🗳️ Collaborative Voting

- **Individual Voting**: Each member votes for their preferred destination/hotel combo
- **Real-time Updates**: Live voting results update automatically
- **Vote Tracking**: Clear indication of who has voted and who hasn't

### 👥 Group Management

- **Pre-configured Members**: Demo group with 4 friends
- **Participation Tracking**: Visual indicators for voting status
- **Group State**: Persistent group data across sessions

### 🏨 Hotel Integration

- **Real Data**: LiteAPI integration for live hotel prices and availability
- **Graceful Fallback**: Automatic fallback to mock data if API is unavailable
- **Rich Information**: Hotel amenities, ratings, and pricing per night
- **Dynamic Loading**: Hotels load based on selected destination
- **Caching**: Smart caching to reduce API calls and improve performance

- **liteAPI Integration**: Real hotel data when API key is provided
- **Graceful Fallback**: Mock data ensures app always works
- **Rich Hotel Data**: Pricing, ratings, amenities, and descriptions

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

## 🏗️ Architecture Decisions

### **Database Choice: localStorage (MVP)**

- ✅ **Pros**: No setup required, works offline, fast development
- ⚠️ **Trade-offs**: Single-user sessions, no real collaboration
- 🔄 **Next Steps**: Migrate to PostgreSQL/Supabase for multi-user support

### **API Strategy: Graceful Degradation**

- ✅ **liteAPI Integration**: Real hotel data when available
- ✅ **Mock Data Fallback**: Always functional even without API keys
- 🔄 **Next Steps**: Add caching layer, more destination APIs

### **State Management: React + localStorage**

- ✅ **Simple & Effective**: No additional complexity for MVP
- ⚠️ **Trade-offs**: No optimistic updates, manual refresh needed
- 🔄 **Next Steps**: Add Zustand/Redux for complex state

### **Styling: Tailwind CSS**

- ✅ **Rapid Development**: Quick iteration on designs
- ✅ **Responsive**: Mobile-first approach
- 🔄 **Next Steps**: Custom component library, design system

## 🚀 Deployment

Ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Digital Ocean**

```bash
npm run build  # Test production build
```

## 🔮 If We Shipped Next Week, I'd Focus On...

### **Priority 1: Real Collaboration**

- WebSocket integration for real-time voting
- User authentication and multi-group support
- Database migration to PostgreSQL/Supabase

### **Priority 2: Enhanced UX**

- Date selection for trip planning
- Budget calculation and splitting
- Email notifications for group updates

### **Priority 3: Data & Analytics**

- More ski resorts and destinations
- Weather data integration
- Historical pricing trends

### **Priority 4: Mobile Experience**

- Progressive Web App (PWA) features
- Mobile-optimized voting interface
- Offline functionality

## 🤝 Collaboration with Non-Technical Founders

My approach to working with non-technical founders:

### **Communication Style**

- **Visual Demos**: Regular screen recordings and live demos
- **Plain English**: Translate technical decisions into business impact
- **Weekly Check-ins**: Progress updates with clear next steps

### **Decision Making**

- **Business-First**: Always tie technical choices to user value
- **Trade-off Transparency**: Clearly explain speed vs. scalability decisions
- **Prototype Fast**: Build clickable prototypes for quick validation

### **Process**

- **User Story Driven**: Start with "As a user, I want..." scenarios
- **Iterative Delivery**: Ship small, valuable features weekly
- **Feedback Loops**: Quick turnaround on feedback and changes

---

_✨ Built with Next.js 15, TypeScript, and ❤️ - Ready for your next ski adventure!_

If we were implementing booking I would upgrade the security to Secure Authentication - Enhanced security using HMAC signatures with public and private key pairs.

Choose a data fetching strategy

it doesn't get uptodate prices as that would require dates - can we set a date?
hard code date of 30 days in the future
then get prices?


remove comments unless essential to explain why

ratify interfaces - centralise?