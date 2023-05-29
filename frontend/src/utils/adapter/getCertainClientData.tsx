import { message } from "antd";
import config from "../../config.json";

const getCertainClient = (pesel: any, setData: any) => {
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      fetch(`${config.SERVER_URL}/api/get/certain-client?id=${pesel}`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if (response.status === "OK") {
            setData(response.result[0]);
          } else {
            message.error("Taki klient nie istnieje");
            console.log(`${config.SERVER_URL}/api/get/certain-client?id=${pesel}`, requestOptions);
            // setTimeout(function () {
            //   window.open("/klienty", "_self");
            // }, 2.0 * 1000);
          }
        })
        .catch((error) => console.log("Błąd połączenia z serwerem"));
    };
    
export default getCertainClient; 