# 🎿 Ski Trip Planner

A collaborative web application for planning ski trips with friends. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS 4 for responsive design
- **Backend**: Next.js API routes for RESTful endpoints
- **Database**: Supabase PostgreSQL
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
   # Edit .env.local and add your LiteAPI and Supabase keys:
   LITEAPI_KEY=your_private_liteapi_key_here
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
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

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

## 🏗️ Architecture Decisions

### **Database Choice: Postgres (Supabase) **

- ✅ **Pros**: Powerful & flexible

### **API Strategy: Graceful Degradation**

- ✅ **liteAPI Integration**: Real hotel data when available
- ✅ **Mock Data Fallback**: Always functional even without API keys
- 🔄 **Next Steps**: Add caching layer, more destination APIs

### **State Management: React + localStorage**

- ✅ **Simple & Effective**: No additional complexity for MVP
- ⚠️ **Trade-offs**: No optimistic updates, manual refresh needed
- 🔄 **Next Steps**: Add Jotai/Zustand for complex state if needed

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

## If We Shipped Next Week, I'd Focus On...

- Go through the requirements, check the app matches them correctly - perhaps discuss with te product owner if some adjustments need making to the app, or whether changes to the requirements would be beneficial
- There is no interaction between users so the app is missing a vital component
- The trip group needs to be set up by someone, and users added/invited
- Date selection for trip planning - there is no checkin/checkout date set or defined. The group owner should be able to define and change if necessary, then accurate pricing per night could be gathered from the API
- The UI could be improved
- More destinations could be added
- User registration would be beneficial
- Budget calculation and splitting when dates are known, and room prices are available
- Email notifications for group updates
- Polling for votes is clunky - we could use websockets or Postgres Realtime https://supabase.com/docs/guides/realtime
- Ensure it works as a PWA for mobiles

On a technical level:

- There are some state issues - all components are not correctly registering a change of user - not that IRL a user will be able to change, but neverthless, we need to tie this up
- Thoroughly check error handling and check for all possibilities, e.g. bad data, bad inputs
- Better api endpoint and server action data santisation
- Define a theme with CSS/SCSS classes to provide consistency of the UI
- Slight refactor - look for redundancies and overcomplication
- Security could always be better - not essential for an MVP, but I'd look at upgrading LitAPI's intercation to Enhanced security using HMAC signatures with public and private key pairs.
- Define the data fetchin gand caching strategy for the app

## Collaboration with Non-Technical Founders

My approach to working with non-technical founders:

- Regular user-interactive live demos so all can see exactly where we are
- Regular discussions with feedback both ways
- Communication over Slack or similar - but instant response not required
- No tech jargon - business language is more suitable
- Happy to discuss technical issues in no-tech speak
- Flexible remote working where suitable - face-to-face communication regularly
- At this stage it's MVP/Prototype, so keep it quick and be prepared to throw stuff out.
- Be ready to switch libraries/frameworks if there is a clear advantage or current tech is providing obstructions
