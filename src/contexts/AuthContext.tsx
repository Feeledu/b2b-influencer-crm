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
    // Check if we have valid Supabase credentials
    const hasCredentials = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('AuthContext useEffect running', { 
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL, 
      hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasCredentials
    })
    
    if (!hasCredentials) {
      console.log('No Supabase credentials - using demo mode')
      // Demo mode - create a mock user
      const mockUser = {
        id: 'demo-user-123',
        email: 'demo@fluencr.com',
        user_metadata: {
          name: 'Demo User',
          avatar_url: null,
          role: 'admin'
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
      console.log('Demo mode: Mock user set', { user: mockUser, loading: false })
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      // Add admin role to real users for development
      if (session?.user) {
        const userWithAdmin = {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            role: 'admin'
          }
        }
        setUser(userWithAdmin)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // Add admin role to real users for development
      if (session?.user) {
        const userWithAdmin = {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            role: 'admin'
          }
        }
        setUser(userWithAdmin)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log('SignUp called with:', { email, hasSupabase: !!supabase })
    
    // In demo mode, create a mock user
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: {
          name: email.split('@')[0],
          avatar_url: null,
          role: 'user'
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
      return { error: null }
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log('SignUp result:', { error })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('SignIn called with:', { email, hasSupabase: !!supabase })
    
    // In demo mode, create a mock user
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: {
          name: email.split('@')[0],
          avatar_url: null,
          role: 'user'
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
      return { error: null }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('SignIn result:', { error, hasData: !!data })
    
    // Update state immediately if successful
    if (data.session && !error) {
      setSession(data.session)
      // Add admin role to real users for development
      const userWithAdmin = {
        ...data.session.user,
        user_metadata: {
          ...data.session.user.user_metadata,
          role: 'admin'
        }
      }
      setUser(userWithAdmin)
    }
    
    return { error }
  }

  const signInWithGoogle = async () => {
    console.log('Google signin called with:', { hasSupabase: !!supabase })
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    console.log('Google signin result:', { error })
    return { error }
  }

  const signOut = async () => {
    // In demo mode, just clear the local state
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setUser(null)
      setSession(null)
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase.auth.updateUser({
      data: updates
    })
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
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
