import { message } from "antd";
import config from "../../config.json";

const removeClient = (id: any) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    };

    fetch(config.SERVER_URL + `/api/delete/client/${id}`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if (response.status === "OK") {
                message.success("Client został usunięty");
                window.location.reload(); // Refresh the page
            } else {
                message.error("Wystąpił błąd podczas usuwania przewodnika, odśwież stronę i spróbuj ponownie.");
            }
        })
        .catch((error) => console.log('Błąd połączenia z serwerem'));
};

export default removeClient;