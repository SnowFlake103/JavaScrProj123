import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://athekxrloprhwlkkntxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aGVreHJsb3ByaHdsa2tudHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQ5NTUsImV4cCI6MjA3NjMxMDk1NX0.exoVi4vwteemb2BvG6fnrq1-jgg1KkE8uGBxX77f4uU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
