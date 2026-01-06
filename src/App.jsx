import { useState, useEffect, useCallback } from 'react'
import './App.css'

// API URLs
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_GEOCODING_API = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

// WMO Weather codes mapping
const getWeatherCondition = (code) => {
  const conditions = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Dense Drizzle',
    56: 'Freezing Drizzle',
    57: 'Freezing Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain',
    67: 'Freezing Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm',
  }
  return conditions[code] || 'Unknown'
}

// Get day name from date
const getDayName = (dateStr, index) => {
  if (index === 0) return 'Today'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

// Format hour for display
const formatHour = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

// Icons as SVG components
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const WindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
)

const HumidityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
)

const LocationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const CurrentLocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
)

const LightbulbIcon = ({ isOn = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lightbulb-icon ${isOn ? 'on' : ''}`}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="external-link-icon">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)

// Credits Modal Component
const CreditsModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content credits-modal" onClick={e => e.stopPropagation()}>
      <button className="credits-close-btn" onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="credits-header">
        <div className="credits-icon">
          <LightbulbIcon />
        </div>
        <h2 className="credits-title">About SkyCast</h2>
      </div>
      <div className="credits-list">
        <div className="credits-item">
          <span className="credits-label">Developed by</span>
          <span className="credits-value">Mahima KG</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">Project Name</span>
          <span className="credits-value">SkyCast</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">Library</span>
          <span className="credits-value">React</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">API</span>
          <span className="credits-value">Open-Meteo APIs</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">UI Inspiration</span>
          <a href="https://dribbble.com/shots/15524720-Weather-web-app" target="_blank" rel="noopener noreferrer" className="credits-link">
            Dribbble <ExternalLinkIcon />
          </a>
        </div>
        <div className="credits-item">
          <span className="credits-label">Fonts</span>
          <span className="credits-value">Google Fonts</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">CSS</span>
          <span className="credits-value">Custom CSS</span>
        </div>
        <div className="credits-item">
          <span className="credits-label">Deployed to</span>
          <span className="credits-value">Vercel</span>
        </div>
      </div>
    </div>
  </div>
)

// Location Permission Modal Component
const LocationModal = ({ onRequestPermission }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-icon">
        <LocationIcon />
      </div>
      <h2 className="modal-title">Enable Location</h2>
      <p className="modal-text">
        SkyCast needs access to your location to show weather information for your area.
        Please allow location access when prompted.
      </p>
      <button className="modal-btn" onClick={onRequestPermission}>
        Allow Location Access
      </button>
    </div>
  </div>
)

// Loading Component
const LoadingState = () => (
  <div className="app">
    <div className="weather-container">
      <div className="main-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Fetching weather data...</span>
        </div>
      </div>
    </div>
  </div>
)

// Fetching Location Modal
const FetchingLocationModal = () => (
  <div className="modal-overlay fetching-modal">
    <div className="modal-content fetching-content">
      <div className="fetching-spinner"></div>
      <p className="fetching-text">Fetching current location weather...</p>
    </div>
  </div>
)

// Searching Location Modal
const SearchingModal = ({ locationName }) => (
  <div className="modal-overlay fetching-modal">
    <div className="modal-content fetching-content">
      <div className="fetching-spinner"></div>
      <p className="fetching-text">Searching weather for {locationName}...</p>
    </div>
  </div>
)

// Error Component
const ErrorState = ({ message, onRetry }) => (
  <div className="app">
    <div className="weather-container">
      <div className="main-panel">
        <div className="error-container">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <p className="error-message">{message}</p>
          <button className="retry-btn" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
)

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showFetchingModal, setShowFetchingModal] = useState(false)
  const [showSearchingModal, setShowSearchingModal] = useState(false)
  const [searchingLocation, setSearchingLocation] = useState('')
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [location, setLocation] = useState('')

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch weather data from Open-Meteo
  const fetchWeather = useCallback(async (lat, lon, locationName) => {
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,weather_code',
        daily: 'temperature_2m_max,weather_code',
        timezone: 'auto',
        forecast_days: '7',
      })

      const response = await fetch(`${WEATHER_API}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch weather data')

      const data = await response.json()

      // Get current hour index for hourly forecast
      const currentHour = new Date().getHours()
      const hourlyStartIndex = data.hourly.time.findIndex(t => {
        const hour = new Date(t).getHours()
        return hour >= currentHour
      })

      // Transform API response to our format
      const transformedData = {
        location: locationName,
        date: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '.'),
        currentTemp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: getWeatherCondition(data.current.weather_code),
        windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
        humidity: data.current.relative_humidity_2m,
        weekly: data.daily.time.slice(0, 6).map((date, index) => ({
          day: getDayName(date, index),
          temp: Math.round(data.daily.temperature_2m_max[index]),
          condition: getWeatherCondition(data.daily.weather_code[index]),
        })),
        hourly: data.hourly.time.slice(hourlyStartIndex, hourlyStartIndex + 6).map((time, index) => ({
          time: formatHour(time),
          temp: Math.round(data.hourly.temperature_2m[hourlyStartIndex + index]),
          condition: getWeatherCondition(data.hourly.weather_code[hourlyStartIndex + index]),
        })),
      }

      setWeatherData(transformedData)
      setLocation(locationName)
      setError(null)
    } catch (err) {
      setError('Unable to fetch weather data. Please try again.')
      console.error('Weather fetch error:', err)
    }
  }, [])

  // Search location using geocoding API
  const searchLocation = async (query) => {
    try {
      setSearchLoading(true)
      const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`)
      if (!response.ok) throw new Error('Geocoding failed')

      const data = await response.json()

      if (!data.results || data.results.length === 0) {
        setError('Location not found. Please try a different search.')
        setSearchLoading(false)
        return
      }

      const { latitude, longitude, name, country } = data.results[0]
      const locationName = country ? `${name}, ${country}` : name

      await fetchWeather(latitude, longitude, locationName)
    } catch (err) {
      setError('Unable to find location. Please try again.')
      console.error('Geocoding error:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  // Request geolocation permission
  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    setShowPermissionModal(false)
    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Get location name using reverse geocoding
        let locationName = 'Your Location'
        try {
          const response = await fetch(`${REVERSE_GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          const data = await response.json()

          if (data.city && data.countryName) {
            locationName = `${data.city}, ${data.countryName}`
          } else if (data.locality && data.countryName) {
            locationName = `${data.locality}, ${data.countryName}`
          } else if (data.city) {
            locationName = data.city
          } else if (data.locality) {
            locationName = data.locality
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err)
        }

        await fetchWeather(latitude, longitude, locationName)
        setLoading(false)
        setShowFetchingModal(false)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setShowPermissionModal(true)
        setLoading(false)
        setShowFetchingModal(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [fetchWeather])

  // Initialize - request location on mount
  useEffect(() => {
    requestLocationPermission()
  }, [requestLocationPermission])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      await submitSearch()
    }
  }

  const submitSearch = async () => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      setSearchingLocation(query)
      setShowSearchingModal(true)
      setSearchQuery('')
      setSearchOpen(false)

      // Minimum 3 seconds display time for the modal
      const minDisplayTime = new Promise(resolve => setTimeout(resolve, 3000))
      const searchPromise = searchLocation(query)

      await Promise.all([minDisplayTime, searchPromise])
      setShowSearchingModal(false)
    }
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    // Capitalize first letter of each word
    const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase())
    setSearchQuery(capitalized)
  }

  const handleCurrentLocationClick = async () => {
    setShowFetchingModal(true)
    // Minimum 3 seconds display time for the modal
    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 3000))
    const fetchPromise = new Promise(resolve => {
      // Start fetching location
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser')
        resolve()
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          let locationName = 'Your Location'
          try {
            const response = await fetch(`${REVERSE_GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            const data = await response.json()

            if (data.city && data.countryName) {
              locationName = `${data.city}, ${data.countryName}`
            } else if (data.locality && data.countryName) {
              locationName = `${data.locality}, ${data.countryName}`
            } else if (data.city) {
              locationName = data.city
            } else if (data.locality) {
              locationName = data.locality
            }
          } catch (err) {
            console.error('Reverse geocoding error:', err)
          }

          await fetchWeather(latitude, longitude, locationName)
          resolve()
        },
        (err) => {
          console.error('Geolocation error:', err)
          setShowPermissionModal(true)
          resolve()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })

    // Wait for both minimum time and fetch to complete
    await Promise.all([minDisplayTime, fetchPromise])
    setShowFetchingModal(false)
  }

  // Show permission modal if needed
  if (showPermissionModal) {
    return (
      <div className="app">
        <LocationModal onRequestPermission={requestLocationPermission} />
      </div>
    )
  }

  // Show loading state
  if (loading && !weatherData) {
    return <LoadingState />
  }

  // Show error state
  if (error && !weatherData) {
    return <ErrorState message={error} onRetry={requestLocationPermission} />
  }

  // Don't render if no data
  if (!weatherData) {
    return <LoadingState />
  }

  return (
    <div className="app">
      {showPermissionModal && (
        <LocationModal onRequestPermission={requestLocationPermission} />
      )}

      {showFetchingModal && <FetchingLocationModal />}
      {showSearchingModal && <SearchingModal locationName={searchingLocation} />}
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}

      <button
        className="floating-info-btn"
        onClick={() => setShowCreditsModal(true)}
        title="About SkyCast"
      >
        <LightbulbIcon />
      </button>

      <div className="weather-container">
        {/* Main Panel */}
        <div className="main-panel">
          {/* Header */}
          <div className="header">
            <div className="location-wrapper">
              <button
                className={`search-btn ${searchOpen ? 'active' : ''}`}
                onClick={() => {
                  if (searchOpen) {
                    setSearchQuery('')
                  }
                  setSearchOpen(!searchOpen)
                }}
              >
                {searchOpen ? <CloseIcon /> : <SearchIcon />}
              </button>
              {searchOpen ? (
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onKeyDown={handleSearch}
                    autoFocus
                  />
                  {searchQuery.trim() && (
                    <button className="search-submit-btn" onClick={submitSearch}>
                      <ArrowIcon />
                    </button>
                  )}
                </div>
              ) : searchLoading ? (
                <span className="search-loading">
                  <span className="mini-spinner"></span>
                  Searching...
                </span>
              ) : (
                <>
                  <span className="location">{location}</span>
                  <button
                    className="current-location-btn"
                    onClick={handleCurrentLocationClick}
                    title="Get current location"
                  >
                    <CurrentLocationIcon />
                  </button>
                </>
              )}
            </div>
            <span className="date">{weatherData.date}</span>
          </div>

          {/* Current Weather */}
          <div className="current-weather">
            <div className="temperature-main">
              <span className="temp-value">{weatherData.currentTemp}</span>
              <span className="temp-degree">°</span>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <WindIcon />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
              <div className="detail-item">
                <HumidityIcon />
                <span>{weatherData.humidity} %</span>
              </div>
            </div>
          </div>

          <div className="condition">{weatherData.condition}</div>

          {/* Weekly Forecast */}
          <div className="weekly-forecast">
            {weatherData.weekly.map((day, index) => (
              <div key={index} className={`forecast-day ${index === 0 ? 'today' : ''}`}>
                <span className="day-name">{day.day}</span>
                <span className="day-temp">{day.temp}°</span>
                <span className="day-condition">{day.condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <div className="greeting">{getGreeting()}</div>
          <div className="current-time">{formatTime()}</div>

          <div className="side-weather-info">
            <div className="side-temp-row">
              <span className="side-temp">{weatherData.currentTemp}°</span>
              <div className="side-details">
                <div className="side-detail">
                  <WindIcon />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="side-detail">
                  <HumidityIcon />
                  <span>{weatherData.humidity} %</span>
                </div>
              </div>
            </div>
            <div className="feels-like">Feels like {weatherData.feelsLike}°</div>
            <div className="side-condition">{weatherData.condition}</div>
          </div>

          <div className="hourly-section">
            <div className="hourly-title">Hourly Forecast</div>
            <div className="hourly-grid">
              {weatherData.hourly.map((hour, index) => (
                <div key={index} className="hourly-item">
                  <span className="hour-time">{hour.time}</span>
                  <span className="hour-temp">{hour.temp}°</span>
                  <span className="hour-condition">{hour.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
