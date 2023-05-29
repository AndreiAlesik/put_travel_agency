import { message } from "antd";
import config from "../../config.json";

const removeLanguage = (languageId: number) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  
    fetch(`${config.SERVER_URL}/api/delete/language?id=${languageId}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          // Language successfully deleted
          // Perform any necessary cleanup or UI updates
          message.success("Język został usunięty");
          window.location.reload(); // Refresh the page
        } else {
          // Error deleting the language
          message.error("Wystąpił błąd podczas usuwania języka");
        }
      })
      .catch((error) => message.error('Błąd połączenia z serwerem'));
  };

export default removeLanguage;
