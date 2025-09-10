import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, CheckCircle, Shield, User, Scale, MapPin, DollarSign, FileText, AlertTriangle, Lock, X } from 'lucide-react';

const ProfessionalRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cellPhone: '',
      address: '',
      city: '',
      state: 'FL',
      zipCode: '',
      businessName: '',
      website: '',
      yearsExperience: '',
      monthlyVolume: ''
    },
    credentials: {
      notaryLicense: '',
      licenseExpiration: '',
      notaryStates: ['FL'],
      eoInsurance: '',
      insuranceAmount: '',
      digitalNotaryServices: false,
      bilingualServices: false
    },
    coverage: {
      primaryCounties: '',
      additionalCounties: '',
      serviceRadius: '25',
      availabilitySchedule: {
        weekdays: true,
        evenings: false,
        weekends: false,
        holidays: false
      },
      emergencyServices: false,
      travelWillingness: '50'
    },
    fees: {
      refinanceWithInsurance: '125',
      refinanceWithoutInsurance: '100',
      homeEquityHELOC: '150',
      purchaseClosings: '175',
      reverseMortgage: '200',
      loanModification: '125',
      commercialClosing: '250',
      ronSignings: '150',
      travelFeePerMile: '0.65'
    },
    agreements: {
      independentContractor: false,
      privacyPolicy: false,
      codeOfConduct: false,
      serviceLevel: false,
      electronicSignature: false
    }
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Professional Credentials', icon: Shield },
    { id: 3, title: 'Service Coverage', icon: MapPin },
    { id: 4, title: 'Fee Structure', icon: DollarSign },
    { id: 5, title: 'Document Upload', icon: Upload },
    { id: 6, title: 'Legal Agreements', icon: Scale },
    { id: 7, title: 'Review & Submit', icon: CheckCircle }
  ];

  // Form update helpers
  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateNestedFormData = (section, parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: { ...prev[section][parentField], [childField]: value }
      }
    }));
  };

  // File upload handler
  const handleFileUpload = (documentType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPEG, and PNG files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: {
        file,
        name: file.name,
        size: file.size,
        uploadDate: new Date()
      }
    }));
  };

  const removeFile = (documentType) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };

  // Navigation
  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  // Validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.personalInfo.firstName && formData.personalInfo.lastName && 
               formData.personalInfo.email && formData.personalInfo.phone && 
               formData.personalInfo.yearsExperience && formData.personalInfo.monthlyVolume;
      case 2:
        return formData.credentials.notaryLicense && formData.credentials.licenseExpiration && 
               formData.credentials.eoInsurance && formData.credentials.insuranceAmount;
      case 6:
        return formData.agreements.independentContractor && formData.agreements.privacyPolicy && 
               formData.agreements.codeOfConduct && formData.agreements.serviceLevel;
      default:
        return true;
    }
  };

  // API submission
  const submitApplication = async () => {
    if (!validateStep(6)) {
      alert('Please complete all required agreements before submitting.');
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: formData.personalInfo,
          credentials: formData.credentials,
          coverage: formData.coverage,
          fees: formData.fees,
          agreements: formData.agreements
        })
      });

      const result = await response.json();

      if (result.success) {
        setApplicationId(result.applicationId);
        setIsSubmitted(true);
        localStorage.setItem('signingconnect_application_id', result.applicationId);
      } else {
        setSubmitError(result.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Personal Information
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Professional Signing Agent Application</h3>
        <p className="text-blue-700">Complete all sections to join our certified network of professional notaries and signing agents.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.firstName}
            onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.lastName}
            onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.email}
            onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone *</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.phone}
            onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cell Phone</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.cellPhone}
            onChange={(e) => updateFormData('personalInfo', 'cellPhone', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.address}
            onChange={(e) => updateFormData('personalInfo', 'address', e.target.value)}
            placeholder="123 Main St, City, State ZIP"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name (if applicable)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.businessName}
            onChange={(e) => updateFormData('personalInfo', 'businessName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.yearsExperience}
            onChange={(e) => updateFormData('personalInfo', 'yearsExperience', e.target.value)}
            required
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years</option>
            <option value="2-3">2-3 years</option>
            <option value="4-5">4-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Signing Volume *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.personalInfo.monthlyVolume}
            onChange={(e) => updateFormData('personalInfo', 'monthlyVolume', e.target.value)}
            required
          >
            <option value="">Select volume</option>
            <option value="1-10">1-10 signings</option>
            <option value="11-25">11-25 signings</option>
            <option value="26-50">26-50 signings</option>
            <option value="51-100">51-100 signings</option>
            <option value="100+">100+ signings</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Step 2: Professional Credentials
  const renderCredentials = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg">
        <h3 className="font-semibold text-amber-900 mb-2">Professional Credentials Required</h3>
        <p className="text-amber-700">All signing agents must maintain current professional licenses and insurance coverage.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notary License Number *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.credentials.notaryLicense}
            onChange={(e) => updateFormData('credentials', 'notaryLicense', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Expiration Date *</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.credentials.licenseExpiration}
            onChange={(e) => updateFormData('credentials', 'licenseExpiration', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E&O Insurance Policy Number *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.credentials.eoInsurance}
            onChange={(e) => updateFormData('credentials', 'eoInsurance', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.credentials.insuranceAmount}
            onChange={(e) => updateFormData('credentials', 'insuranceAmount', e.target.value)}
            required
          >
            <option value="">Select coverage</option>
            <option value="25000">$25,000 (minimum)</option>
            <option value="50000">$50,000</option>
            <option value="100000">$100,000</option>
            <option value="250000">$250,000+</option>
          </select>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Background Check Requirements</h4>
        <p className="text-blue-800 mb-3">
          A current background check from the National Notary Association (NNA) is required for all signing agents.
        </p>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Required criteria:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>10-year criminal history search</li>
            <li>SSN trace verification</li>
            <li>County, state, and federal criminal searches</li>
            <li>Sex offender registry check</li>
            <li>USA Patriot Act compliance</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-100 rounded">
            <p className="font-medium">Get your NNA background check:</p>
            <p>Visit <a href="https://www.nationalnotary.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">nationalnotary.org</a> or call (800) 876-6827</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="digitalServices"
            className="rounded border-gray-300"
            checked={formData.credentials.digitalNotaryServices}
            onChange={(e) => updateFormData('credentials', 'digitalNotaryServices', e.target.checked)}
          />
          <label htmlFor="digitalServices" className="text-sm text-gray-700">I provide Remote Online Notary (RON) services</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bilingualServices"
            className="rounded border-gray-300"
            checked={formData.credentials.bilingualServices}
            onChange={(e) => updateFormData('credentials', 'bilingualServices', e.target.checked)}
          />
          <label htmlFor="bilingualServices" className="text-sm text-gray-700">I provide bilingual signing services</label>
        </div>
      </div>
    </div>
  );

  // Step 3: Service Coverage
  const renderServiceCoverage = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Service Coverage Areas</h3>
        <p className="text-green-700">Define your service areas and availability to receive relevant job opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Counties Served *</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={formData.coverage.primaryCounties}
              onChange={(e) => updateFormData('coverage', 'primaryCounties', e.target.value)}
              placeholder="Orange County, Osceola County, Seminole County"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Counties (if applicable)</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              value={formData.coverage.additionalCounties}
              onChange={(e) => updateFormData('coverage', 'additionalCounties', e.target.value)}
              placeholder="Lake County, Volusia County"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Standard Service Radius</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.coverage.serviceRadius}
              onChange={(e) => updateFormData('coverage', 'serviceRadius', e.target.value)}
            >
              <option value="15">15 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="75">75 miles</option>
              <option value="100">100+ miles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Travel Distance</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.coverage.travelWillingness}
              onChange={(e) => updateFormData('coverage', 'travelWillingness', e.target.value)}
            >
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="75">75 miles</option>
              <option value="100">100 miles</option>
              <option value="150">150+ miles</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Availability Schedule</label>
            <div className="space-y-3">
              {[
                { key: 'weekdays', label: 'Weekdays (Mon-Fri, 9 AM - 5 PM)' },
                { key: 'evenings', label: 'Evenings (5 PM - 8 PM)' },
                { key: 'weekends', label: 'Weekends (Sat-Sun)' },
                { key: 'holidays', label: 'Holidays' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={key}
                    className="rounded border-gray-300"
                    checked={formData.coverage.availabilitySchedule[key]}
                    onChange={(e) => updateNestedFormData('coverage', 'availabilitySchedule', key, e.target.checked)}
                  />
                  <label htmlFor={key} className="text-sm text-gray-700">{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emergencyServices"
              className="rounded border-gray-300"
              checked={formData.coverage.emergencyServices}
              onChange={(e) => updateFormData('coverage', 'emergencyServices', e.target.checked)}
            />
            <label htmlFor="emergencyServices" className="text-sm text-gray-700">Available for emergency/rush signings (additional fees apply)</label>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Fee Structure
  const renderFeeStructure = () => {
    const feeCategories = [
      {
        title: 'Residential Loan Signings',
        fees: [
          { key: 'refinanceWithInsurance', label: 'Refinance with Title Insurance', placeholder: '125' },
          { key: 'refinanceWithoutInsurance', label: 'Refinance without Title Insurance', placeholder: '100' },
          { key: 'homeEquityHELOC', label: 'Home Equity/HELOC', placeholder: '150' },
          { key: 'purchaseClosings', label: 'Purchase Closings', placeholder: '175' }
        ]
      },
      {
        title: 'Specialized Services',
        fees: [
          { key: 'reverseMortgage', label: 'Reverse Mortgage', placeholder: '200' },
          { key: 'loanModification', label: 'Loan Modification', placeholder: '125' },
          { key: 'commercialClosing', label: 'Commercial Closing', placeholder: '250' },
          { key: 'ronSignings', label: 'Remote Online Notary (RON)', placeholder: '150' },
          { key: 'travelFeePerMile', label: 'Travel Fee per Mile', placeholder: '0.65', step: '0.01' }
        ]
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Fee Structure</h3>
          <p className="text-purple-700">Set your competitive rates for different types of signing services. These will be your standard fees visible to title companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feeCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">{category.title}</h4>
              {category.fees.map(({ key, label, placeholder, step }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      step={step || "1"}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.fees[key]}
                      onChange={(e) => updateFormData('fees', key, e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Fee Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Fees are your standard rates - you can negotiate higher for complex or rush jobs</li>
            <li>• Travel fees apply beyond your standard service radius</li>
            <li>• Emergency/rush fees typically add 25-50% to base rates</li>
            <li>• All fees are subject to market competition and company budgets</li>
          </ul>
        </div>
      </div>
    );
  };

  // Step 5: Document Upload
  const renderDocumentUpload = () => {
    const requiredDocs = [
      { key: 'governmentId', label: 'Government Issued Photo ID', required: true, description: 'Driver\'s license, passport, or state ID' },
      { key: 'notaryLicense', label: 'Notary License/Commission', required: true, description: 'Current notary commission certificate' },
      { key: 'eoInsurance', label: 'E&O Insurance Certificate', required: true, description: 'Current errors & omissions insurance policy' },
      { key: 'backgroundCheck', label: 'NNA Background Check', required: true, description: 'National Notary Association background screening' },
      { key: 'resume', label: 'Professional Resume', required: false, description: 'Current resume highlighting notary experience' },
      { key: 'w9Form', label: 'W-9 Tax Form', required: true, description: 'Completed IRS Form W-9 for tax reporting' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">Required Documentation</h3>
          <p className="text-red-700">Upload all required documents to complete your application. Files must be PDF, JPEG, or PNG format, under 10MB each.</p>
        </div>

        <div className="space-y-6">
          {requiredDocs.map((doc) => (
            <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    {doc.label}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
                {doc.required && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Required
                  </span>
                )}
              </div>

              {uploadedFiles[doc.key] ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{uploadedFiles[doc.key].name}</p>
                      <p className="text-xs text-green-700">
                        {(uploadedFiles[doc.key].size / 1024 / 1024).toFixed(1)}MB • 
                        Uploaded {uploadedFiles[doc.key].uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(doc.key)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(doc.key, e)}
                    className="hidden"
                    id={`file-${doc.key}`}
                  />
                  <label htmlFor={`file-${doc.key}`} className="cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPEG, PNG up to 10MB</p>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Document Security</h4>
              <p className="text-sm text-blue-700 mt-1">
                All uploaded documents are encrypted and stored securely. They are only accessible to authorized personnel for verification purposes and will be permanently deleted after account approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 6: Legal Agreements
  const renderLegalAgreements = () => {
    const agreements = [
      {
        key: 'independentContractor',
        title: 'Independent Contractor Agreement',
        description: 'Defines the relationship between you and SigningConnect as independent contractors, not employees.',
        required: true
      },
      {
        key: 'privacyPolicy',
        title: 'Privacy Policy & Data Protection',
        description: 'Outlines how we collect, use, and protect your personal and professional information.',
        required: true
      },
      {
        key: 'codeOfConduct',
        title: 'Professional Code of Conduct',
        description: 'Standards of professional behavior, ethics, and quality expected from network agents.',
        required: true
      },
      {
        key: 'serviceLevel',
        title: 'Service Level Agreement',
        description: 'Performance standards, response times, and quality requirements for signing services.',
        required: true
      },
      {
        key: 'electronicSignature',
        title: 'Electronic Signature Consent',
        description: 'Consent to use electronic signatures for all agreements and documentation.',
        required: false
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Legal Agreements & Terms</h3>
          <p className="text-yellow-700">Please review and acknowledge the following agreements to complete your application.</p>
        </div>

        <div className="space-y-4">
          {agreements.map((agreement) => (
            <div key={agreement.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={agreement.key}
                  className="mt-1 rounded border-gray-300"
                  checked={formData.agreements[agreement.key]}
                  onChange={(e) => updateFormData('agreements', agreement.key, e.target.checked)}
                  required={agreement.required}
                />
                <div className="flex-1">
                  <label htmlFor={agreement.key} className="block">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      {agreement.title}
                      {agreement.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{agreement.description}</p>
                  </label>
                  <button className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    View Full Document
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Electronic Signature Declaration</h4>
          <p className="text-sm text-gray-700 mb-3">
            By checking the agreements above, you acknowledge that:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>You have read and understand all terms and conditions</li>
            <li>You agree to be legally bound by these agreements</li>
            <li>Your electronic signature has the same legal effect as a handwritten signature</li>
            <li>You can withdraw consent to electronic transactions at any time</li>
          </ul>
        </div>
      </div>
    );
  };

  // Step 7: Review & Submit
  const renderReviewSubmit = () => {
    const getCompletionStatus = () => {
      const requiredFields = [
        formData.personalInfo.firstName,
        formData.personalInfo.lastName,
        formData.personalInfo.email,
        formData.personalInfo.phone,
        formData.personalInfo.yearsExperience,
        formData.personalInfo.monthlyVolume,
        formData.credentials.notaryLicense,
        formData.credentials.licenseExpiration,
        formData.credentials.eoInsurance,
        formData.credentials.insuranceAmount,
        formData.agreements.independentContractor,
        formData.agreements.privacyPolicy,
        formData.agreements.codeOfConduct,
        formData.agreements.serviceLevel
      ];
      return requiredFields.filter(field => field).length / requiredFields.length * 100;
    };

    const completionPercentage = getCompletionStatus();
    const isComplete = completionPercentage === 100;

    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-900 mb-2">Application Review</h3>
          <p className="text-indigo-700">Review your information before submitting your professional signing agent application.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Application Completion</h4>
            <span className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
              {completionPercentage.toFixed(0)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-600' : 'bg-amber-500'}`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                <p><strong>Email:</strong> {formData.personalInfo.email}</p>
                <p><strong>Phone:</strong> {formData.personalInfo.phone}</p>
                <p><strong>Experience:</strong> {formData.personalInfo.yearsExperience}</p>
                <p><strong>Monthly Volume:</strong> {formData.personalInfo.monthlyVolume}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Professional Credentials</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Notary License:</strong> {formData.credentials.notaryLicense}</p>
                <p><strong>License Expires:</strong> {formData.credentials.licenseExpiration}</p>
                <p><strong>E&O Insurance:</strong> {formData.credentials.eoInsurance}</p>
                <p><strong>Coverage:</strong> ${formData.credentials.insuranceAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Service Coverage</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Primary Counties:</strong> {formData.coverage.primaryCounties || 'Not specified'}</p>
                <p><strong>Service Radius:</strong> {formData.coverage.serviceRadius} miles</p>
                <p><strong>Max Travel:</strong> {formData.coverage.travelWillingness} miles</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Fee Structure</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Refinance (w/ insurance):</strong> ${formData.fees.refinanceWithInsurance}</p>
                <p><strong>Purchase Closings:</strong> ${formData.fees.purchaseClosings}</p>
                <p><strong>HELOC:</strong> ${formData.fees.homeEquityHELOC}</p>
                <p><strong>Travel Fee:</strong> ${formData.fees.travelFeePerMile}/mile</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(uploadedFiles).map(([key, file]) => (
              <div key={key} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
          {Object.keys(uploadedFiles).length === 0 && (
            <p className="text-sm text-gray-500">No documents uploaded</p>
          )}
        </div>

        {!isComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-900">Application Incomplete</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Please complete all required fields and agreements before submitting your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-900">Submission Error</h4>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Success State
  const renderSubmittedState = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <p className="text-lg text-blue-900 font-semibold mb-2">
          Application ID: {applicationId}
        </p>
        <p className="text-blue-700">
          Please save this ID for your records. You'll need it to check your application status.
        </p>
      </div>
      
      <div className="bg-amber-50 p-6 rounded-lg mb-6 text-left">
        <h3 className="font-semibold text-amber-900 mb-3">What Happens Next?</h3>
        <div className="space-y-3 text-amber-800">
          {[
            { step: 1, title: 'Document Verification (1-2 business days)', desc: 'Our compliance team will review your uploaded documents and credentials.' },
            { step: 2, title: 'Background Check Processing (3-5 business days)', desc: 'Professional background verification and reference checks.' },
            { step: 3, title: 'Final Review & Approval (1-2 business days)', desc: 'Final approval and account activation notification.' }
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-semibold mt-0.5">{step}</div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Application Status Updates</h3>
        <p className="text-gray-700 mb-4">
          You'll receive email notifications at each stage of the review process. Expected approval time: 5-7 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
            Check Application Status
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Questions about your application? Contact our support team:</p>
        <p className="font-medium">support@signingconnect.com | (855) 555-0123</p>
      </div>
    </div>
  );

  // Main render
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderCredentials();
      case 3: return renderServiceCoverage();
      case 4: return renderFeeStructure();
      case 5: return renderDocumentUpload();
      case 6: return renderLegalAgreements();
      case 7: return renderReviewSubmit();
      default: return renderPersonalInfo();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg">
            {renderSubmittedState()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Professional Signing Agent Application</h1>
            <p className="text-gray-600 mt-1">Join our network of certified notaries and signing professionals</p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            {/* Mobile Progress */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-blue-600">{steps[currentStep - 1]?.title}</p>
            </div>

            {/* Desktop Progress - Adaptive Display */}
            <div className="hidden md:block">
              <div className="flex items-center justify-center space-x-1">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  const IconComponent = step.icon;
                  
                  // Show current step, previous 2, and next 2 steps
                  const shouldShow = Math.abs(step.id - currentStep) <= 2 || step.id === 1 || step.id === steps.length;
                  
                  if (!shouldShow) {
                    // Show dots for hidden steps
                    if ((step.id === currentStep - 3 && currentStep > 4) || (step.id === currentStep + 3 && currentStep < steps.length - 2)) {
                      return (
                        <div key={step.id} className="flex items-center">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center min-w-0">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted ? 'bg-green-600 border-green-600 text-white' :
                          isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                        </div>
                        <div className="mt-2 text-center max-w-20">
                          <p className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            Step {step.id}
                          </p>
                          <p className={`text-xs leading-tight ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && shouldShow && steps[index + 1] && Math.abs(steps[index + 1].id - currentStep) <= 2 && (
                        <div className={`w-8 lg:w-12 h-0.5 mx-2 ${
                          isCompleted && steps[index + 1].id <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            {currentStep === steps.length ? (
              <button
                onClick={submitApplication}
                disabled={!validateStep(6) || isLoading}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegistration;