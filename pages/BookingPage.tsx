import React, { useState, useEffect } from 'react';
import { Flight, Passenger } from '../types';
import { createFirebaseBooking, getPaymentMethodsConfig } from '../services/firebaseService';
import { ShieldCheck, CreditCard, User, Loader2, LogIn, Plane } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

interface BookingPageProps {
  flight: Flight;
  onSuccess: (bookingId: string) => void;
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ flight, onSuccess, onBack }) => {
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<{card?: boolean, bkash?: boolean}>({ card: true, bkash: true });
  
  useEffect(() => {
     getPaymentMethodsConfig().then(config => {
         if (config) {
             setPaymentConfig(config);
             if (!config.card && config.bkash) setPaymentMethod('bkash');
         }
     });
  }, []);

  const [passenger, setPassenger] = useState<Passenger>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    passportNumber: '',
    nationality: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash'>('card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setErrorMsg("Please sign in to complete your booking.");
        return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
        const booking = await createFirebaseBooking(flight, passenger, flight.price);
        onSuccess(booking.id);
    } catch (err: any) {
        setErrorMsg(err.message || "An error occurred during booking.");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Forms */}
        <div className="flex-1">
          <button onClick={onBack} className="text-gray-500 text-sm mb-4 hover:text-gray-800">&larr; Back to Results</button>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Review & Pay</h2>

          {/* Traveler Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <User className="w-5 h-5 mr-2 text-primary" /> Traveler Details
            </h3>
            <form id="booking-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input required name="firstName" value={passenger.firstName} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input required name="lastName" value={passenger.lastName} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" name="email" value={passenger.email} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input required name="phone" value={passenger.phone} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="+880..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input name="passportNumber" value={passenger.passportNumber} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" placeholder="Optional" />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment Method
            </h3>
            
            <div className="flex space-x-4 mb-6">
                {paymentConfig.card && (
                    <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`cursor-pointer border-2 rounded-lg p-4 flex-1 flex items-center justify-center transition ${paymentMethod === 'card' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <span className="font-bold text-gray-700">Credit Card</span>
                    </div>
                )}
                {paymentConfig.bkash && (
                    <div 
                        onClick={() => setPaymentMethod('bkash')}
                        className={`cursor-pointer border-2 rounded-lg p-4 flex-1 flex items-center justify-center transition ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <span className="font-bold text-pink-600">bKash</span>
                    </div>
                )}
            </div>

            {paymentMethod === 'card' ? (
                <div className="space-y-4">
                     <input className="w-full border rounded-lg p-2" placeholder="Card Number" />
                     <div className="flex gap-4">
                        <input className="w-1/2 border rounded-lg p-2" placeholder="MM/YY" />
                        <input className="w-1/2 border rounded-lg p-2" placeholder="CVC" />
                     </div>
                </div>
            ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    You will be redirected to the bKash secure gateway to complete payment.
                </div>
            )}
            
            <div className="mt-6 flex items-start text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
                Your transaction is secured with SSL encryption.
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {errorMsg && (
                <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-semibold border border-red-200">
                    {errorMsg}
                </div>
            )}
            
            {!user ? (
                <button 
                    type="button"
                    onClick={signInWithGoogle}
                    className="w-full bg-slate-900 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center"
                >
                    <LogIn className="w-5 h-5 mr-2" /> Sign In to Book
                </button>
            ) : (
                <button 
                    form="booking-form"
                    disabled={loading}
                    className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                    {loading ? 'Processing...' : `Pay Now $${flight.price}`}
                </button>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:w-1/3">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Flight Summary</h3>
                <div className="flex items-center mb-4 pb-4 border-b">
                    <div className="w-8 h-8 rounded-full mr-3 bg-blue-50 text-primary flex items-center justify-center border border-blue-100">
                        <Plane className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">{flight.airline}</div>
                        <div className="text-xs text-gray-500">{flight.flightNumber} • {flight.class}</div>
                    </div>
                </div>
                
                <div className="relative pl-4 border-l-2 border-gray-200 space-y-6 mb-6">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2 border-gray-400"></div>
                        <div className="font-bold text-gray-800">{flight.departureTime?.split('T')[1]?.substr(0, 5) || ''}</div>
                        <div className="text-sm text-gray-600">{flight.origin}</div>
                        <div className="text-xs text-gray-400">{new Date(flight.departureTime).toDateString()}</div>
                    </div>
                     <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-primary"></div>
                        <div className="font-bold text-gray-800">{flight.arrivalTime?.split('T')[1]?.substr(0, 5) || ''}</div>
                        <div className="text-sm text-gray-600">{flight.destination}</div>
                         <div className="text-xs text-gray-400">{new Date(flight.arrivalTime).toDateString()}</div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>Base Fare</span>
                        <span>${(flight.price * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-gray-600">
                        <span>Taxes & Fees</span>
                        <span>${(flight.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-dashed">
                        <span>Total</span>
                        <span>${flight.price}</span>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
