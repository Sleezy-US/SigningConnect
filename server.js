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

// JWT secret
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
  contentSecurityPolicy: false,
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
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.'
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    environment: process.env.NODE_ENV 
  });
});

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

    if (!email || !password || !companyName || !contactName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = {
      companyName,
      contactName,
      phone,
      address,
      verified: false,
      createdAt: new Date().toISOString()
    };

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

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

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

    const userQuery = 'SELECT id, email FROM users WHERE email = $1';
    const result = await pool.query(userQuery, [email]);
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account with this email exists, password reset instructions have been sent.'
      });
    }

    const user = result.rows[0];

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, user.id]
    );

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

// Submit professional application
app.post('/api/applications/submit', async (req, res) => {
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

    const applicationId = 'SC' + Date.now().toString().slice(-8);

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

    await client.query('COMMIT');

    console.log('Application saved successfully:', applicationId);

    res.status(201).json({
      success: true,
      applicationId: applicationId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Application submission error:', error);
    
    if (error.code === '23505') {
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

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`SigningConnect API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`JWT Secret: ${JWT_SECRET ? 'Configured' : 'Using default (change in production!)'}`);
});