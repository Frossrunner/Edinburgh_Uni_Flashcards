export const getDeck = async (deckId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/Api/decks/${deckId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching deck: ${response.statusText}`);
      }
  
      const deckData = await response.json();
      return deckData;
    } catch (error) {
      console.error('getDeck error:', error);
      throw error;
    }
  };
  
  export const updateDeck = async (deckId, updatedDeck) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/Api/decks/${deckId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedDeck),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating deck: ${response.statusText}`);
      }
  
      const updatedDeckData = await response.json();
      return updatedDeckData;
    } catch (error) {
      console.error('updateDeck error:', error);
      throw error;
    }
  };