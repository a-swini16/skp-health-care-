"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldAlert, Microscope, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("admin@skphealthcare.com")
  const [password, setPassword] = React.useState("admin123")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If it's a dummy setup without real auth configured, bypass for demo
        if (error.message.includes('fetch')) {
           toast.success("Development Mode: Bypassing auth...")
           router.push("/")
           return
        }
        toast.error(error.message)
      } else {
        toast.success("Successfully logged in!")
        router.push("/")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Microscope className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">SKP Healthcare LIS</CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <Input 
                type="email" 
                placeholder="admin@skphealthcare.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <div className="flex items-center text-xs text-muted-foreground">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Authorized Personnel Only
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
