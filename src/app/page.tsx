'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLoginUrl } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Github, Code, Brain, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('stackmap_token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleGetStarted = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <img src="/stackmap.svg" alt="StackMap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  StackMap
                </h1>
                <p className="text-xs text-gray-400">AI Codebase Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI-Powered</span>
              </div>
              <Button
                onClick={handleGetStarted}
                className="group flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-300">AI-Powered Code Intelligence</span>
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    Understand{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      any codebase
                    </span>
                    <br />
                    in{' '}
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      hours
                    </span>
                    , not weeks
                  </h1>
                </div>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                  Connect your GitHub repo and ask natural language questions about your codebase. 
                  StackMap uses AI to map your code so you don't have to.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
                  >
                    Start Mapping Your Code
                  </Button>
                  <div className="text-sm text-gray-400 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Free to use · No credit card required</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1000+</div>
                    <div className="text-sm text-gray-400">Codebases Mapped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-gray-400">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-400">AI Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                  {/* Floating Code Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full opacity-20 animate-pulse delay-500"></div>
                  
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-400 font-mono">stackmap.ai</span>
                    </div>
                    
                    <div className="space-y-3 font-mono text-sm">
                      <div className="text-green-400">{'> Analyzing repository structure...'}</div>
                      <div className="text-blue-400">{'> Generating module graph...'}</div>
                      <div className="text-purple-400">{'> Creating AI embeddings...'}</div>
                      <div className="text-cyan-400">{'> Ready for natural language queries'}</div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-black/30 rounded-lg border border-white/10">
                      <div className="text-gray-300 mb-2">Ask StackMap:</div>
                      <div className="text-white font-medium">"Where does authentication happen?"</div>
                      <div className="text-gray-400 text-sm mt-1">→ AI analyzes your code and provides precise answers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  master your codebase
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From automatic documentation to intelligent code analysis, StackMap gives you 
                superpowers for understanding and working with any codebase.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Code Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our AI analyzes your entire codebase to understand architecture, dependencies, 
                  and patterns. Get intelligent insights about your code structure.
                </p>
                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time analysis</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Auto Onboarding Guide</h3>
                <p className="text-gray-400 leading-relaxed">
                  Generate comprehensive documentation for new team members. 
                  One-click creation of architecture guides and code explanations.
                </p>
                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Markdown export</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Natural Language Queries</h3>
                <p className="text-gray-400 leading-relaxed">
                  Ask questions about your code in plain English. Get precise answers with 
                  file references and code snippets.
                </p>
                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Context-aware responses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <img src="/stackmap.svg" alt="StackMap" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">StackMap</h3>
                  <p className="text-gray-400">AI Codebase Intelligence</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering developers with AI-powered code analysis and natural language 
                understanding for faster onboarding and better code comprehension.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2026 StackMap. Built for developers, by developers.</p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
