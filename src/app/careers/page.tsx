'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, Sparkles } from 'lucide-react';
import { PublicShell } from '@/components/layout/PublicShell';

const openings = [
  {
    role: 'Senior Applied AI Engineer',
    location: 'Remote (Global)',
    focus: 'Build the intelligence layer that powers StackMap AIs.',
  },
  {
    role: 'Product Design Lead',
    location: 'Cape Town, South Africa',
    focus: 'Craft high-clarity experiences for complex code systems.',
  },
];

export default function CareersPage() {
  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <header className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.6em] text-indigo-400">Careers</p>
          <h1 className="text-4xl font-bold text-white">Join the team building smarter code intelligence</h1>
          <p className="text-gray-300">
            Small, ambitious, deeply empathetic — we value craft, clarity, and caring about engineers at every scale.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {openings.map(position => (
            <Card key={position.role} className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-300" />
                  {position.role}
                </CardTitle>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">{position.location}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">{position.focus}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="muted">Remote friendly</Badge>
                  <Badge variant="green">Equity + benefits</Badge>
                </div>
                <Button variant="secondary" className="self-start">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">Why StackMap?</p>
          <p className="text-gray-300">
            We ship instrumentation for tens of thousands of files, collaborate with brilliant companies, and keep experimentation fast.
          </p>
          <Button variant="ghost" className="border border-white/20 bg-white/5">
            Tell me more
          </Button>
        </div>
      </div>
    </PublicShell>
  );
}
