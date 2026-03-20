'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PublicShell } from '@/components/layout/PublicShell';

export default function ContactPage() {
  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.6em] text-indigo-400">Contact</p>
          <h1 className="text-4xl font-bold text-white">Let’s build better code visibility together</h1>
          <p className="text-gray-300">
            Reach out about partnerships, enterprise pilots, or press. We reply to every message within 48 hours.
          </p>
          <Badge variant="muted">Office hours: Mon-Fri, 09:00-17:00 UTC</Badge>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-slate-900/60 to-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-300" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              <p>hello@stackmap.ai</p>
              <p className="mt-2 text-xs text-gray-500">We’ll loop in your account lead within minutes.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-900/60 to-black border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                Call
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              <p>+44 (0)20 1234 5678</p>
              <p className="mt-2 text-xs text-gray-500">Global desk for enterprise inquiries.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Headquarters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300 space-y-2">
            <p>60 Marshall Street, Johannesburg, South Africa</p>
            <p>Remote-first team with engineers in EMEA, APAC, and the Americas.</p>
            <Button variant="secondary" className="mt-3">
              Schedule a call
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
