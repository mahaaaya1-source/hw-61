import { useCallback, useEffect, useState } from 'react';
import { makeRequest } from './api/makeRequest';
import { CountryFull, CountryShort } from './types/country';
import './App.css';

const ALL_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca3';

const COUNTRY_BY_CODE =
  'https://restcountries.com/v3.1/alpha/';

const App = () => {
  const [countries, setCountries] = useState<CountryShort[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryFull | null>(null);
  const [borders, setBorders] = useState<string[]>([]);

  const fetchCountries = useCallback(async () => {
    const data = await makeRequest<CountryShort[]>(ALL_COUNTRIES_URL);
    setCountries(data);
  }, []);

  const fetchCountry = useCallback(async () => {
    if (!selectedCode) return;

    const [data] = await makeRequest<CountryFull[]>(
      COUNTRY_BY_CODE + selectedCode
    );

    setCountry(data);

    if (data.borders && data.borders.length > 0) {
      const borderPromises = data.borders.map(code =>
        makeRequest<CountryFull[]>(COUNTRY_BY_CODE + code)
      );

      const borderCountries = await Promise.all(borderPromises);
      setBorders(borderCountries.map(c => c[0].name.common));
    } else {
      setBorders([]);
    }
  }, [selectedCode]);

  useEffect(() => {
    fetchCountries().catch(console.error);
  }, [fetchCountries]);

  useEffect(() => {
    fetchCountry().catch(console.error);
  }, [fetchCountry]);

  return (
    <div className="layout">
      <aside className="list">
        {countries.map(country => (
          <button
            key={country.cca3}
            onClick={() => setSelectedCode(country.cca3)}
          >
            {country.name.common}
          </button>
        ))}
      </aside>

      <main className="info">
        {!country && <p>Выберите страну</p>}

        {country && (
          <>
            <h2>{country.name.common}</h2>
            <p>Столица: {country.capital?.[0] ?? '—'}</p>
            <p>Население: {country.population}</p>

            <h4>Граничит с:</h4>
            {borders.length === 0 && <p>Нет границ</p>}
            <ul>
              {borders.map(border => (
                <li key={border}>{border}</li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
