/*export default class GameServer {
    constructor() {
      this.apiURL = 'https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes';
    }
  
    async readUrl(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.text();
      } catch (error) {
        console.error('An error occurred:', error);
        return null;
      }
    }
  
    async getRandomGame() {
      const dataRaw = await this.readUrl(this.apiURL);
      if (!dataRaw) return null;
  
      const [base64Image, solutionStr] = dataRaw.split(',');
      const solution = parseInt(solutionStr, 10);
  
      const image = new Image();
      image.src = `data:image/png;base64,${base64Image}`;
  
      return new Promise((resolve) => {
        image.onload = () => {
          resolve({ image, solution });
        };
        image.onerror = (error) => {
          console.error('Failed to load the image:', error);
          resolve(null);
        };
      });
    }
  }
  */