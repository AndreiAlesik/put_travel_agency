import { message } from "antd";
import config from "../../config.json";

const removeTransportNew = (id: any) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ params: { id: id } })
    };

    fetch(config.SERVER_URL + "/api/delete/transport", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if (response.status == 200) {
                message.success("Transport został usunięty")
                window.open('/transport', '_self')
            } else {
                message.error("Wystąpił błąd podczas usuwania transportu, odśwież strone i spróbuj ponownie")
            }

        })
        .catch((error) => console.log('Błąd połączenia z serwerem'));
};

export default removeTransportNew;
//
