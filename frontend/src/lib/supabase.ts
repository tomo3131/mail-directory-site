import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義（後でSupabaseのテーブルに合わせて更新）
export type Brand = {
  id: string
  name: string
  slug: string
  category_id: string
  logo_url: string | null
  email_address: string
  website_url: string | null
  description: string | null
  total_emails: number
  created_at: string
  updated_at: string
}

export type Email = {
  id: string
  brand_id: string
  subject: string
  from_email: string
  from_name: string
  html_body: string
  text_body: string
  sent_at: string
  received_at: string
  image_urls: string[]
  view_count: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  name: string | null
  plan: 'free' | 'pro' | 'team'
  stripe_customer_id: string | null
  subscription_status: string | null
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}
