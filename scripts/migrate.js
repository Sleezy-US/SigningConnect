const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting SigningConnect database migration...');
    
    // Create applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(20) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        cell_phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(2),
        zip_code VARCHAR(10),
        business_name VARCHAR(255),
        website VARCHAR(255),
        years_experience VARCHAR(10) NOT NULL,
        monthly_volume VARCHAR(20) NOT NULL,
        
        notary_license VARCHAR(100) NOT NULL,
        license_expiration DATE NOT NULL,
        notary_states TEXT[],
        eo_insurance VARCHAR(100) NOT NULL,
        insurance_amount INTEGER NOT NULL,
        background_check VARCHAR(100),
        digital_notary_services BOOLEAN DEFAULT FALSE,
        bilingual_services BOOLEAN DEFAULT FALSE,
        
        primary_counties TEXT,
        additional_counties TEXT,
        service_radius INTEGER DEFAULT 25,
        max_travel_distance INTEGER DEFAULT 50,
        weekdays_available BOOLEAN DEFAULT TRUE,
        evenings_available BOOLEAN DEFAULT FALSE,
        weekends_available BOOLEAN DEFAULT FALSE,
        holidays_available BOOLEAN DEFAULT FALSE,
        emergency_services BOOLEAN DEFAULT FALSE,
        
        refinance_with_insurance INTEGER DEFAULT 12500,
        refinance_without_insurance INTEGER DEFAULT 10000,
        home_equity_heloc INTEGER DEFAULT 15000,
        purchase_closings INTEGER DEFAULT 17500,
        reverse_mortgage INTEGER DEFAULT 20000,
        loan_modification INTEGER DEFAULT 12500,
        commercial_closing INTEGER DEFAULT 25000,
        ron_signings INTEGER DEFAULT 15000,
        travel_fee_per_mile INTEGER DEFAULT 65,
        
        independent_contractor_agreed BOOLEAN DEFAULT FALSE,
        privacy_policy_agreed BOOLEAN DEFAULT FALSE,
        code_of_conduct_agreed BOOLEAN DEFAULT FALSE,
        service_level_agreed BOOLEAN DEFAULT FALSE,
        electronic_signature_agreed BOOLEAN DEFAULT FALSE,
        agreements_signed_at TIMESTAMP,
        
        reviewed_by INTEGER,
        reviewed_at TIMESTAMP,
        rejection_reason TEXT,
        notes TEXT
      )
    `);
    console.log('✅ Applications table created');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('agent', 'company', 'admin')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        
        profile JSONB,
        application_id INTEGER REFERENCES applications(id),
        
        reset_token VARCHAR(64),
        reset_token_expiry TIMESTAMP,
        last_logout TIMESTAMP,
        
        total_jobs_completed INTEGER DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0.0,
        on_time_percentage INTEGER DEFAULT 100,
        total_earnings INTEGER DEFAULT 0
      )
    `);
    console.log('✅ Users table created');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type)');
    console.log('✅ Database indexes created');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminEmail = 'admin@signingconnect.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const adminProfile = {
      firstName: 'System',
      lastName: 'Administrator',
      role: 'Super Admin',
      permissions: ['all']
    };

    try {
      await client.query(`
        INSERT INTO users (email, password_hash, user_type, profile, status)
        VALUES ($1, $2, 'admin', $3, 'active')
        ON CONFLICT (email) DO NOTHING
      `, [adminEmail, hashedPassword, JSON.stringify(adminProfile)]);
      
      console.log('✅ Admin user created');
      console.log('📧 Admin Email: admin@signingconnect.com');
      console.log('🔑 Admin Password: admin123');
    } catch (error) {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Database migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };