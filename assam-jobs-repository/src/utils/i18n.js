// Multilingual strings: English, Assamese, Hindi, Bengali
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' }
]

export const translations = {
  en: {
    home: 'Home', jobs: 'Jobs', utilities: 'Utilities',
    assistant: 'AI Assistant', profile: 'Profile',
    signIn: 'Sign In', signUp: 'Sign Up', signOut: 'Sign Out'
  },
  as: {
    home: 'গৃহ', jobs: 'চাকৰি', utilities: 'সঁজুলি',
    assistant: 'AI সহায়ক', profile: 'প্ৰ\u200cফাইল',
    signIn: 'ছাইন ইন', signUp: 'ছাইন আপ', signOut: 'ছাইন আউট'
  },
  hi: {
    home: 'होम', jobs: 'नौकरियां', utilities: 'उपकरण',
    assistant: 'AI सहायक', profile: 'प्रोफ़ाइल',
    signIn: 'साइन इन', signUp: 'साइन अप', signOut: 'साइन आउट'
  },
  bn: {
    home: 'হোম', jobs: 'চাকরি', utilities: 'টুলস',
    assistant: 'AI সহায়ক', profile: 'প্রোফাইল',
    signIn: 'সাইন ইন', signUp: 'সাইন আপ', signOut: 'সাইন আউট'
  }
}
