# StackMap

**AI-Powered Codebase Intelligence Platform**

Connect your GitHub repositories and ask natural language questions about your codebase. StackMap uses AI to analyze your code structure, dependencies, and patterns to provide intelligent insights and answers.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3699FF?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Features

### 🧠 AI-Powered Code Analysis
- **Intelligent Code Understanding**: AI analyzes your entire codebase to understand architecture, dependencies, and patterns
- **Natural Language Queries**: Ask questions about your code in plain English and get precise answers with file references
- **Context-Aware Responses**: AI provides answers with relevant code snippets and context

### 📚 Auto Onboarding Guide
- **One-Click Documentation**: Generate comprehensive documentation for new team members
- **Architecture Guides**: Automatically create architecture documentation and code explanations
- **Markdown Export**: Export documentation in Markdown format for easy sharing

### 🔍 Code Intelligence
- **Repository Mapping**: Visualize your codebase structure and dependencies
- **File Analysis**: Detailed analysis of individual files with insights and recommendations
- **Churn Heatmaps**: Visualize code changes and activity patterns

### 👥 Team Collaboration
- **GitHub Integration**: Seamless integration with GitHub repositories
- **User Management**: Team-based access and repository management
- **Query History**: Track and review previous AI queries and responses

## 🛠 Tech Stack

- **Frontend**: Next.js 16.2.0 with React 19.2.4
- **Styling**: Tailwind CSS with custom gradients and animations
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with GitHub OAuth
- **AI Integration**: Custom AI query system
- **TypeScript**: Full TypeScript support

## 📦 Dependencies

### Core Dependencies
- `@radix-ui/react-dropdown-menu` - Accessible UI components
- `@supabase/ssr` & `@supabase/supabase-js` - Supabase integration
- `clsx` - Conditional CSS class utility
- `date-fns` - Date manipulation
- `lucide-react` - Icon library
- `tailwind-merge` - Tailwind class merging

### Development Dependencies
- `@tailwindcss/postcss` - PostCSS integration
- `@types/node` & `@types/react` - TypeScript definitions
- `eslint` - Code linting
- `supabase` - Supabase CLI
- `typescript` - TypeScript compiler

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account
- Supabase project (for database and auth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jackson951/stackmap.git
   cd stackmap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Optional: AI API keys
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup:**
   ```bash
   npx supabase login
   npx supabase init
   npx supabase start
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### Getting Started
1. **Sign in with GitHub**: Click "Get Started" and authenticate with your GitHub account
2. **Connect Repositories**: Select repositories you want to analyze
3. **Ask Questions**: Use natural language to query your codebase
4. **Generate Documentation**: Create onboarding guides for your team

### Key Features

#### Dashboard
The main dashboard provides an overview of your connected repositories, indexing status, and quick access to AI queries.

#### Repository Analysis
- **File Tree**: Navigate your repository structure
- **Code Analysis**: Get AI insights about specific files
- **Churn Heatmaps**: Visualize code change patterns

#### AI Queries
Ask questions like:
- "Where does authentication happen?"
- "How do I add a new feature?"
- "What are the main dependencies?"
- "Explain this function's purpose"

#### Onboarding Guide
Generate comprehensive documentation:
- Architecture overview
- Code explanations
- Setup instructions
- Best practices

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── repo/[repoId]/     # Repository-specific pages
│   │   ├── files/         # File browser
│   │   ├── guide/         # Onboarding guide
│   │   └── query/         # AI query interface
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
│   ├── files/            # File-related components
│   ├── query/            # AI query components
│   ├── repos/            # Repository management
│   └── ui/               # Base UI components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API clients
├── types/                # TypeScript type definitions
└── docs/                 # Documentation and API specs
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key (optional) | ❌ |

### Database Schema

The application uses Supabase PostgreSQL with the following main tables:
- `users` - User information and GitHub integration
- `repositories` - Connected GitHub repositories
- `files` - File metadata and analysis results
- `queries` - AI query history and responses
- `onboarding_guides` - Generated documentation

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Docker
```bash
docker build -t stackmap .
docker run -p 3000:3000 stackmap
```

### Manual Deployment
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Configure your reverse proxy (nginx, etc.)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - For the excellent React framework
- **Supabase** - For the amazing backend platform
- **Tailwind CSS** - For beautiful, utility-first styling
- **GitHub** - For the API that makes this all possible
- **OpenAI** - For the AI capabilities that power our insights

## 📞 Support

If you have any questions or need help:
- 🐛 [Open an Issue](https://github.com/jackson951/stackmap/issues)
- 💬 [Join our Discord](https://discord.gg/stackmap)
- 📧 Email us at support@stackmap.ai

## 🔗 Links

- **[Live Demo](https://stackmap.ai)**
- **[Documentation](https://docs.stackmap.ai)**
- **[API Reference](https://api.stackmap.ai/docs)**
- **[Blog](https://stackmap.ai/blog)**

---

**Built with ❤️ by the StackMap Team**

[![Twitter Follow](https://img.shields.io/twitter/follow/stackmapai?style=social)](https://twitter.com/stackmapai)
[![GitHub Stars](https://img.shields.io/github/stars/jackson951/stackmap?style=social)](https://github.com/jackson951/stackmap)
