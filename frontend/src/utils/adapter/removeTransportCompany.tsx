import { message } from "antd";
import config from "../../config.json";

const removeTransportCompany = (id: any) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ params: { id: id } })
    };

    fetch(config.SERVER_URL + "/api/delete/transport_company", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if (response.status == 200) {
                message.success("Firmea trnasportowa została usunięta")
                window.open('/firma_transportowa', '_self')
            } else {
                message.success("Wystąpił błąd podczas usuwania firmy transportowerj, odśwież strone i spróbuj ponownie")
            }

        })
        .catch((error) => console.log('Błąd połączenia z serwerem'));
};

export default removeTransportCompany;
//
