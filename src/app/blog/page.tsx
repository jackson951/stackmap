'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, MessageCircle } from 'lucide-react';
import { PublicShell } from '@/components/layout/PublicShell';

const highlights = [
  {
    title: 'Navigating AI-assisted code reviews',
    tag: 'Engineering',
    excerpt: 'How StackMap surfaces risky commits and lets reviewers focus on the story behind every diff.',
  },
  {
    title: 'Designing enterprise AI guidebooks',
    tag: 'Product',
    excerpt: 'Best practices for turning query responses into living onboarding playbooks.',
  },
  {
    title: 'Scaling observability with human language',
    tag: 'Ops',
    excerpt: 'We match insights with PM/exec needs so observability dashboards stop being noise.',
  },
];

export default function BlogPage() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.6em] text-indigo-400">StackMap Stories</p>
          <h1 className="text-4xl font-bold text-white">Insights from the stack</h1>
          <p className="text-gray-300">
            Product updates, engineering stories, and operational learnings shared monthly with the StackMap community.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((entry) => (
            <Card key={entry.title} className="bg-white/5 border border-white/10 hover:border-indigo-500/40 transition">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{entry.title}</CardTitle>
                  <Badge variant="muted">{entry.tag}</Badge>
                </div>
                <p className="text-sm text-gray-400">{entry.excerpt}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Button variant="ghost" className="text-xs uppercase tracking-[0.4em]">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Read story
                </Button>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.5em] text-gray-400">Editorial</p>
            <Badge variant="purple">Fresh</Badge>
          </div>
          <p className="text-lg font-semibold text-white">
            We publish practical guides for modern teams shipping AI copilots — join the newsletter to stay ahead.
          </p>
          <Button variant="primary" className="self-start">
            Subscribe to updates
          </Button>
        </div>
      </div>
    </PublicShell>
  );
}
