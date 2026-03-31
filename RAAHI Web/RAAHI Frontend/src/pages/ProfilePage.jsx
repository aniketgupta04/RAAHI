import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DateInput = ({ id, value, onTextChange, onDateChange, placeholder }) => {
  const displayDateToIso = (displayDate) => {
    const match = displayDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return '';
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  };

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
        name={id}
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
        aria-label="Select date"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-on-surface-variant hover:bg-surface-container-high"
      >
        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
      </button>
      <input
        id={`${id}-picker`}
        type="date"
        value={displayDateToIso(value)}
        onChange={(event) => onDateChange(event.target.value)}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState('');
  const [personalErrors, setPersonalErrors] = useState({});
  const [personalForm, setPersonalForm] = useState({
    firstName: user?.firstName || 'Arjun',
    lastName: user?.lastName || 'Sharma',
    email: user?.email || 'arjun.sharma@example.com',
    phone: '9876543210',
    dob: '15-05-1990',
    gender: 'Male',
    nationality: 'Indian',
    idType: 'Aadhaar',
    idNumber: '123456789012',
    verificationStatus: user?.isEmailVerified ? 'Verified' : 'Pending',
  });
  const [medicalInfo, setMedicalInfo] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Priya Sharma', relation: 'Spouse', phone: '9898989898', isEditing: false },
    { id: 2, name: 'Ramesh Kumar', relation: 'Father', phone: '9777777777', isEditing: false },
  ]);
  const [safetyPrefs, setSafetyPrefs] = useState({
    smsAlerts: true,
    emailAlerts: true,
    pushNotifications: false,
    shareLiveLocation: true,
    language: 'English',
    sensitivity: 'Medium',
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefMessage, setPrefMessage] = useState('');
  const [itinerary, setItinerary] = useState([
    { id: 1, place: 'New Delhi', from: '26-10-2024', to: '29-10-2024', isEditing: false },
    { id: 2, place: 'Rishikesh', from: '30-10-2024', to: '04-11-2024', isEditing: false },
  ]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordState, setPasswordState] = useState({ loading: false, error: '', success: '' });

  const initialPersonalSnapshot = useMemo(
    () => JSON.stringify({ ...personalForm, idNumber: '123456789012' }),
    []
  );
  const hasUnsavedPersonalChanges =
    JSON.stringify({ ...personalForm, idNumber: '123456789012' }) !== initialPersonalSnapshot;

  const fullName = `${personalForm.firstName} ${personalForm.lastName}`.trim();
  const touristId = user?.id ? `ST-TEMP-${String(user.id).slice(-4).toUpperCase()}` : 'ST-TEMP-0001';
  const avatarInitial = (fullName[0] || 'U').toUpperCase();

  const maskedId = useMemo(() => {
    const digits = personalForm.idNumber.replace(/\D/g, '');
    if (!digits) return 'XXXX-XXXX-XXXX';
    const visible = digits.slice(-4);
    return `XXXX-XXXX-${visible.padStart(4, 'X')}`;
  }, [personalForm.idNumber]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(personalForm.firstName && personalForm.lastName && personalForm.phone.length === 10),
      emergencyContacts.length > 0,
      Boolean(personalForm.idNumber),
      Boolean(safetyPrefs.language && safetyPrefs.sensitivity),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [personalForm, emergencyContacts, safetyPrefs]);

  const ring = useMemo(() => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (completion / 100) * circumference;
    return { circumference, offset };
  }, [completion]);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    []
  );

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;
    if (name === 'phone') nextValue = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'dob') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      const parts = [];
      if (digits.length > 0) parts.push(digits.slice(0, 2));
      if (digits.length > 2) parts.push(digits.slice(2, 4));
      if (digits.length > 4) parts.push(digits.slice(4, 8));
      nextValue = parts.join('-');
    }
    setPersonalForm((prev) => ({ ...prev, [name]: nextValue }));
    if (personalErrors[name]) setPersonalErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDobPickerChange = (isoDate) => {
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return;
    const [, yyyy, mm, dd] = match;
    setPersonalForm((prev) => ({ ...prev, dob: `${dd}-${mm}-${yyyy}` }));
  };

  const validatePersonal = () => {
    const nextErrors = {};
    if (!personalForm.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!personalForm.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!personalForm.email.trim()) nextErrors.email = 'Email is required';
    if (personalForm.phone.length !== 10) nextErrors.phone = 'Phone number must be 10 digits';
    setPersonalErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSavePersonal = () => {
    if (!validatePersonal()) return;
    setIsSavingPersonal(true);
    setPersonalSuccess('');
    setTimeout(() => {
      setIsSavingPersonal(false);
      setIsEditingPersonal(false);
      setPersonalSuccess('Profile details saved successfully.');
    }, 1000);
  };

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false);
    setPersonalErrors({});
    setPersonalSuccess('');
  };

  const updateEmergency = (id, field, value) => {
    const next = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setEmergencyContacts((prev) =>
      prev.map((contact) => (contact.id === id ? { ...contact, [field]: next } : contact))
    );
  };

  const toggleEmergencyEdit = (id, state) => {
    setEmergencyContacts((prev) =>
      prev.map((contact) => (contact.id === id ? { ...contact, isEditing: state } : contact))
    );
  };

  const addEmergencyContact = () => {
    setEmergencyContacts((prev) => [
      ...prev,
      { id: Date.now(), name: '', relation: '', phone: '', isEditing: true },
    ]);
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const savePreferences = () => {
    setIsSavingPrefs(true);
    setPrefMessage('');
    setTimeout(() => {
      setIsSavingPrefs(false);
      setPrefMessage('Safety preferences updated.');
    }, 900);
  };

  const addItineraryStop = () => {
    setItinerary((prev) => [
      ...prev,
      { id: Date.now(), place: '', from: '', to: '', isEditing: true },
    ]);
  };

  const updateItinerary = (id, field, value) => {
    const next =
      field === 'from' || field === 'to'
        ? value
            .replace(/\D/g, '')
            .slice(0, 8)
            .replace(/(\d{2})(\d{0,2})(\d{0,4})/, (_, a, b, c) =>
              [a, b, c].filter(Boolean).join('-')
            )
        : value;
    setItinerary((prev) => prev.map((stop) => (stop.id === id ? { ...stop, [field]: next } : stop)));
  };

  const removeItinerary = (id) => {
    setItinerary((prev) => prev.filter((stop) => stop.id !== id));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordState({ loading: false, error: 'All password fields are required.', success: '' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordState({
        loading: false,
        error: 'New password must be at least 6 characters.',
        success: '',
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordState({
        loading: false,
        error: 'New password and confirmation do not match.',
        success: '',
      });
      return;
    }
    setPasswordState({ loading: true, error: '', success: '' });
    setTimeout(() => {
      setPasswordState({ loading: false, error: '', success: 'Password updated successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 900);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <main className="bg-surface-container-low px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">My Profile</h1>
              <p className="mt-2 text-sm text-on-surface-variant md:text-base">
                View and update your account and safety information.
              </p>
            </div>
            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low px-4 py-3 text-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Last updated</p>
              <p className="mt-1 font-semibold text-primary">{lastUpdated} IST</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-3xl font-bold text-on-primary">
                    {avatarInitial}
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 rounded-full bg-primary-container p-2 text-on-primary">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-primary">{fullName || 'Tourist'}</h2>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${personalForm.verificationStatus === 'Verified' ? 'bg-secondary-container text-primary' : 'bg-error-container text-on-error-container'}`}>
                      <span className="material-symbols-outlined text-sm">{personalForm.verificationStatus === 'Verified' ? 'verified' : 'pending'}</span>
                      {personalForm.verificationStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">ID: {touristId}</p>
                  <p className="text-sm text-on-surface-variant">{personalForm.email}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setIsEditingPersonal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary">
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit Profile
                    </button>
                    <a href="#security-section" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Change Password
                    </a>
                    <button type="button" onClick={handleLogout} className="rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider text-error hover:bg-error-container/30">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <h3 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-primary">
                  <span className="material-symbols-outlined">person</span>
                  Personal Information
                </h3>
                <button type="button" onClick={() => setIsEditingPersonal((prev) => !prev)} className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {isEditingPersonal ? 'View Mode' : 'Edit All'}
                </button>
              </div>

              {hasUnsavedPersonalChanges && isEditingPersonal && (
                <div className="mb-5 rounded-lg border border-error/30 bg-error-container/60 px-4 py-3 text-sm text-on-error-container">
                  You have unsaved changes. Save before leaving this section.
                </div>
              )}

              {personalSuccess && (
                <div className="mb-5 rounded-lg bg-secondary-container px-4 py-3 text-sm font-semibold text-primary">
                  {personalSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">First Name</label>
                  <input name="firstName" value={personalForm.firstName} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70" />
                  {personalErrors.firstName && <p className="mt-1 text-xs font-semibold text-error">{personalErrors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Last Name</label>
                  <input name="lastName" value={personalForm.lastName} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70" />
                  {personalErrors.lastName && <p className="mt-1 text-xs font-semibold text-error">{personalErrors.lastName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Email</label>
                  <input name="email" type="email" value={personalForm.email} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70" />
                  {personalErrors.email && <p className="mt-1 text-xs font-semibold text-error">{personalErrors.email}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Phone</label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-outline-variant bg-surface-container-high px-4 text-sm font-bold text-on-surface-variant">+91</span>
                    <input name="phone" value={personalForm.phone} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-r-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70" />
                  </div>
                  {personalErrors.phone && <p className="mt-1 text-xs font-semibold text-error">{personalErrors.phone}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Date of Birth (DD-MM-YYYY)</label>
                  <DateInput id="dob" value={personalForm.dob} onTextChange={handlePersonalChange} onDateChange={handleDobPickerChange} placeholder="DD-MM-YYYY" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Gender</label>
                  <select name="gender" value={personalForm.gender} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Nationality</label>
                  <input name="nationality" value={personalForm.nationality} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">ID Type</label>
                  <select name="idType" value={personalForm.idType} onChange={handlePersonalChange} disabled={!isEditingPersonal} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 disabled:opacity-70">
                    <option>Passport</option>
                    <option>Aadhaar</option>
                    <option>Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">ID Number</label>
                  <div className="relative">
                    <input value={isEditingPersonal ? personalForm.idNumber : maskedId} disabled={!isEditingPersonal} onChange={(event) => setPersonalForm((prev) => ({ ...prev, idNumber: event.target.value.replace(/\D/g, '').slice(0, 16) }))} className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 pr-10 font-mono disabled:opacity-70" />
                    {!isEditingPersonal && (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button type="button" onClick={handleCancelPersonal} className="rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant hover:bg-surface-container-low">
                  Cancel
                </button>
                <button type="button" disabled={!isEditingPersonal || isSavingPersonal} onClick={handleSavePersonal} className="rounded-lg bg-primary-container px-6 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-primary disabled:opacity-60">
                  {isSavingPersonal ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-primary">
                    <span className="material-symbols-outlined text-error">emergency</span>
                    Emergency Information
                  </h3>
                  <button type="button" onClick={addEmergencyContact} className="rounded-full p-1 text-primary hover:bg-surface-container-low">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={contact.id} className="rounded-lg border border-outline-variant/50 bg-surface-container-low p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded bg-primary-fixed px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">{index === 0 ? 'Primary' : `Contact ${index + 1}`}</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => toggleEmergencyEdit(contact.id, !contact.isEditing)} className="text-on-surface-variant hover:text-primary">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button type="button" onClick={() => deleteEmergencyContact(contact.id)} className="text-on-surface-variant hover:text-error">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <input value={contact.name} disabled={!contact.isEditing} onChange={(event) => updateEmergency(contact.id, 'name', event.target.value)} placeholder="Full Name" className="w-full rounded bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70" />
                        <input value={contact.relation} disabled={!contact.isEditing} onChange={(event) => updateEmergency(contact.id, 'relation', event.target.value)} placeholder="Relation" className="w-full rounded bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70" />
                        <div className="flex">
                          <span className="inline-flex items-center rounded-l-lg border border-outline-variant bg-surface-container-high px-3 text-xs font-bold">+91</span>
                          <input value={contact.phone} disabled={!contact.isEditing} onChange={(event) => updateEmergency(contact.id, 'phone', event.target.value)} placeholder="9876543210" className="w-full rounded-r-lg bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Medical conditions / allergies</label>
                  <textarea value={medicalInfo} onChange={(event) => setMedicalInfo(event.target.value)} rows={4} placeholder="e.g. Type 1 Diabetes, Penicillin allergy..." className="w-full rounded-lg border-outline-variant bg-surface-container-low px-4 py-3 text-sm placeholder:italic" />
                </div>
              </section>

              <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-primary">
                  <span className="material-symbols-outlined">settings_suggest</span>
                  Safety Preferences
                </h3>
                <div className="space-y-3">
                  {[
                    ['smsAlerts', 'SMS Alerts'],
                    ['emailAlerts', 'Email Alerts'],
                    ['pushNotifications', 'Push Notifications'],
                    ['shareLiveLocation', 'Share Live Location During Emergency'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-surface-container-low p-3">
                      <p className="text-sm font-semibold text-primary">{label}</p>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={safetyPrefs[key]}
                          onChange={(event) =>
                            setSafetyPrefs((prev) => ({ ...prev, [key]: event.target.checked }))
                          }
                          className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-outline-variant after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Language</label>
                      <select value={safetyPrefs.language} onChange={(event) => setSafetyPrefs((prev) => ({ ...prev, language: event.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Bengali</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Sensitivity</label>
                      <select value={safetyPrefs.sensitivity} onChange={(event) => setSafetyPrefs((prev) => ({ ...prev, sensitivity: event.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                {prefMessage && <p className="mt-4 rounded-lg bg-secondary-container px-3 py-2 text-sm font-semibold text-primary">{prefMessage}</p>}
                <div className="mt-5 flex justify-end">
                  <button type="button" onClick={savePreferences} disabled={isSavingPrefs} className="rounded-lg bg-primary px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-primary disabled:opacity-60">
                    {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-primary">
                  <span className="material-symbols-outlined">map</span>
                  Itinerary Snapshot
                </h3>
                <button type="button" onClick={addItineraryStop} className="text-xs font-bold uppercase tracking-[0.18em] text-primary hover:underline">
                  Add Destination
                </button>
              </div>
              {itinerary.length === 0 ? (
                <div className="rounded-lg border border-dashed border-outline-variant p-6 text-center">
                  <span className="material-symbols-outlined text-3xl text-outline">travel_explore</span>
                  <p className="mt-2 text-sm font-semibold text-primary">No itinerary added yet.</p>
                  <p className="text-xs text-on-surface-variant">Add your travel stops to improve safety coverage.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {itinerary.map((stop) => (
                    <div key={stop.id} className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4">
                      <div className="mb-3 flex justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setItinerary((prev) =>
                              prev.map((item) =>
                                item.id === stop.id ? { ...item, isEditing: !item.isEditing } : item
                              )
                            )
                          }
                          className="text-on-surface-variant hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button type="button" onClick={() => removeItinerary(stop.id)} className="text-on-surface-variant hover:text-error">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                      <input value={stop.place} disabled={!stop.isEditing} onChange={(event) => updateItinerary(stop.id, 'place', event.target.value)} placeholder="Place / City" className="mb-2 w-full rounded bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={stop.from} disabled={!stop.isEditing} onChange={(event) => updateItinerary(stop.id, 'from', event.target.value)} placeholder="From DD-MM-YYYY" className="w-full rounded bg-surface-container-lowest px-3 py-2 text-xs disabled:opacity-70" />
                        <input value={stop.to} disabled={!stop.isEditing} onChange={(event) => updateItinerary(stop.id, 'to', event.target.value)} placeholder="To DD-MM-YYYY" className="w-full rounded bg-surface-container-lowest px-3 py-2 text-xs disabled:opacity-70" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="security-section" className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-primary">
                <span className="material-symbols-outlined">security</span>
                Account Security
              </h3>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Change Password</p>
                  <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))} placeholder="Current Password" className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm" />
                  <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))} placeholder="New Password" className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm" />
                  <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} placeholder="Confirm New Password" className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-sm" />
                  {passwordState.error && <p className="rounded bg-error-container px-3 py-2 text-sm font-semibold text-on-error-container">{passwordState.error}</p>}
                  {passwordState.success && <p className="rounded bg-secondary-container px-3 py-2 text-sm font-semibold text-primary">{passwordState.success}</p>}
                  <button type="submit" disabled={passwordState.loading} className="w-full rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-primary disabled:opacity-60">
                    {passwordState.loading ? 'Updating...' : 'Update Security Key'}
                  </button>
                </form>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">Active Sessions</p>
                  <div className="space-y-3 rounded-lg bg-surface-container-low p-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">smartphone</span>
                      <div>
                        <p className="text-sm font-bold text-primary">Current Device • New Delhi</p>
                        <p className="text-xs text-on-surface-variant">Current session • Active now</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">laptop_mac</span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Laptop • Mumbai</p>
                        <p className="text-xs text-on-surface-variant">Last active: 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-error hover:underline">
                    Logout from all devices
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
              <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-primary">Profile Completeness</h4>
              <div className="mb-5 flex items-center gap-5">
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={ring.circumference} strokeDashoffset={ring.offset} className="text-primary-container transition-all" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-primary">{completion}%</div>
                </div>
                <p className="text-sm text-on-surface-variant">Complete your profile to improve emergency support quality.</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-lg ${personalForm.firstName && personalForm.lastName ? 'text-green-600' : 'text-outline'}`}>check_circle</span>
                  <span className="text-on-surface-variant">Personal info complete</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-lg ${emergencyContacts.length > 0 ? 'text-green-600' : 'text-outline'}`}>check_circle</span>
                  <span className="text-on-surface-variant">Emergency contacts added</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-lg ${personalForm.idNumber ? 'text-green-600' : 'text-outline'}`}>check_circle</span>
                  <span className="text-on-surface-variant">KYC uploaded</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-lg ${safetyPrefs.language ? 'text-green-600' : 'text-outline'}`}>check_circle</span>
                  <span className="text-on-surface-variant">Preferences configured</span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl bg-primary p-6 text-on-primary shadow-sm">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                <span className="material-symbols-outlined text-primary-fixed">lightbulb</span>
                Safety Tips
              </h4>
              <ul className="space-y-3 text-sm">
                <li>Share your itinerary with at least one trusted contact before travel.</li>
                <li>Keep medical information updated for faster emergency triage.</li>
                <li>Review active sessions weekly and remove unknown devices.</li>
                <li>Enable live location sharing for emergency-only situations.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-error/20 bg-error-container p-6 shadow-sm">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-on-error-container">Quick Help</h4>
              <p className="mb-4 text-xs leading-relaxed text-on-error-container/85">
                Need help with account safety or profile verification? Contact rapid support.
              </p>
              <button type="button" className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-error py-3 text-xs font-black uppercase tracking-[0.18em] text-on-error">
                <span className="material-symbols-outlined">call</span>
                Emergency Helpline
              </button>
              <button type="button" className="w-full rounded-lg border border-error py-3 text-xs font-black uppercase tracking-[0.18em] text-error">
                Support Center
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
