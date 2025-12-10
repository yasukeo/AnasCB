'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

interface LoginParams {
  email: string
  password: string
}

interface SignupParams {
  email: string
  password: string
  nom: string
  prenom: string
}

export async function login(params: LoginParams) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })

  if (error) {
    return {
      success: false,
      error: 'Email ou mot de passe incorrect',
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Erreur de connexion',
    }
  }

  // Get user role from users table
  let { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  // If user not in users table, create the record
  if (!userData) {
    const adminSupabase = getAdminClient()
    const { error: insertError } = await adminSupabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email || '',
        role: 'CLIENT',
      })
    
    if (!insertError) {
      userData = { role: 'CLIENT' }
    }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
    role: userData?.role || 'CLIENT',
  }
}

export async function signup(params: SignupParams) {
  try {
    // Use admin client to create user without email confirmation
    const adminSupabase = getAdminClient()

    // Create auth user with admin client (bypasses email confirmation)
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        nom: params.nom,
        prenom: params.prenom,
      },
    })

    if (error) {
      console.error('Signup auth error:', error)
      return {
        success: false,
        error: error.message === 'User already registered'
          ? 'Cet email est déjà utilisé'
          : error.message || 'Erreur lors de la création du compte',
      }
    }

    if (!data.user) {
      console.error('No user returned from signup')
      return {
        success: false,
        error: 'Erreur lors de la création du compte',
      }
    }

    // Create user record in users table
    const { error: userError } = await adminSupabase
      .from('users')
      .insert({
        id: data.user.id,
        email: params.email,
        role: 'CLIENT',
      })

    if (userError) {
      console.error('Error creating user record:', userError)
      // Don't fail the signup if user record creation fails
      // The user can still login and we'll create it then
    }

    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du compte',
    }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
  }
  
  redirect('/')
}

export async function getUser() {
  try {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Try to get role from users table, with timeout
    let role = 'CLIENT'
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      role = userData?.role || 'CLIENT'
    } catch (roleError) {
      // If role fetch fails, just use CLIENT as default
      console.log('Could not fetch role, using CLIENT as default')
    }

    return {
      id: user.id,
      email: user.email,
      role: role,
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}
