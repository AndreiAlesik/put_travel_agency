import config from "../../config.json";

const getClientsData = (setData: any) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        
    };
    fetch(config.SERVER_URL + "/api/getCustomers", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            setData(response.result);
        })
        .catch((error) => console.log('Błąd połączenia z serwerem'));
};

export default getClientsData;
