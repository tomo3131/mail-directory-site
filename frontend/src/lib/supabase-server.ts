import { supabase } from './supabase'
import { Brand, Email, Category } from './supabase'

// ====================================
// カテゴリ取得
// ====================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

// ====================================
// ブランド取得
// ====================================

export async function getAllBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data as Brand[]
}

export async function getBrandBySlug(slug: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching brand:', error)
    return null
  }

  return data as Brand
}

export async function getBrandsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('category_id', categoryId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching brands by category:', error)
    return []
  }

  return data as Brand[]
}

// ====================================
// メール取得
// ====================================

export async function getAllEmails() {
  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('is_public', true)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('Error fetching emails:', error)
    return []
  }

  return data as Email[]
}

export async function getEmailById(id: string) {
  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (error) {
    console.error('Error fetching email:', error)
    return null
  }

  // 閲覧数を1増やす
  await supabase
    .from('emails')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', id)

  return data as Email
}

export async function getEmailsByBrand(brandId: string, limit?: number) {
  let query = supabase
    .from('emails')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_public', true)
    .order('sent_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching emails by brand:', error)
    return []
  }

  return data as Email[]
}

// ====================================
// 検索
// ====================================

export async function searchEmails(query: string) {
  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('is_public', true)
    .or(`subject.ilike.%${query}%,text_body.ilike.%${query}%`)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('Error searching emails:', error)
    return []
  }

  return data as Email[]
}

// ====================================
// 統計情報
// ====================================

export async function getStats() {
  const [brandsResult, emailsResult] = await Promise.all([
    supabase.from('brands').select('id', { count: 'exact', head: true }),
    supabase.from('emails').select('id', { count: 'exact', head: true })
      .eq('is_public', true)
  ])

  return {
    totalBrands: brandsResult.count || 0,
    totalEmails: emailsResult.count || 0
  }
}
