import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, CheckCircle, AlertCircle, FileText, Shield, User, Building, CreditCard, Scale } from 'lucide-react';

const ProfessionalRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      cellPhone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      businessName: '',
      website: '',
      yearsExperience: '',
      monthlyVolume: '',
      billingAddressSame: true
    },
    credentials: {
      notaryLicense: '',
      licenseExpiration: '',
      notaryStates: [],
      eoInsurance: '',
      insuranceAmount: '',
      backgroundCheck: '',
      specializations: [],
      digitalNotaryServices: false,
      bilingualServices: false
    },
    coverage: {
      primaryCounties: '',
      additionalCounties: '',
      serviceRadius: '',
      availabilitySchedule: {
        weekdays: true,
        evenings: false,
        weekends: false,
        holidays: false
      }
    },
    fees: {
      refinanceWithInsurance: '',
      refinanceWithoutInsurance: '',
      homeEquityHELOC: '',
      purchaseClosings: '',
      reverseeMortgage: '',
      loanModification: '',
      commercialClosing: '',
      ronSignings: '',
      travelFeePerMile: ''
    },
    documents: {
      governmentId: null,
      notaryLicense: null,
      eoInsurance: null,
      backgroundCheck: null,
      resume: null,
      w9Form: null,
      additionalCertifications: []
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
    { id: 3, title: 'Service Coverage', icon: Building },
    { id: 4, title: 'Fee Structure', icon: CreditCard },
    { id: 5, title: 'Document Upload', icon: Upload },
    { id: 6, title: 'Legal Agreements', icon: Scale },
    { id: 7, title: 'Review & Submit', icon: CheckCircle }
  ];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.firstName}
            onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.lastName}
            onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.email}
            onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone *</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.phone}
            onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cell Phone *</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.cellPhone}
            onChange={(e) => updateFormData('personalInfo', 'cellPhone', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.personalInfo.businessName}
            onChange={(e) => updateFormData('personalInfo', 'businessName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
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
            className="w-full border border-gray-300 rounded-md px-3 py-2"
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
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.credentials.notaryLicense}
            onChange={(e) => updateFormData('credentials', 'notaryLicense', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Expiration Date *</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.credentials.licenseExpiration}
            onChange={(e) => updateFormData('credentials', 'licenseExpiration', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E&O Insurance Policy Number *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.credentials.eoInsurance}
            onChange={(e) => updateFormData('credentials', 'eoInsurance', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
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
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-semibold mt-0.5">1</div>
            <div>
              <p className="font-medium">Document Verification (1-2 business days)</p>
              <p className="text-sm">Our compliance team will review your uploaded documents and credentials.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-semibold mt-0.5">2</div>
            <div>
              <p className="font-medium">Background Check Processing (3-5 business days)</p>
              <p className="text-sm">Professional background verification and reference checks.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-semibold mt-0.5">3</div>
            <div>
              <p className="font-medium">Final Review & Approval (1-2 business days)</p>
              <p className="text-sm">Final approval and account activation notification.</p>
            </div>
          </div>
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
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md transition-colors">
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

  const submitApplication = () => {
    const appId = 'SC' + Date.now().toString().slice(-8);
    setApplicationId(appId);
    setIsSubmitted(true);
    console.log('Submitting application:', formData);
  };

  if (isSubmitted) {
    return renderSubmittedState();
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderCredentials();
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Step {currentStep}</h3>
            <p className="text-gray-600">Additional form sections coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Professional Signing Agent Application</h1>
            <p className="text-gray-600 mt-1">Join our network of certified notaries and signing professionals</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const IconComponent = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted ? 'bg-green-600 border-green-600 text-white' :
                      isActive ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-8">
            {renderStepContent()}
          </div>

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
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                Submit Application
                <CheckCircle className="w-4 h-4 ml-1" />
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