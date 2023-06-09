import { message } from "antd";
import config from "../../config.json";

const getCertainPilot = (id: any, setData: any) => {
    if (isNaN(+id)) {
        message.error("Zły identyfikator przewodnika")
        setTimeout(function () {
            window.open('/przewodnicy', '_self')
        }, 2.0 * 1000);

    } else {

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ params: { id_list: [Number(id)] } })
        };
        fetch(config.SERVER_URL + "/api/get/certain_pilots", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                if (response.status == 200 && response.result.length > 0) {
                    setData(response.result[0]);
                } else {
                    message.error("Taki przewodnik nie istnieje")
                    setTimeout(function () {
                        window.open('/przewodnicy', '_self')
                    }, 2.0 * 1000);
                }
            })
            .catch((error) => console.log('Błąd połączenia z serwerem'));

    }
};

export default getCertainPilot;
