import { supabase } from '../../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('products') 
    .select('*')    

  if (error) {
    return new Response(
      JSON.stringify({ message: 'Помилка підключення до бази даних', error }),
      { status: 500 }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Успішно підключено до бази даних', data }),
    { status: 200 }
  )
}
