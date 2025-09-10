const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// JWT secret - in production, use a strong environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

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

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.'
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const userQuery = 'SELECT * FROM users WHERE id = $1 AND status = $2';
    const result = await pool.query(userQuery, [decoded.userId, 'active']);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

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

// =============================================================================
// AUTHENTICATION ENDPOINTS
// =============================================================================

// Company registration endpoint
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      userType,
      email,
      password,
      companyName,
      contactName,
      phone,
      address
    } = req.body;

    // Validate required fields
    if (!email || !password || !companyName || !contactName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if user already exists
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user profile
    const profile = {
      companyName,
      contactName,
      phone,
      address,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Insert new user
    const insertQuery = `
      INSERT INTO users (email, password_hash, user_type, profile, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, user_type, profile, created_at
    `;
    
    const result = await client.query(insertQuery, [
      email,
      hashedPassword,
      'company',
      JSON.stringify(profile),
      'active'
    ]);

    const newUser = result.rows[0];

    await client.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        userType: newUser.user_type 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('New company registered:', email);

    // Send response without password
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        userType: newUser.user_type,
        profile: newUser.profile,
        createdAt: newUser.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    
    if (error.code === '23505') {
      res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create account. Please try again.'
      });
    }
  } finally {
    client.release();
  }
});

// Login endpoint
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from database
    const userQuery = `
      SELECT id, email, password_hash, user_type, profile, status, last_login 
      FROM users 
      WHERE email = $1 AND user_type = $2
    `;
    
    const result = await pool.query(userQuery, [email, userType]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('User logged in:', email, 'Type:', userType);

    // Send response without password
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        profile: user.profile,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        userType: req.user.user_type,
        profile: req.user.profile,
        lastLogin: req.user.last_login
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Check if user exists
    const userQuery = 'SELECT id, email FROM users WHERE email = $1';
    const result = await pool.query(userQuery, [email]);
    
    if (result.rows.length === 0) {
      // Don't reveal whether email exists for security
      return res.json({
        success: true,
        message: 'If an account with this email exists, password reset instructions have been sent.'
      });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, user.id]
    );

    // TODO: Send password reset email
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({
      success: true,
      message: 'Password reset instructions have been sent to your email address.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request. Please try again.'
    });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Find user with valid reset token
    const userQuery = `
      SELECT id, email 
      FROM users 
      WHERE reset_token = $1 AND reset_token_expiry > CURRENT_TIMESTAMP
    `;
    
    const result = await pool.query(userQuery, [token]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    console.log('Password reset completed for:', user.email);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.'
    });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        userType: req.user.user_type,
        profile: req.user.profile,
        totalJobsCompleted: req.user.total_jobs_completed,
        averageRating: req.user.average_rating,
        onTimePercentage: req.user.on_time_percentage,
        totalEarnings: req.user.total_earnings,
        createdAt: req.user.created_at,
        lastLogin: req.user.last_login
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, req.user.password_hash);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// =============================================================================
// APPLICATION ENDPOINTS (EXISTING)
// =============================================================================

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
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

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
app.get('/api/admin/applications/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

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
app.patch('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

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
        reviewed_by = $4,
        reviewed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING application_id, email, first_name, last_name
    `;
    
    const result = await pool.query(query, [status, rejectionReason, notes, req.user.id, id]);
    
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
  console.log(`JWT Secret: ${JWT_SECRET ? 'Configured' : 'Using default (change in production!)'}`);
});