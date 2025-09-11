const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function debugAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('Checking admin user in database...');
    
    // Check if admin user exists
    const result = await client.query('SELECT * FROM users WHERE email = $1', ['admin@signingconnect.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    const admin = result.rows[0];
    console.log('✅ Admin user found:');
    console.log('- ID:', admin.id);
    console.log('- Email:', admin.email);
    console.log('- User Type:', admin.user_type);
    console.log('- Status:', admin.status);
    console.log('- Created:', admin.created_at);
    
    // Test password
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, admin.password_hash);
    console.log('- Password test with "admin123":', passwordMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    // Try login query exactly like the server does
    console.log('\nTesting login queries:');
    
    // Test with admin user type
    const adminQuery = await client.query(
      'SELECT id, email, user_type FROM users WHERE email = $1 AND user_type = $2',
      ['admin@signingconnect.com', 'admin']
    );
    console.log('- Query with user_type="admin":', adminQuery.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND');
    
    // Test with company user type
    const companyQuery = await client.query(
      'SELECT id, email, user_type FROM users WHERE email = $1 AND user_type = $2',
      ['admin@signingconnect.com', 'company']
    );
    console.log('- Query with user_type="company":', companyQuery.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND');
    
    // Test with agent user type
    const agentQuery = await client.query(
      'SELECT id, email, user_type FROM users WHERE email = $1 AND user_type = $2',
      ['admin@signingconnect.com', 'agent']
    );
    console.log('- Query with user_type="agent":', agentQuery.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND');
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

debugAdmin();