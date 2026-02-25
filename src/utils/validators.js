export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateMobile = (mobile) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile);
};

export const validatePAN = (pan) => {
  const re = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return re.test(pan);
};

export const validateAadhar = (aadhar) => {
  const re = /^\d{12}$/;
  return re.test(aadhar);
};