import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import HotelResultsPage from './pages/HotelResultsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import HotelsPage from './pages/HotelsPage';
import HolidaysPage from './pages/HolidaysPage';
import VisaPage from './pages/VisaPage';
import GenericPage from './pages/GenericPage';
import CareersPage from './pages/CareersPage';
import PressMediaPage from './pages/PressMediaPage';
import TravelBlogPage from './pages/TravelBlogPage';
import DestinationsPage from './pages/DestinationsPage';
import { SearchParams, Flight, HotelSearchParams } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [hotelParams, setHotelParams] = useState<HotelSearchParams | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  
  // Logo State management
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const handleLogoUpdate = (newUrl: string) => {
    localStorage.setItem('companyLogo', newUrl);
    setLogoUrl(newUrl);
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    navigate('/search');
  };

  const handleHotelSearch = (params: HotelSearchParams) => {
    setHotelParams(params);
    navigate('/hotel-search');
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    navigate('/booking');
  };

  const handleBookingSuccess = (bookingId: string) => {
    setConfirmedBookingId(bookingId);
    navigate('/confirmation');
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Route - No Layout */}
        <Route path="/cmsadmin/*" element={<AdminDashboard onLogoUpdate={handleLogoUpdate} currentLogo={logoUrl} />} />

        {/* User Routes - With Layout */}
        <Route path="*" element={
          <Layout customLogo={logoUrl}>
            <Routes>
              <Route path="/" element={<HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />} />
              <Route path="/search" element={
                searchParams ? (
                  <SearchResultsPage 
                    params={searchParams} 
                    onSelectFlight={handleSelectFlight}
                    onBack={() => navigate('/')}
                  />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/hotel-search" element={
                hotelParams ? (
                  <HotelResultsPage 
                      params={hotelParams}
                      onBack={() => navigate('/')}
                  />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/booking" element={
                selectedFlight ? (
                  <BookingPage 
                    flight={selectedFlight} 
                    onSuccess={handleBookingSuccess}
                    onBack={() => navigate('/search')}
                  />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/confirmation" element={
                confirmedBookingId ? (
                  <ConfirmationPage bookingId={confirmedBookingId} onHome={() => navigate('/')} />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/holidays" element={<HolidaysPage />} />
              <Route path="/visa" element={<VisaPage />} />
              <Route path="/about" element={<GenericPage pageId="about" defaultTitle="About Us" />} />
              <Route path="/help" element={<GenericPage pageId="help" defaultTitle="Help Center" />} />
              <Route path="/privacy" element={<GenericPage pageId="privacy" defaultTitle="Privacy Policy" />} />
              <Route path="/terms" element={<GenericPage pageId="terms" defaultTitle="Terms of Service" />} />
              <Route path="/refund" element={<GenericPage pageId="refund" defaultTitle="Refund Rules" />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/press" element={<PressMediaPage />} />
              <Route path="/blog" element={<TravelBlogPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
};

export default App;