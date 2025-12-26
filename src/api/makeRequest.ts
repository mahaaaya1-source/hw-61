export const makeRequest = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error('Network error');
    }
  
    return response.json();
  };

  