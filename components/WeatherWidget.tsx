'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/minicomp/card";
import { Button } from "@/components/minicomp/button";
import { AnimatedNumber } from './minicomp/animated-number';
import { Cloud, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import { useTheme } from 'next-themes';
import { Autocomplete } from './AutoComplete';

const showAlert = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    footer: '<a target="_blank" href="https://www.weather.com/">Check available cities here</a>',
    background: '#0f172a',
    color: '#e0f2fe',
    confirmButtonColor: '#06b6d4',
  });
};

async function checkWeather({ latitude, longitude }: { latitude: string, longitude: string }) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,wind_speed_10m`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Failed to fetch weather data');
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    showAlert('Unable to fetch weather data. Please try again later.');
  }
}

async function getCoordinates(placeName: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const location = data[0];
      try {
        const weatherData = await checkWeather({ latitude: location.lat, longitude: location.lon });
        return { location, weatherData };
      } catch (error) {
        console.log(error);
        showAlert('Failed to get weather data. Please try again later.');
      }
    } else {
      showAlert('City not found. Please enter a valid city name.');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    showAlert('Unable to fetch coordinates. Please try again later.');
  }
  return null; // if no valid data is found
}

export function WeatherWidget() {
  const { theme } = useTheme();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getCoordinates(city);
    if (result) {
      const { location, weatherData } = result;
      setWeather({ location, weatherData });
    }
    setLoading(false);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
  };

  return (
    <Card
      className={`bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800 text-cyan-200' : 'from-blue-100 to-cyan-200 text-blue-900'
        } shadow-lg rounded-lg overflow-hidden backdrop-blur-md`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-4xl font-bold">
          <Sun className="mr-2 text-cyan-400" />
          Weather Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Autocomplete onSelect={handleCitySelect} />
          <Button
            type="submit"
            className={`w-full py-3 text-lg font-medium ${theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-500 text-gray-900' : 'bg-cyan-400 hover:bg-cyan-500 text-white'
              } rounded-lg shadow-md`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </Button>
        </form>
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 space-y-6"
          >
            <h3 className="text-2xl font-semibold text-center">{weather.location.display_name}</h3>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center text-3xl font-semibold">
                <Cloud className="mr-2 text-cyan-400" />
                <AnimatedNumber value={weather.weatherData.current_weather.temperature} /> °C
              </div>
              <p className="text-lg font-medium">Wind Speed: <AnimatedNumber value={weather.weatherData.current_weather.windspeed} /> km/h</p>
            </div>
            <div className="mt-6 h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weather.weatherData.hourly.time.map((time: string, index: number) => ({
                    time: time.replace('T', ' '),
                    temperature: weather.weatherData.hourly.temperature_2m[index],
                  }))}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                >
                  <XAxis dataKey="time" stroke={theme === 'dark' ? '#81e6d9' : '#065f46'} />
                  <YAxis stroke={theme === 'dark' ? '#81e6d9' : '#065f46'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#e0f2fe',
                      borderColor: theme === 'dark' ? '#155e75' : '#81e6d9',
                      color: theme === 'dark' ? '#e0f2fe' : '#1e293b',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
