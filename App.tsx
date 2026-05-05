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
import HolidayDetailsPage from './pages/HolidayDetailsPage';
import VisaPage from './pages/VisaPage';
import VisaDetailsPage from './pages/VisaDetailsPage';
import VisaConsultationPage from './pages/VisaConsultationPage';
import HolidayConsultationPage from './pages/HolidayConsultationPage';
import HotelConsultationPage from './pages/HotelConsultationPage';
import DestinationConsultationPage from './pages/DestinationConsultationPage';
import GenericPage from './pages/GenericPage';
import ContactPage from './pages/ContactPage';
import SuccessPage from './pages/SuccessPage';
import CareersPage from './pages/CareersPage';
import PressMediaPage from './pages/PressMediaPage';
import TravelBlogPage from './pages/TravelBlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PressPostPage from './pages/PressPostPage';
import DestinationsPage from './pages/DestinationsPage';
import { SearchParams, Flight, HotelSearchParams } from './types';
import { FeaturesContext } from './context/FeaturesContext';
import { getFeaturesConfig } from './services/firebaseService';

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
  
  // Features Config State
  const [features, setFeatures] = useState<any>({
      brandName: 'HQ TRAVELS',
      showBrandName: true,
      topNavHomeEnabled: true,
      topNavHotelsEnabled: true,
      topNavHolidaysEnabled: true,
      topNavVisaEnabled: true,
      topNavAboutEnabled: false,
      topNavCareersEnabled: false,
      topNavPressEnabled: false,
      topNavBlogEnabled: false,
      topNavHelpEnabled: false,
      topNavPrivacyEnabled: false,
      topNavTermsEnabled: false,
      topNavRefundEnabled: false,
      navHomeEnabled: true,
      navHotelsEnabled: true,
      navHolidaysEnabled: true,
      navVisaEnabled: true,
      navAboutEnabled: true,
      navCareersEnabled: true,
      navPressEnabled: true,
      navBlogEnabled: true,
      navHelpEnabled: true,
      navPrivacyEnabled: true,
      navTermsEnabled: true,
      navRefundEnabled: true,
      flightsEnabled: true,
      hotelsEnabled: true,
      holidaysEnabled: true,
      visaEnabled: true,
      destinationsEnabled: true,
      blogEnabled: true,
      careersEnabled: true,
      pressEnabled: true
  });
  
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
    getFeaturesConfig().then(data => {
        if (data) setFeatures(data);
    }).catch(err => console.error(err));
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
    <FeaturesContext.Provider value={features}>
      <ScrollToTop />
      <Routes>
        {/* Admin Route - No Layout */}
        <Route path="/cmsadmin/*" element={<AdminDashboard onLogoUpdate={handleLogoUpdate} currentLogo={logoUrl} />} />

        {/* User Routes - With Layout */}
        <Route path="*" element={
          <Layout customLogo={logoUrl}>
            <Routes>
              {features.flightsEnabled || features.hotelsEnabled ? (
                  <Route path="/" element={<HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />} />
              ) : (
                  <Route path="/" element={<HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />} />
              )}
              <Route path="/search" element={
                searchParams && features.flightsEnabled ? (
                  <SearchResultsPage 
                    params={searchParams} 
                    onSelectFlight={handleSelectFlight}
                    onBack={() => navigate('/')}
                  />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/hotel-search" element={
                hotelParams && features.hotelsEnabled ? (
                  <HotelResultsPage 
                      params={hotelParams}
                      onBack={() => navigate('/')}
                  />
                ) : <HomePage onSearch={handleSearch} onHotelSearch={handleHotelSearch} />
              } />
              <Route path="/booking" element={
                selectedFlight && features.flightsEnabled ? (
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
              {features.destinationsEnabled && (
                <>
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/destination-consultation/:id" element={<DestinationConsultationPage />} />
                </>
              )}
              {features.hotelsEnabled && (
                <>
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route path="/hotel-consultation/:id" element={<HotelConsultationPage />} />
                </>
              )}
              {features.holidaysEnabled && (
                <>
                  <Route path="/holidays" element={<HolidaysPage />} />
                  <Route path="/holidays/:id" element={<HolidayDetailsPage />} />
                  <Route path="/holiday-consultation/:id" element={<HolidayConsultationPage />} />
                </>
              )}
              {features.visaEnabled && (
                <>
                  <Route path="/visa" element={<VisaPage />} />
                  <Route path="/visa/:id" element={<VisaDetailsPage />} />
                  <Route path="/visa-consultation/:id" element={<VisaConsultationPage />} />
                </>
              )}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/about" element={<GenericPage pageId="about" defaultTitle="About Us" />} />
              <Route path="/help" element={<GenericPage pageId="help" defaultTitle="Help Center" />} />
              <Route path="/privacy" element={<GenericPage pageId="privacy" defaultTitle="Privacy Policy" />} />
              <Route path="/terms" element={<GenericPage pageId="terms" defaultTitle="Terms of Service" />} />
              <Route path="/refund" element={<GenericPage pageId="refund" defaultTitle="Refund Rules" />} />
              {features.careersEnabled && <Route path="/careers" element={<CareersPage />} />}
              {features.pressEnabled && <Route path="/press" element={<PressMediaPage />} />}
              {features.pressEnabled && <Route path="/press/post/:id" element={<PressPostPage />} />}
              {features.blogEnabled && <Route path="/blog" element={<TravelBlogPage />} />}
              {features.blogEnabled && <Route path="/blogs/post/:id" element={<BlogPostPage />} />}
            </Routes>
          </Layout>
        } />
      </Routes>
    </FeaturesContext.Provider>
  );
};

export default App;