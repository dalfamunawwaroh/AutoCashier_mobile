import { supabaseAdmin } from './src/supabaseClient.js';
async function test() {
  const { data, error } = await supabaseAdmin.from('transactions').select('*').limit(1);
  console.log(data);
}
test();
