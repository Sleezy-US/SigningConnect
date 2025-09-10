const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migration...');
    
    // Create applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(20) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Personal Information
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
        
        -- Professional Credentials
        notary_license VARCHAR(100) NOT NULL,
        license_expiration DATE NOT NULL,
        notary_states TEXT[],
        eo_insurance VARCHAR(100) NOT NULL,
        insurance_amount INTEGER NOT NULL,
        background_check VARCHAR(100),
        digital_notary_services BOOLEAN DEFAULT FALSE,
        bilingual_services BOOLEAN DEFAULT FALSE,
        
        -- Service Coverage
        primary_counties TEXT,
        additional_counties TEXT,
        service_radius INTEGER DEFAULT 25,
        max_travel_distance INTEGER DEFAULT 50,
        weekdays_available BOOLEAN DEFAULT TRUE,
        evenings_available BOOLEAN DEFAULT FALSE,
        weekends_available BOOLEAN DEFAULT FALSE,
        holidays_available BOOLEAN DEFAULT FALSE,
        emergency_services BOOLEAN DEFAULT FALSE,
        
        -- Fee Structure (stored as cents)
        refinance_with_insurance INTEGER DEFAULT 12500,
        refinance_without_insurance INTEGER DEFAULT 10000,
        home_equity_heloc INTEGER DEFAULT 15000,
        purchase_closings INTEGER DEFAULT 17500,
        reverse_mortgage INTEGER DEFAULT 20000,
        loan_modification INTEGER DEFAULT 12500,
        commercial_closing INTEGER DEFAULT 25000,
        ron_signings INTEGER DEFAULT 15000,
        travel_fee_per_mile INTEGER DEFAULT 65,
        
        -- Legal Agreements
        independent_contractor_agreed BOOLEAN DEFAULT FALSE,
        privacy_policy_agreed BOOLEAN DEFAULT FALSE,
        code_of_conduct_agreed BOOLEAN DEFAULT FALSE,
        service_level_agreed BOOLEAN DEFAULT FALSE,
        electronic_signature_agreed BOOLEAN DEFAULT FALSE,
        agreements_signed_at TIMESTAMP,
        
        -- Review Information
        reviewed_by INTEGER,
        reviewed_at TIMESTAMP,
        rejection_reason TEXT,
        notes TEXT
      )
    `);
    console.log('✓ Applications table created');

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
        
        total_jobs_completed INTEGER DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0.0,
        on_time_percentage INTEGER DEFAULT 100,
        total_earnings INTEGER DEFAULT 0
      )
    `);
    console.log('✓ Users table created');

    // Create jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES users(id),
        assigned_agent_id INTEGER REFERENCES users(id),
        
        title VARCHAR(255) NOT NULL,
        document_type VARCHAR(255),
        location TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        estimated_duration INTEGER,
        
        fee_amount INTEGER NOT NULL,
        travel_fee INTEGER DEFAULT 0,
        total_amount INTEGER NOT NULL,
        
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'filled', 'in_progress', 'completed', 'cancelled')),
        priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'emergency')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_at TIMESTAMP,
        completed_at TIMESTAMP,
        
        special_instructions TEXT,
        requires_scan_back BOOLEAN DEFAULT TRUE,
        requires_id_verification BOOLEAN DEFAULT TRUE,
        max_distance_miles INTEGER DEFAULT 25,
        
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'paid', 'disputed')),
        platform_fee INTEGER,
        agent_payout INTEGER,
        paid_at TIMESTAMP
      )
    `);
    console.log('✓ Jobs table created');

    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        application_id INTEGER REFERENCES applications(id),
        job_id INTEGER REFERENCES jobs(id),
        user_id INTEGER REFERENCES users(id),
        
        document_type VARCHAR(50) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_hash VARCHAR(64),
        
        encrypted BOOLEAN DEFAULT TRUE,
        retention_date DATE,
        accessed_count INTEGER DEFAULT 0,
        
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP,
        
        storage_provider VARCHAR(20) DEFAULT 'railway',
        storage_path TEXT NOT NULL
      )
    `);
    console.log('✓ Documents table created');

    // Create job applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(id),
        agent_id INTEGER NOT NULL REFERENCES users(id),
        
        proposed_fee INTEGER,
        availability_confirmed BOOLEAN DEFAULT TRUE,
        estimated_travel_time INTEGER,
        additional_notes TEXT,
        
        status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'accepted', 'rejected', 'withdrawn')),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP,
        
        UNIQUE(job_id, agent_id)
      )
    `);
    console.log('✓ Job applications table created');

    // Create reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES jobs(id),
        reviewer_id INTEGER NOT NULL REFERENCES users(id),
        reviewee_id INTEGER NOT NULL REFERENCES users(id),
        
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        would_work_again BOOLEAN,
        
        professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
        punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
        quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Reviews table created');

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        
        read BOOLEAN DEFAULT FALSE,
        email_sent BOOLEAN DEFAULT FALSE,
        sms_sent BOOLEAN DEFAULT FALSE,
        
        job_id INTEGER REFERENCES jobs(id),
        application_id INTEGER REFERENCES applications(id),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_at TIMESTAMP
      )
    `);
    console.log('✓ Notifications table created');

    // Create audit log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER NOT NULL,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Audit log table created');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at)');

    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');

    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_assigned_agent_id ON jobs(assigned_agent_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_jobs_appointment_date ON jobs(appointment_date)');

    await client.query('CREATE INDEX IF NOT EXISTS idx_documents_application_id ON documents(application_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_documents_job_id ON documents(job_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type)');

    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)');

    console.log('✓ Indexes created');

    // Create update timestamp function and triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
      CREATE TRIGGER update_applications_updated_at 
      BEFORE UPDATE ON applications 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
      CREATE TRIGGER update_jobs_updated_at 
      BEFORE UPDATE ON jobs 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✓ Triggers created');

    console.log('\n🎉 Database migration completed successfully!');
    console.log('\nTables created:');
    console.log('- applications (pending agent applications)');
    console.log('- users (approved agents and companies)'); 
    console.log('- jobs (signing job postings)');
    console.log('- documents (uploaded files)');
    console.log('- job_applications (agent applications for jobs)');
    console.log('- reviews (ratings and feedback)');
    console.log('- notifications (system notifications)');
    console.log('- audit_log (security and compliance)');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };