import React from 'react';
import { CheckCircle, Download, Home } from 'lucide-react';

interface ConfirmationPageProps {
  bookingId: string;
  onHome: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ bookingId, onHome }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">Your ticket has been issued successfully.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Booking Reference</div>
            <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider mb-4">{bookingId}</div>
            <p className="text-sm text-gray-600">
                A confirmation email has been sent to your inbox. You can manage this booking from your dashboard.
            </p>
        </div>

        <div className="space-y-3">
            <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" /> Download E-Ticket
            </button>
            <button 
                onClick={onHome}
                className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center"
            >
                <Home className="w-5 h-5 mr-2" /> Return Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
