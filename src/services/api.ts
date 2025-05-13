import axios from 'axios';
// todo : remplacer par l'url de l'api ?

export const API_BASE_URL = 'http://localhost:3000'; // Replace with your API base URL

export const fetchData = async (endpoint: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Additional API functions can be added here as needed.