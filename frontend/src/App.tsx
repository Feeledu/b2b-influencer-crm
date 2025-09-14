import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, BarChart3, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <div className="mr-6 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden font-bold sm:inline-block">B2B Influencer CRM</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="ghost" className="hidden md:inline-flex">
                Sign In
              </Button>
            </div>
            <nav className="flex items-center">
              <Button size="sm" className="ml-2">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center rounded-lg border bg-muted px-3 py-1 text-sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            The influence-to-revenue platform for B2B marketing
          </div>
          
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Find out who your{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              buyers trust
            </span>
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Partner with them. Prove the impact. Track which influencer partnerships actually drive pipeline and revenue.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">48%</div>
            <div className="text-muted-foreground font-medium">Struggle with finding the right influencers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">47%</div>
            <div className="text-muted-foreground font-medium">Can't measure influencer ROI</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">40%</div>
            <div className="text-muted-foreground font-medium">Struggle with relationship management</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>B2B-Only Discovery</CardTitle>
              <CardDescription>
                Find LinkedIn creators, podcast hosts, and newsletter writers your buyers actually trust. No more guessing.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Pipeline Attribution</CardTitle>
              <CardDescription>
                Track which influencer partnerships actually drive opportunities and revenue. Show real ROI to your CFO.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Intent-Led Discovery</CardTitle>
              <CardDescription>
                See which creators your ideal customers already follow and engage with. Data-driven, not guesswork.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to prove influencer ROI?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the B2B marketers who are finally measuring the real impact of their influencer partnerships.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-slate-600 text-white hover:bg-slate-700">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Test Section - Remove in production */}
      <section className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">🎉 shadcn/ui Working!</h3>
            <p className="text-muted-foreground mb-6">
              Professional UI components are now ready for your B2B Influencer CRM development!
            </p>
            <Button 
              onClick={() => setCount((count) => count + 1)}
              className="px-6"
            >
              Count is {count}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default App