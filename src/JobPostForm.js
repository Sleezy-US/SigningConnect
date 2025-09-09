import React, { useState } from 'react';
import { X } from 'lucide-react';

// Separate component for the job form to isolate the state issue
const JobPostForm = ({ onClose, onSubmit }) => {
  // Local state just for this form
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    appointmentDate: '',
    appointmentTime: '',
    fee: '',
    documentType: '',
    specialInstructions: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.appointmentDate || !formData.appointmentTime || !formData.fee) {
      alert('Please fill in all required fields');
      return;
    }

    const jobData = {
      id: Date.now(),
      ...formData,
      fee: parseInt(formData.fee),
      status: 'open',
      assignedAgent: null,
      datePosted: new Date().toISOString().split('T')[0]
    };
    
    onSubmit(jobData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Post New Signing Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signing Type *
              </label>
              <select
                value={formData.title}
                onChange={handleInputChange('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select signing type</option>
                <option value="Purchase Signing">Purchase Signing</option>
                <option value="Refinance Signing">Refinance Signing</option>
                <option value="HELOC Signing">HELOC Signing</option>
                <option value="Reverse Mortgage Signing">Reverse Mortgage Signing</option>
                <option value="Modification Signing">Modification Signing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.fee}
                  onChange={handleInputChange('fee')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Address *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={handleInputChange('location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, Orlando, FL 32801"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={handleInputChange('appointmentDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={handleInputChange('appointmentTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <input
              type="text"
              value={formData.documentType}
              onChange={handleInputChange('documentType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Purchase loan documents"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={handleInputChange('specialInstructions')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions for the signing agent..."
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;