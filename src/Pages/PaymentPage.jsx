import { useEffect, useState } from "react";
import { useSearchParams,  useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Logo from '/FM-Logo.jpg';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    currency: "",
    amount: '',
  });

  const navigate = useNavigate();

useEffect(() => {
    // Get email and amount from URL parameters
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const currency = searchParams.get('currency');
    const amount = searchParams.get('amount');

    if (name && email && amount) {
      setPaymentData({
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        currency: decodeURIComponent(currency),
        amount: parseInt(amount, 10),
      });
    }
  }, [searchParams]);


    const loadFlutterwave = async () => {
        return new Promise((resolve, reject) => {
            if (window.FlutterwaveCheckout) {
              resolve();
              return;
            }
      
            const script = document.createElement("script");
            script.src = "https://checkout.flutterwave.com/v3.js";
            script.async = true;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Flutterwave"));
            
            document.body.appendChild(script);
          });
        };


  const makePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
        await loadFlutterwave();

     if (!window.FlutterwaveCheckout) {
          throw new Error("Flutterwave failed to initialize");
        }

        // let email = paymentData.email
        const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: `TX-${Date.now()}`,
        name: paymentData.name,
        amount: Number(paymentData.amount),
        currency: paymentData.currency,
        payment_options: "card, mobilemoney, ussd",
        customer: {
            name: paymentData.name,
            email: paymentData.email,
          },
          customizations: {
            title: "Data Analysis Training",
            description: "Secure your spot in our upcoming cohort",
            logo: Logo,
          },
          callback: function (response) {
            if (response.status === "successful") {
           // Here you should verify the transaction on your backend
           alert("Payment successful! You'll receive a confirmation email shortly.");
           // You can redirect to a success page or handle success differently
           navigate('/');
            // Reset form
            setPaymentData({
                name: "",
                email: "",
                currency: "",
                amount: "",
              });          

        } else {
            setError("Payment was not successful. Please try again.");
          }
        },
        onclose: function() {
          setIsLoading(false);
        },
      };

      window.FlutterwaveCheckout(config);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || "An error occurred while processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentData.email || !paymentData.amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment Details</h2>
          <p className="text-gray-600">
            The payment information provided is incomplete or invalid. Please try again from the registration page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(false);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Payment Details</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete your registration payment
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
              {paymentData.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
              {paymentData.currency}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
              {paymentData.amount.toLocaleString()}
            </div>
          </div>

          <button
            onClick={makePayment}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};


export default PaymentPage;