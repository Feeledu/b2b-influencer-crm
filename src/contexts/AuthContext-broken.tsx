import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're in demo mode (no Supabase config)
    const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('Demo mode check:', { 
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL, 
      hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      isDemoMode 
    })
    
    if (isDemoMode) {
      // Demo mode - create a mock user
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@influencehub.com',
        user_metadata: {
          name: 'Demo User',
          avatar_url: null
        }
      } as User
      
      const mockSession = {
        user: mockUser,
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer'
      } as Session
      
      setUser(mockUser)
      setSession(mockSession)
      setLoading(false)
      return
    }

    // Get initial session
    console.log('🔍 Getting initial session...')
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔍 Initial session result:', { session: !!session, error, hasUser: !!session?.user })
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    console.log('🔍 Setting up auth state change listener...')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔍 Auth state change:', { event, session: !!session, hasUser: !!session?.user })
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('🔍 Cleaning up auth listener...')
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log('SignUp called with:', { email, hasSupabase: !!supabase })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log('SignUp result:', { data, error })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('SignIn called with:', { email, hasSupabase: !!supabase })
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('SignIn result:', { data, error })
    return { error }
  }

  const signInWithGoogle = async () => {
    console.log('Google signin called with:', { hasSupabase: !!supabase })
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    console.log('Google signin result:', { data, error })
    return { error }
  }

  const signOut = async () => {
    console.log('SignOut called with:', { hasSupabase: !!supabase })
    
    const { error } = await supabase.auth.signOut()
    console.log('SignOut result:', { error })
    return { error }
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    console.log('UpdateProfile called with:', { updates, hasSupabase: !!supabase })
    
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    console.log('UpdateProfile result:', { data, error })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile
  }

  console.log('🔍 AuthContext value:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading,
    userEmail: user?.email 
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
