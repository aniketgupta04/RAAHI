import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const totalSteps = 4;

const DateInput = ({ id, value, placeholder, onTextChange, onDateChange, toIso, ariaLabel }) => {
  const openDatePicker = () => {
    const picker = document.getElementById(`${id}-picker`);
    if (!picker) return;
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
      return;
    }
    picker.click();
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        maxLength={10}
        value={value}
        onChange={onTextChange}
        placeholder={placeholder}
        className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 pr-12 focus:border-primary focus:ring-primary"
      />
      <button
        type="button"
        onClick={openDatePicker}
        aria-label={ariaLabel}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-on-surface-variant hover:bg-surface-container-high"
      >
        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
      </button>
      <input
        id={`${id}-picker`}
        type="date"
        value={value ? toIso(value) : ''}
        onChange={(event) => onDateChange(event.target.value)}
        className="absolute h-0 w-0 opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
};

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: 'Passport',
    idNumber: '',
    dob: '',
    gender: '',
    nationality: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    medical: '',
    agree: false,
  });
  const [itinerary, setItinerary] = useState([{ place: '', from: '', to: '' }]);
  const [emergency, setEmergency] = useState([{ name: '', relation: '', phone: '' }]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [kycFile, setKycFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;
  const previewId = `ST-${formData.idType === 'Aadhaar' ? 'AAD' : formData.idType === 'Voter ID' ? 'VOT' : 'PAS'}-${
    (formData.idNumber.replace(/\D/g, '').slice(-4) || '0001').padStart(4, '0')
  }`;

  const stepMeta = useMemo(
    () => [
      { number: 1, label: 'Personal' },
      { number: 2, label: 'Itinerary' },
      { number: 3, label: 'Emergency' },
      { number: 4, label: 'Review' },
    ],
    []
  );

  const formatAadhaarNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
    const groups = digitsOnly.match(/.{1,4}/g) || [];
    return groups.join('-');
  };

  const formatDob = (value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    const parts = [];

    if (digitsOnly.length > 0) parts.push(digitsOnly.slice(0, 2));
    if (digitsOnly.length > 2) parts.push(digitsOnly.slice(2, 4));
    if (digitsOnly.length > 4) parts.push(digitsOnly.slice(4, 8));

    return parts.join('-');
  };

  const displayDateToIso = (displayDate) => {
    const match = displayDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return '';
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  };

  const isoDateToDisplay = (isoDate) => {
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return '';
    const [, yyyy, mm, dd] = match;
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let nextValue = type === 'checkbox' ? checked : value;

    if (name === 'idType' && value === 'Aadhaar') {
      setFormData((prevData) => ({
        ...prevData,
        idType: value,
        idNumber: formatAadhaarNumber(prevData.idNumber),
      }));
      return;
    }

    if (name === 'idNumber' && formData.idType === 'Aadhaar') {
      nextValue = formatAadhaarNumber(value);
    }

    if (name === 'dob') {
      nextValue = formatDob(value);
    }

    if (name === 'phone') {
      nextValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: nextValue,
    }));
  };

  const handleItineraryChange = (index, event) => {
    const { name, value } = event.target;
    const nextValue = name === 'from' || name === 'to' ? formatDob(value) : value;
    setItinerary((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [name]: nextValue } : item))
    );
  };

  const handleItineraryDatePickerChange = (index, field, isoDate) => {
    setItinerary((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: isoDateToDisplay(isoDate) } : item
      )
    );
  };

  const handleAddItinerary = () => {
    setItinerary((prev) => [...prev, { place: '', from: '', to: '' }]);
  };

  const handleRemoveItinerary = (index) => {
    setItinerary((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleEmergencyChange = (index, field, value) => {
    const nextValue = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setEmergency((prev) =>
      prev.map((contact, contactIndex) => (contactIndex === index ? { ...contact, [field]: nextValue } : contact))
    );
  };

  const handleDobDatePickerChange = (isoDate) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: isoDateToDisplay(isoDate),
    }));
  };

  const handleAddEmergency = () => {
    setEmergency((prev) => [...prev, { name: '', relation: '', phone: '' }]);
  };

  const handleRemoveEmergency = (index) => {
    setEmergency((prev) => prev.filter((_, contactIndex) => contactIndex !== index));
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required';
      if (!formData.idNumber.trim()) nextErrors.idNumber = 'ID number is required';
      if (formData.idType === 'Aadhaar') {
        const aadhaarDigits = formData.idNumber.replace(/\D/g, '');
        if (aadhaarDigits.length !== 12) nextErrors.idNumber = 'Aadhaar number must be exactly 12 digits';
      }
      if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
      if (formData.phone && formData.phone.length !== 10) nextErrors.phone = 'Phone number must be exactly 10 digits';
      if (!formData.email.trim()) nextErrors.email = 'Email is required';
      if (!formData.password.trim()) nextErrors.password = 'Password is required';
      if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setKycFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (!formData.agree) {
      setErrors({ agree: 'You must agree to the terms and conditions' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        touristData: {
          idType: formData.idType,
          idNumber: formData.idNumber,
          dateOfBirth: displayDateToIso(formData.dob) || formData.dob,
          gender: formData.gender,
          nationality: formData.nationality,
          medicalConditions: formData.medical,
          itinerary: itinerary.map((stop) => ({
            ...stop,
            from: displayDateToIso(stop.from) || stop.from,
            to: displayDateToIso(stop.to) || stop.to,
          })),
          emergencyContacts: emergency,
        },
        role: 'user',
        userType: 'tourist',
      };

      const result = await register(registrationData);

      if (result.success) {
        setIsSuccessful(true);
        setErrors({
          success: result.requiresVerification
            ? 'Registration successful! Please check your email for verification link before logging in.'
            : 'Registration successful! Redirecting you to login.',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ submit: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepOne = () => (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-extrabold text-primary">Step 1: Personal Details &amp; KYC</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            First Name
          </label>
          <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. Rahul" className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.firstName && <p className="mt-1 text-xs font-semibold text-error">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Last Name
          </label>
          <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Sharma" className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.lastName && <p className="mt-1 text-xs font-semibold text-error">{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="idType" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            ID Type
          </label>
          <select id="idType" name="idType" value={formData.idType} onChange={handleInputChange} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary">
            <option value="Passport">Passport</option>
            <option value="Aadhaar">Aadhaar</option>
            <option value="Voter ID">Voter ID</option>
          </select>
        </div>

        <div>
          <label htmlFor="idNumber" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {formData.idType === 'Aadhaar' ? 'Aadhaar Number' : 'Passport/Voter ID No.'}
          </label>
          <input id="idNumber" name="idNumber" type="text" value={formData.idNumber} onChange={handleInputChange} inputMode={formData.idType === 'Aadhaar' ? 'numeric' : 'text'} maxLength={formData.idType === 'Aadhaar' ? 14 : 30} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.idNumber && <p className="mt-1 text-xs font-semibold text-error">{errors.idNumber}</p>}
        </div>

        <div>
          <label htmlFor="dob" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Date of Birth (DD-MM-YYYY)
          </label>
          <DateInput
            id="dob"
            value={formData.dob}
            placeholder="DD-MM-YYYY"
            onTextChange={handleInputChange}
            onDateChange={(isoDate) => handleDobDatePickerChange(isoDate)}
            toIso={(displayValue) => displayDateToIso(displayValue)}
            ariaLabel="Select date of birth from calendar"
          />
        </div>

        <div>
          <label htmlFor="gender" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Gender
          </label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary">
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="nationality" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Nationality
          </label>
          <input id="nationality" name="nationality" type="text" value={formData.nationality} onChange={handleInputChange} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-outline-variant bg-surface-container-high px-4 text-sm font-bold text-on-surface-variant">
              +91
            </span>
            <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className="w-full rounded-r-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          </div>
          {errors.phone && <p className="mt-1 text-xs font-semibold text-error">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Email
          </label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.email && <p className="mt-1 text-xs font-semibold text-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Password
          </label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.password && <p className="mt-1 text-xs font-semibold text-error">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Confirm Password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm password" className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 focus:border-primary focus:ring-primary" />
          {errors.confirmPassword && <p className="mt-1 text-xs font-semibold text-error">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="mt-8 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-primary-container">cloud_upload</span>
        <h3 className="mt-2 text-lg font-bold text-primary">Upload KYC Documents</h3>
        <p className="mt-2 text-sm text-on-surface-variant">
          Upload Passport, Aadhaar, or Voter ID (PDF/JPG/PNG, Max 5MB).
        </p>
        <input id="kycUpload" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="mx-auto mt-4 block w-full max-w-xs rounded-lg border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" />
        {kycFile && <p className="mt-2 text-xs font-semibold text-on-surface-variant">Selected: {kycFile.name}</p>}
      </div>
    </section>
  );

  const renderStepTwo = () => (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-extrabold text-primary">Step 2: Itinerary</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Add cities or places you plan to visit and dates. This helps in delivering targeted alerts.
      </p>

      <div className="mt-6 space-y-4">
        {itinerary.map((item, index) => (
          <div key={index} className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-primary">Stop {index + 1}</p>
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveItinerary(index)} className="rounded-md border border-outline-variant px-3 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input type="text" name="place" value={item.place} onChange={(event) => handleItineraryChange(index, event)} placeholder="Place/City" className="rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:border-primary focus:ring-primary" />
              <DateInput
                id={`from-${index}`}
                value={item.from}
                placeholder="From (DD-MM-YYYY)"
                onTextChange={(event) => handleItineraryChange(index, event)}
                onDateChange={(isoDate) => handleItineraryDatePickerChange(index, 'from', isoDate)}
                toIso={(displayValue) => displayDateToIso(displayValue)}
                ariaLabel={`Select from date for stop ${index + 1}`}
              />
              <DateInput
                id={`to-${index}`}
                value={item.to}
                placeholder="To (DD-MM-YYYY)"
                onTextChange={(event) => handleItineraryChange(index, event)}
                onDateChange={(isoDate) => handleItineraryDatePickerChange(index, 'to', isoDate)}
                toIso={(displayValue) => displayDateToIso(displayValue)}
                ariaLabel={`Select to date for stop ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddItinerary} className="mt-4 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low">
        Add another stop
      </button>
    </section>
  );

  const renderStepThree = () => (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-extrabold text-primary">Step 3: Emergency Contacts &amp; Medical</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Provide at least one emergency contact and any medical conditions we should be aware of.
      </p>

      <div className="mt-6 space-y-4">
        {emergency.map((contact, index) => (
          <div key={index} className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-primary">Contact {index + 1}</p>
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveEmergency(index)} className="rounded-md border border-outline-variant px-3 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input type="text" value={contact.name} onChange={(event) => handleEmergencyChange(index, 'name', event.target.value)} placeholder="Full Name" className="rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:border-primary focus:ring-primary" />
              <input type="text" value={contact.relation} onChange={(event) => handleEmergencyChange(index, 'relation', event.target.value)} placeholder="Relation" className="rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:border-primary focus:ring-primary" />
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-outline-variant bg-surface-container-high px-3 text-xs font-bold text-on-surface-variant">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={contact.phone}
                  onChange={(event) => handleEmergencyChange(index, 'phone', event.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-r-lg border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddEmergency} className="mt-4 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low">
        Add another contact
      </button>

      <div className="mt-6">
        <label htmlFor="medical" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Medical conditions / Allergies (optional)
        </label>
        <textarea id="medical" name="medical" rows="4" value={formData.medical} onChange={handleInputChange} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:border-primary focus:ring-primary" />
      </div>
    </section>
  );

  const renderStepFour = () => (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-extrabold text-primary">Step 4: Review &amp; Confirm</h2>

      <div className="mt-6 rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 text-sm">
        <p><strong>Name:</strong> {fullName || '-'}</p>
        <p><strong>ID:</strong> {formData.idType} - {formData.idNumber || '-'}</p>
        <p><strong>DOB:</strong> {formData.dob || '-'}</p>
        <p><strong>Phone:</strong> {formData.phone ? `+91${formData.phone}` : '-'}</p>
        <p><strong>Email:</strong> {formData.email || '-'}</p>
      </div>

      <div className="mt-6 rounded-lg border border-outline-variant/60 bg-surface-container-low p-4">
        <label htmlFor="agree" className="flex cursor-pointer items-start gap-3 text-sm text-on-surface-variant">
          <input id="agree" name="agree" type="checkbox" checked={formData.agree} onChange={handleInputChange} className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" />
          <span>
            I confirm that the information provided is accurate and consent to use my data for safety and response purposes.
            <Link to="/" className="ml-1 font-bold text-primary hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.agree && <p className="mt-2 text-xs font-semibold text-error">{errors.agree}</p>}
      </div>
    </section>
  );

  const renderSuccessScreen = () => (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary">Registration Successful</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Your digital Tourist ID is ready. Share or save it for verification.
      </p>
      {errors.success && (
        <p className="mt-3 rounded-lg bg-secondary-container p-3 text-sm font-semibold text-primary">{errors.success}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
          <h3 className="text-base font-bold text-primary">ID Card Preview (QR-enabled)</h3>
          <div className="mt-3 rounded-lg bg-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">Tourist ID</span>
              <span className="text-xs font-bold">{previewId}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold">{fullName || 'Tourist'}</span>
              <span className="rounded bg-white/20 px-2 py-1 text-xs font-bold">QR</span>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-on-surface-variant">KYC: {kycFile ? 'Uploaded' : 'Not uploaded'}</p>
        </div>

        <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
          <h3 className="text-base font-bold text-primary">Registration Details</h3>
          <div className="mt-3 space-y-1 text-sm">
            <p><strong>Name:</strong> {fullName || '-'}</p>
            <p><strong>ID:</strong> {previewId}</p>
            <p><strong>Email:</strong> {formData.email || '-'}</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {isSuccessful ? (
        renderSuccessScreen()
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Tourist Registration</h1>
              <p className="mt-2 text-sm text-on-surface-variant md:text-base">
                Complete the steps to generate your digital Tourist ID. This ID facilitates faster emergency response and verified access to secure zones.
              </p>
              <p className="mt-3 text-sm text-on-surface-variant">
                Already have an account?
                <Link to="/login" className="ml-1 font-bold text-primary hover:underline">Login here</Link>
              </p>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-surface-container-high" />
                  <div className="absolute left-0 top-5 h-1 rounded-full bg-primary transition-all duration-300" style={{ width: progressWidth }} />
                  <div className="grid grid-cols-4 gap-2">
                    {stepMeta.map((step) => {
                      const isActive = currentStep === step.number;
                      const isCompleted = currentStep > step.number;
                      return (
                        <div key={step.number} className="text-center">
                          <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-4 ring-surface-container-lowest ${isActive || isCompleted ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            {step.number}
                          </div>
                          <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${isActive || isCompleted ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {currentStep === 1 && renderStepOne()}
              {currentStep === 2 && renderStepTwo()}
              {currentStep === 3 && renderStepThree()}
              {currentStep === 4 && renderStepFour()}

              {(errors.submit || errors.success) && (
                <div className={`mt-4 rounded-lg p-3 text-sm font-semibold ${errors.submit ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-primary'}`}>
                  {errors.submit || errors.success}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={handleBack} disabled={currentStep === 1} className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40">
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Back
                </button>

                {currentStep < totalSteps && (
                  <button type="button" onClick={handleNext} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60">
                    Continue
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                )}

                {currentStep === totalSteps && (
                  <button type="button" onClick={handleSubmit} disabled={!formData.agree || isSubmitting || isLoading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting || isLoading ? 'Creating Account...' : 'Confirm & Generate ID'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-75">Tourist ID Badge</p>
                  <p className="text-lg font-bold tracking-tight">RAAHI SYSTEM</p>
                </div>
                <span className="material-symbols-outlined text-3xl opacity-60">verified_user</span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/30 bg-white/20">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
                <div>
                  <p className="text-xs opacity-80">Temporary ID</p>
                  <p className="text-base font-bold">{previewId}</p>
                  <span className="mt-1 inline-block rounded bg-yellow-300 px-2 py-0.5 text-[10px] font-black uppercase text-primary">In Progress</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-3">
                <div className="flex h-28 items-center justify-center rounded border border-slate-200 bg-slate-100 text-xs text-slate-500">QR Code</div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-[10px] font-bold uppercase tracking-wider opacity-75">
                <span>Republic of India</span>
                <span>Tourism Division</span>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-primary">
                <span className="material-symbols-outlined text-primary-container">lightbulb</span>
                Registration Tips
              </h3>

              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="rounded-lg bg-surface-container-low p-3">
                  <p className="font-bold text-primary">Official Documents</p>
                  <p className="mt-1 text-xs">Use official documents for KYC verification.</p>
                </li>
                <li className="rounded-lg bg-surface-container-low p-3">
                  <p className="font-bold text-primary">Accurate Contacts</p>
                  <p className="mt-1 text-xs">Provide accurate emergency contacts for safety.</p>
                </li>
                <li className="rounded-lg bg-surface-container-low p-3">
                  <p className="font-bold text-primary">Location Services</p>
                  <p className="mt-1 text-xs">Keep location services enabled for timely alerts and assistance.</p>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Registration;
