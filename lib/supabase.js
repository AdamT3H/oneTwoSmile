import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfabsbeoollsulcjyorr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYWJzYmVvb2xsc3VsY2p5b3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI4NzgxMSwiZXhwIjoyMDYxODYzODExfQ._1lw7CPyz7ueJLYuGuE6xKTb9IuLB_FGgvAi5eXU2gU'

export const supabase = createClient(supabaseUrl, supabaseKey)