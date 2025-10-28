// Demo medical license data for doctor verification
// In production, this would connect to actual state medical license databases

export const demoMedicalLicenses = [
  {
    licenseNumber: 'CA12345',
    state: 'California',
    fullName: 'John Smith',
    dateOfBirth: '1980-05-15',
    specialty: 'Physical Therapy',
    status: 'Active',
    issueDate: '2010-03-20',
    expirationDate: '2026-03-20',
  },
  {
    licenseNumber: 'NY67890',
    state: 'New York',
    fullName: 'Sarah Johnson',
    dateOfBirth: '1985-11-22',
    specialty: 'Physical Therapy',
    status: 'Active',
    issueDate: '2012-06-15',
    expirationDate: '2026-06-15',
  },
  {
    licenseNumber: 'TX54321',
    state: 'Texas',
    fullName: 'Michael Chen',
    dateOfBirth: '1978-08-30',
    specialty: 'Physical Therapy',
    status: 'Active',
    issueDate: '2008-09-10',
    expirationDate: '2025-09-10',
  },
  {
    licenseNumber: 'FL99887',
    state: 'Florida',
    fullName: 'Emily Rodriguez',
    dateOfBirth: '1990-02-14',
    specialty: 'Physical Therapy',
    status: 'Active',
    issueDate: '2015-01-25',
    expirationDate: '2027-01-25',
  },
  {
    licenseNumber: 'IL44556',
    state: 'Illinois',
    fullName: 'David Williams',
    dateOfBirth: '1982-07-08',
    specialty: 'Physical Therapy',
    status: 'Active',
    issueDate: '2011-04-12',
    expirationDate: '2026-04-12',
  },
];

/**
 * Verify doctor credentials against demo medical license database
 * @param {string} licenseNumber - Medical license number
 * @param {string} state - State of issuance
 * @param {string} fullName - Doctor's full name
 * @param {string} dateOfBirth - Date of birth (YYYY-MM-DD)
 * @returns {Object} - { verified: boolean, message: string, licenseData: Object }
 */
export const verifyDoctorCredentials = (licenseNumber, state, fullName, dateOfBirth) => {
  // Find matching license
  const license = demoMedicalLicenses.find(
    (lic) => lic.licenseNumber.toUpperCase() === licenseNumber.toUpperCase()
  );

  if (!license) {
    return {
      verified: false,
      message: 'License number not found in our records.',
      licenseData: null,
    };
  }

  // Check if all fields match
  const stateMatch = license.state.toLowerCase() === state.toLowerCase();
  const nameMatch = license.fullName.toLowerCase() === fullName.toLowerCase();
  const dobMatch = license.dateOfBirth === dateOfBirth;

  if (!stateMatch) {
    return {
      verified: false,
      message: 'State of issuance does not match our records.',
      licenseData: null,
    };
  }

  if (!nameMatch) {
    return {
      verified: false,
      message: 'Full name does not match our records.',
      licenseData: null,
    };
  }

  if (!dobMatch) {
    return {
      verified: false,
      message: 'Date of birth does not match our records.',
      licenseData: null,
    };
  }

  // Check if license is active
  if (license.status !== 'Active') {
    return {
      verified: false,
      message: 'License is not currently active.',
      licenseData: null,
    };
  }

  // Check if license is expired
  const expirationDate = new Date(license.expirationDate);
  const today = new Date();
  if (expirationDate < today) {
    return {
      verified: false,
      message: 'License has expired.',
      licenseData: null,
    };
  }

  return {
    verified: true,
    message: 'Credentials verified successfully.',
    licenseData: license,
  };
};

// Helper function to get US states for dropdown
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

