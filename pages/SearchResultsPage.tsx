import React, { useEffect, useState } from 'react';
import { SearchParams, Flight, AILiveInsight } from '../types';
import { searchFlights } from '../services/mockApi';
import { getRealtimeFlightInsights } from '../services/geminiService';
import { Clock, Briefcase, Filter, ArrowRight, Sparkles, Globe, Loader2, Plane } from 'lucide-react';

interface SearchResultsPageProps {
  params: SearchParams;
  onSelectFlight: (flight: Flight) => void;
  onBack: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ params, onSelectFlight, onBack }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStops, setFilterStops] = useState<'all' | 'direct'>('all');
  
  // Real-time insights
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insight, setInsight] = useState<AILiveInsight | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      const results = await searchFlights(params);
      setFlights(results);
      setLoading(false);
    };
    fetchFlights();
  }, [params]);

  const fetchLiveInsights = async () => {
    setLoadingInsight(true);
    const result = await getRealtimeFlightInsights(params.from, params.to, params.date);
    setInsight(result);
    setLoadingInsight(false);
  };

  const filteredFlights = flights.filter(f => {
    if (filterStops === 'direct') return f.stops === 0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb / Modification Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center border border-gray-100">
        <div>
            <div className="flex items-center text-lg font-bold text-gray-800">
                <span>{params.from}</span>
                <ArrowRight className="w-5 h-5 mx-2 text-gray-400" />
                <span>{params.to}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                {params.date} • {params.passengers} Traveler(s) • {params.class}
            </div>
        </div>
        <button onClick={onBack} className="text-primary font-medium hover:underline text-sm">
            Modify Search
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 space-y-6">
            {/* Live Market Check Box */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-lg p-5 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center mb-3">
                        <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                        <h3 className="font-bold">Real-time Insight</h3>
                    </div>
                    <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
                        Compare our fares with live market rates using AI Search Grounding.
                    </p>
                    
                    {!insight && !loadingInsight && (
                        <button 
                            onClick={fetchLiveInsights}
                            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm py-2 rounded transition flex items-center justify-center"
                        >
                            <Globe className="w-4 h-4 mr-2" /> Check Market Rates
                        </button>
                    )}

                    {loadingInsight && (
                        <div className="flex items-center justify-center text-sm text-indigo-200">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Scanning web...
                        </div>
                    )}
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full blur-2xl opacity-50"></div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
                <div className="flex items-center mb-4 text-gray-900 font-bold">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                </div>
                
                <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700">Stops</h4>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="stops" 
                                checked={filterStops === 'all'} 
                                onChange={() => setFilterStops('all')}
                                className="text-primary focus:ring-primary" 
                            />
                            <span className="text-sm text-gray-600">Any</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="stops" 
                                checked={filterStops === 'direct'} 
                                onChange={() => setFilterStops('direct')}
                                className="text-primary focus:ring-primary" 
                            />
                            <span className="text-sm text-gray-600">Direct Only</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h4>
                    <input type="range" className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Min</span>
                        <span>Max</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          
          {/* Live Insight Result Panel */}
          {insight && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 mb-6 animate-fade-in">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> Current Market Overview
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">
                      {insight.text}
                  </p>
                  {insight.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-indigo-100">
                          <span className="text-xs text-indigo-400 font-medium">Sources:</span>
                          {insight.sources.slice(0, 3).map((source, idx) => (
                              <a 
                                  key={idx} 
                                  href={source.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 hover:bg-indigo-600 hover:text-white transition truncate max-w-[150px]"
                                  title={source.title}
                              >
                                  {source.title}
                              </a>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {loading ? (
             <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                     <div key={i} className="bg-white h-32 rounded-lg animate-pulse shadow-sm"></div>
                 ))}
             </div>
          ) : (
            <div className="space-y-4">
                {filteredFlights.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <p className="text-gray-500">No flights found matching your criteria.</p>
                    </div>
                ) : (
                    filteredFlights.map(flight => (
                        <div key={flight.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-5 border border-gray-100 flex flex-col md:flex-row items-center justify-between group">
                            <div className="flex items-center mb-4 md:mb-0 w-full md:w-1/4">
                                <div className="w-10 h-10 rounded-full mr-4 bg-blue-50 text-primary flex items-center justify-center border border-blue-100">
                                    <Plane className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{flight.airline}</div>
                                    <div className="text-xs text-gray-500">{flight.flightNumber} • {flight.class}</div>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center items-center w-full md:w-2/4 px-4 text-center mb-4 md:mb-0">
                                <div>
                                    <div className="text-lg font-bold text-gray-800">{flight.departureTime?.split('T')[1]?.substr(0, 5) || ''}</div>
                                    <div className="text-xs text-gray-500">{params.from}</div>
                                </div>
                                <div className="flex flex-col items-center mx-6 w-full">
                                    <span className="text-xs text-gray-400 mb-1">{flight.duration}</span>
                                    <div className="w-full h-[1px] bg-gray-300 relative">
                                        {flight.stops === 0 ? (
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 text-[10px] px-1 text-gray-400">Direct</div>
                                        ) : (
                                             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-green-600 mt-1 font-medium">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-800">{flight.arrivalTime?.split('T')[1]?.substr(0, 5) || ''}</div>
                                    <div className="text-xs text-gray-500">{params.to}</div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/4 flex flex-col items-end border-l border-gray-100 pl-6">
                                <div className="text-2xl font-bold text-primary mb-1">${flight.price}</div>
                                <div className="text-xs text-gray-400 mb-3">per traveler</div>
                                <button 
                                    onClick={() => onSelectFlight(flight)}
                                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full md:w-auto text-sm"
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
