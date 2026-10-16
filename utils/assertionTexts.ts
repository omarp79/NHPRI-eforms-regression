export const assertionTexts = {
  // Page-specific headers and UI text
  pages: {
    pcpChange: {
      // expected text is in the header:
      header: 'PCP Change', 
      description: 'Entering the NPI Number will automatically populate...',

    },
    providerNotFoundtxt:{
      description: 'Providers found with the provided search criteria'
    },
    memberProfile: {
      header: 'My Profile',
    },
    billing: {
      header: 'Premium Billing'
    }
  },
  // Shared application feedback across the app
  global: {
    headers: {
      confirmation: 'Submission Successful',
      errorSummary: 'Please correct the errors below before submitting.'
    },
    validationErrors: {
      invalidNpi: 'Please enter a valid 10-digit NPI number.',
      requiredField: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      providerNotFound:"No Providers found with the provided search criteria",
      memberNotFound: "No members found with the provided search criteria"
    }
  }
};