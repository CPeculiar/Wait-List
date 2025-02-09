import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminWaitlist from "./Pages/AdminWaitlist";
import PaymentPage from "./Pages/PaymentPage";
import WaitlistForm from "./Pages/WaitlistForm";
import NotFound from './Pages/NotFound';


function App() {


  return (
    <>

<Routes>
            {/* Public routes */}
        <Route path="/" element={<WaitlistForm />} />
        <Route path="/waitlist" element={<WaitlistForm />} />
        <Route path="/admin" element={<AdminWaitlist />} />
        <Route path="/payment" element={<PaymentPage />} />
    
       {/* Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        
   

    </>
  )
}

export default App
