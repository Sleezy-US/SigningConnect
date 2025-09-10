const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at', res.rows[0].now);
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow React app to load
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://signingconnect-production.up.railway.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Application submission rate limiting (stricter)
const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 application submissions per hour
  message: 'Too many application submissions, please try again later.'
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    environment: process.env.NODE_ENV 
  });
});

// Submit professional application
app.post('/api/applications/submit', applicationLimiter, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      personalInfo,
      credentials,
      coverage,
      fees,
      agreements
    } = req.body;

    console.log('Received application submission for:', personalInfo.email);

    // Generate unique application ID
    const applicationId = 'SC' + Date.now().toString().slice(-8);

    // Insert application
    const insertQuery = `
      INSERT INTO applications (
        application_id,
        first_name,
        last_name,
        email,
        phone,
        cell_phone,
        address,
        city,
        state,
        zip_code,
        business_name,
        website,
        years_experience,
        monthly_volume,
        
        notary_license,
        license_expiration,
        notary_states,
        eo_insurance,
        insurance_amount,
        digital_notary_services,
        bilingual_services,
        
        primary_counties,
        additional_counties,
        service_radius,
        max_travel_distance,
        weekdays_available,
        evenings_available,
        weekends_available,
        holidays_available,
        emergency_services,
        
        refinance_with_insurance,
        refinance_without_insurance,
        home_equity_heloc,
        purchase_closings,
        reverse_mortgage,
        loan_modification,
        commercial_closing,
        ron_signings,
        travel_fee_per_mile,
        
        independent_contractor_agreed,
        privacy_policy_agreed,
        code_of_conduct_agreed,
        service_level_agreed,
        electronic_signature_agreed,
        agreements_signed_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46
      ) RETURNING id
    `;

    const values = [
      applicationId,
      personalInfo.firstName,
      personalInfo.lastName,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.cellPhone || null,
      personalInfo.address || null,
      personalInfo.city || null,
      personalInfo.state || 'FL',
      personalInfo.zipCode || null,
      personalInfo.businessName || null,
      personalInfo.website || null,
      personalInfo.yearsExperience,
      personalInfo.monthlyVolume,
      
      credentials.notaryLicense,
      credentials.licenseExpiration,
      credentials.notaryStates || ['FL'],
      credentials.eoInsurance,
      parseInt(credentials.insuranceAmount),
      credentials.digitalNotaryServices || false,
      credentials.bilingualServices || false,
      
      coverage.primaryCounties || null,
      coverage.additionalCounties || null,
      parseInt(coverage.serviceRadius) || 25,
      parseInt(coverage.travelWillingness) || 50,
      coverage.availabilitySchedule?.weekdays || true,
      coverage.availabilitySchedule?.evenings || false,
      coverage.availabilitySchedule?.weekends || false,
      coverage.availabilitySchedule?.holidays || false,
      coverage.emergencyServices || false,
      
      Math.round(parseFloat(fees.refinanceWithInsurance || 125) * 100),
      Math.round(parseFloat(fees.refinanceWithoutInsurance || 100) * 100),
      Math.round(parseFloat(fees.homeEquityHELOC || 150) * 100),
      Math.round(parseFloat(fees.purchaseClosings || 175) * 100),
      Math.round(parseFloat(fees.reverseMortgage || 200) * 100),
      Math.round(parseFloat(fees.loanModification || 125) * 100),
      Math.round(parseFloat(fees.commercialClosing || 250) * 100),
      Math.round(parseFloat(fees.ronSignings || 150) * 100),
      Math.round(parseFloat(fees.travelFeePerMile || 0.65) * 100),
      
      agreements.independentContractor || false,
      agreements.privacyPolicy || false,
      agreements.codeOfConduct || false,
      agreements.serviceLevel || false,
      agreements.electronicSignature || false,
      new Date()
    ];

    const result = await client.query(insertQuery, values);
    const newApplicationId = result.rows[0].id;

    await client.query('COMMIT');

    // Send confirmation email (placeholder)
    await sendApplicationConfirmationEmail(personalInfo.email, applicationId);

    console.log('Application saved successfully:', applicationId);

    res.status(201).json({
      success: true,
      applicationId: applicationId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Application submission error:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({
        success: false,
        message: 'An application with this email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit application. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } finally {
    client.release();
  }
});

// Get application status
app.get('/api/applications/status/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const query = `
      SELECT 
        application_id,
        status,
        created_at,
        updated_at,
        reviewed_at,
        rejection_reason
      FROM applications 
      WHERE application_id = $1
    `;
    
    const result = await pool.query(query, [applicationId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const application = result.rows[0];
    
    res.json({
      success: true,
      application: {
        id: application.application_id,
        status: application.status,
        submittedAt: application.created_at,
        lastUpdated: application.updated_at,
        reviewedAt: application.reviewed_at,
        rejectionReason: application.rejection_reason
      }
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check application status'
    });
  }
});

// Admin: Get all applications
app.get('/api/admin/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        id,
        application_id,
        first_name,
        last_name,
        email,
        phone,
        status,
        years_experience,
        monthly_volume,
        created_at,
        updated_at
      FROM applications
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM applications';
    const countParams = [];
    
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      applications: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Admin applications fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// Admin: Get application details
app.get('/api/admin/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM applications WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const application = result.rows[0];
    
    // Convert cents back to dollars for fees
    const feeFields = [
      'refinance_with_insurance',
      'refinance_without_insurance',
      'home_equity_heloc',
      'purchase_closings',
      'reverse_mortgage',
      'loan_modification',
      'commercial_closing',
      'ron_signings',
      'travel_fee_per_mile'
    ];
    
    feeFields.forEach(field => {
      if (application[field]) {
        application[field] = application[field] / 100;
      }
    });
    
    res.json({
      success: true,
      application
    });
    
  } catch (error) {
    console.error('Application details fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application details'
    });
  }
});

// Admin: Update application status
app.patch('/api/admin/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, notes } = req.body;
    
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const query = `
      UPDATE applications 
      SET 
        status = $1,
        rejection_reason = $2,
        notes = $3,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING application_id, email, first_name, last_name
    `;
    
    const result = await pool.query(query, [status, rejectionReason, notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const application = result.rows[0];
    
    // Send status update email
    await sendStatusUpdateEmail(
      application.email,
      application.first_name,
      application.application_id,
      status,
      rejectionReason
    );
    
    // If approved, create user account
    if (status === 'approved') {
      await createAgentAccount(id);
    }
    
    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
    
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

// Serve static files from React build (PRODUCTION ONLY)
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Utility functions
async function sendApplicationConfirmationEmail(email, applicationId) {
  // Placeholder - implement with nodemailer
  console.log(`[EMAIL] Sending confirmation email to ${email} for application ${applicationId}`);
  // TODO: Implement actual email sending
}

async function sendStatusUpdateEmail(email, firstName, applicationId, status, rejectionReason) {
  // Placeholder - implement with nodemailer
  console.log(`[EMAIL] Sending status update email to ${email}: ${status}`);
  // TODO: Implement actual email sending
}

async function createAgentAccount(applicationId) {
  // Create user account when application is approved
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const appQuery = 'SELECT * FROM applications WHERE id = $1';
    const appResult = await client.query(appQuery, [applicationId]);
    const application = appResult.rows[0];
    
    // Generate temporary password (they'll reset it on first login)
    const tempPassword = Math.random().toString(36).slice(-10);
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Create user account
    const userQuery = `
      INSERT INTO users (
        email,
        password_hash,
        user_type,
        application_id,
        profile
      ) VALUES ($1, $2, 'agent', $3, $4)
      RETURNING id
    `;
    
    const profile = {
      firstName: application.first_name,
      lastName: application.last_name,
      phone: application.phone,
      businessName: application.business_name,
      notaryLicense: application.notary_license,
      serviceRadius: application.service_radius,
      fees: {
        refinanceWithInsurance: application.refinance_with_insurance / 100,
        purchaseClosings: application.purchase_closings / 100,
        homeEquityHELOC: application.home_equity_heloc / 100,
        reverseMortgage: application.reverse_mortgage / 100,
        commercialClosing: application.commercial_closing / 100,
        ronSignings: application.ron_signings / 100,
        travelFeePerMile: application.travel_fee_per_mile / 100
      }
    };
    
    await client.query(userQuery, [
      application.email,
      hashedPassword,
      applicationId,
      JSON.stringify(profile)
    ]);
    
    await client.query('COMMIT');
    
    // Send welcome email with temporary password
    console.log(`[ACCOUNT] Created agent account for ${application.email} with temp password: ${tempPassword}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating agent account:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SigningConnect API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});