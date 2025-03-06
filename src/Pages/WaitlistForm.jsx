import { useState, useEffect } from "react";
import { db } from "../services/firestore";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { submitWaitListApplication } from "../services/firestore";
import { auth, storage } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const WaitlistForm = () => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currency: "NGN",
    amount: "25000",
    paymentOption: "now", 
  });

  
  const navigate = useNavigate();

   // Fetch live exchange rates when component mounts
   useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/NGN");
        const data = await response.json();
        setExchangeRates(data.rates);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch exchange rates. Please try again.");
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Update the amount field based on selected currency
  useEffect(() => {
    if (formData.currency === "NGN") {
      setFormData((prev) => ({ ...prev, amount: 25000 }));
    } else if (exchangeRates[formData.currency]) {
      const convertedAmount = Math.round(15500 * exchangeRates[formData.currency]);
      setFormData((prev) => ({ ...prev, amount: convertedAmount }));
    }
  }, [formData.currency, exchangeRates]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
   // Update form data
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

// Clear error if user starts typing
if (formErrors[name]) {
  setFormErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
}
};

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) return "Enter a valid phone number";

    // Set a default country if no country code is provided (e.g., Nigeria "NG")
    const phoneNumber = parsePhoneNumberFromString(phone, "NG");
  
  // Validate if the phone number is real and correctly formatted
  return (!phoneNumber || !phoneNumber.isValid()) ? "Enter a valid phone number" : "";
};

  const validateStep = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) 
      errors.email = "Valid email is required";
    const phoneError = validatePhoneNumber(formData.phone);
    if (phoneError) errors.phone = phoneError;
    if (!formData.currency) errors.currency = "Please choose a currency";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.paymentOption) errors.paymentOption = "Choose a preferred payment option";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    if (!validateStep()) {
      return;
    }

    setIsLoading(true);

    try {
     // Direct Firestore submission
     const docRef = await addDoc(collection(db, "DataAnalysisWaitlist"), {
      ...formData,
      submittedAt: new Date(),
    });

    if (docRef.id) {
      alert("You have successfully joined the waitlist!");


      if (formData.paymentOption === "now") {
        navigate(`/payment?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&currency=${encodeURIComponent(formData.currency)}&amount=${encodeURIComponent(formData.amount)}`);
      } else {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          currency: "NGN",
          amount: "25000",
          paymentOption: "now",
        });
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    setFormErrors({ 
      form: `Registration failed: ${error.message || "Please try again later"}`
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Data Analysis Training
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our exclusive waitlist for upcoming cohorts
          </p>
        </div>

        {formErrors.form && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formErrors.form}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.phone ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.phone}
              </p>
            )}
          </div>

          {/* <div>
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700">
              Area of Interest
            </label>
            <select
              name="interest"
              id="interest"
              value={formData.interest}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.interest ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select your focus area</option>
              <option value="data_analysis">Data Analysis</option>
              <option value="data_visualization">Data Visualization</option>
              <option value="machine_learning">Machine Learning</option>
            </select>
            {formErrors.interest && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.interest}
              </p>
            )}
          </div> */}

          <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
          Select Currency
        </label>
        <select
          name="currency"
          id="currency"
          value={formData.currency}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.currency ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
          <option value="NGN">Naira (₦)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
          <option value="GBP">British Pound (£)</option>
          <option value="CAD">Canadian Dollar (C$) - CAD</option>
        </select>
        {formErrors.currency && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.currency}
              </p>
            )}
      </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
             Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              // value={formData.amount || 15000} // Default to 15000
              value={isLoading ? "Loading..." : formData.amount}
              readOnly // Prevent user from editing
              // onChange={handleChange}
              // placeholder="Enter a minimum amount of ₦15,000"
              //  min="15000"
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.amount ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {formErrors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.amount}
              </p>
            )}
          </div>

         

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Preference
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentOption"
                  value="now"
                  checked={formData.paymentOption === "now"}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Pay Now</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentOption"
                  value="later"
                  checked={formData.paymentOption === "later"}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Pay Later</span>
              </label>
            </div>
            {formErrors.paymentOption && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.paymentOption}
              </p>
            )}
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
);
};

export default WaitlistForm;
