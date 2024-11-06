export async function fetchGameInterface() {
  const apiURL = 'https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes';

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Failed to fetch from API:', error);

    
    const mockData = {
      base64Image: 'iVBORw0KGgoAAAANSUhEUgAAA...', 
      solution: 8,
    };
    console.warn('Using mock data as a fallback');
    return mockData;
  }
}
