// Text to Speech Service
const API_BASE_URL = 'http://127.0.0.1:8000';

export const convertTextToSpeech = async (text) => {
  try {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(`${API_BASE_URL}/tts`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('Error in convertTextToSpeech:', error);
    throw error;
  }
};