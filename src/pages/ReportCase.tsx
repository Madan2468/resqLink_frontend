import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../context/CasesContext';
import { Camera, Upload, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import LocationPicker from '../components/forms/LocationPicker';

const ReportCase: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createCase } = useCases();
  const navigate = useNavigate();
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          photo: 'Photo size should be less than 5MB'
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setPhoto(file);
      
      // Clear error if it exists
      if (errors.photo) {
        const newErrors = { ...errors };
        delete newErrors.photo;
        setErrors(newErrors);
      }
    }
  };
  
  const handleLocationSelected = (loc: { lat: number; lng: number; address?: string }) => {
    setLocation(loc);
    
    // Clear error if it exists
    if (errors.location) {
      const newErrors = { ...errors };
      delete newErrors.location;
      setErrors(newErrors);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Please provide a title for the case';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please provide a description of the situation';
    }
    
    if (!photo) {
      newErrors.photo = 'Please upload a photo of the animal';
    }
    
    if (!location) {
      newErrors.location = 'Please select the location on the map';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare case data
    if (!photo || !location) return;
    
    const caseData = {
      title,
      description,
      photo,
      location,
      urgency
    };
    
    try {
      setSubmitting(true);
      const response = await createCase(caseData);
      
      setSubmitSuccess(true);
      
      // Redirect to the case details page after 2 seconds
      setTimeout(() => {
        navigate(`/cases/${response._id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting case:', error);
      setErrors({
        ...errors,
        form: 'An error occurred while submitting your case. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6">
            <h1 className="text-2xl font-bold text-white">Report an Animal in Need</h1>
            <p className="text-green-100 mt-1">
              Provide details about the animal so rescuers can help quickly
            </p>
          </div>
          
          {submitSuccess ? (
            <div className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Reported Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for taking the time to report this case. Rescuers will be notified and will respond as soon as possible.
              </p>
              <p className="text-gray-600">
                Redirecting you to the case details page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.form && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              )}
              
              <div className="form-input-group">
                <label htmlFor="title" className="form-label">
                  Case Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`form-input ${errors.title ? 'border-red-300' : ''}`}
                  placeholder="E.g., Injured dog on Main Street"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              <div className="form-input-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`form-input ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Provide details about the animal's condition, behavior, and surroundings"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              <div className="form-input-group">
                <label className="form-label">
                  Photo <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    errors.photo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {photoPreview ? (
                    <div className="space-y-3">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="mx-auto h-48 object-contain rounded"
                      />
                      <p className="text-sm text-gray-500">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-8">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-700 font-medium">Upload a photo</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Click to browse or drag and drop
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
              </div>
              
              <div className="form-input-group">
                <label className="form-label">
                  Location <span className="text-red-500">*</span>
                </label>
                <LocationPicker onLocationSelected={handleLocationSelected} />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                
                {location?.address && (
                  <div className="mt-2 flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                )}
              </div>
              
              <div className="form-input-group">
                <label className="form-label">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="low"
                      checked={urgency === 'low'}
                      onChange={() => setUrgency('low')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Low</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="medium"
                      checked={urgency === 'medium'}
                      onChange={() => setUrgency('medium')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Medium</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="high"
                      checked={urgency === 'high'}
                      onChange={() => setUrgency('high')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">High</span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  High urgency should be used for animals in immediate danger or severely injured
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Report
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCase;