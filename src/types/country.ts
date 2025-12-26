export interface CountryShort {
    name: {
      common: string;
    };
    cca3: string;
  }
  
  export interface CountryFull {
    name: {
      common: string;
    };
    capital?: string[];
    population: number;
    borders?: string[];
  }
  