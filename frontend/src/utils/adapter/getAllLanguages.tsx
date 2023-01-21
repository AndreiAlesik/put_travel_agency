import { message } from "antd";
import config from "../../config.json";

const getAllLanguages = (setData: any) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    };
    fetch(config.SERVER_URL + "/api/get/all_languages", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            setData(response.result);
        })
        .catch((error) => message.error('Błąd połączenia z serwerem'));
};

export default getAllLanguages;
