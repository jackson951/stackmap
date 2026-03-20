'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Globe, Sparkles, GitBranch } from 'lucide-react';
import { PublicShell } from '@/components/layout/PublicShell';

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.6em] text-indigo-400">About StackMap</p>
          <h1 className="text-4xl font-bold text-white">AI-first intelligence for code operators</h1>
          <p className="text-gray-300">
            StackMap helps engineering teams understand their repositories, surface risky churn, and deliver AI-guided insights without leaving the browser.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900/70 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Democratize the codebase narrative so every contributor can see what matters, in context, with zero configuration.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-900/80 to-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                From security reviews to onboarding, teams rely on StackMap to pin AI-backed answers and keep the product roadmap focused.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-300" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Built by engineers who want concise repo intelligence. Open roadmap, private beta, transparent releases.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">Built for the developer DNA</h2>
          <p className="text-gray-300">
            We combine fast analysis, human-first stories, and enterprise governance to keep stakeholders zoomed in on what’s in production. The product remains experimental, but our promise is simple: no wasted clicks, just actionable context.
          </p>
          <Button variant="secondary" className="flex items-center justify-center">
            Explore the platform
          </Button>
        </div>
      </div>
    </PublicShell>
  );
}
