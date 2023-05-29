import { Button, Form, Input, message, Result, Table } from "antd";
import { useEffect, useState } from "react";

import config from '../../config.json'
import { useParams } from "react-router-dom";
import getCertainClient from "../../utils/adapter/getCertainClientData";
import getJourneyData from "../../utils/adapter/getJourneyData";
import addClientToJourney from "../../utils/adapter/addClientsToJourney";
import { onlyUnique } from "../Pilots/UpdatePilot";

export function stringToDate(_date: any, _format: any, _delimiter: any) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const columns_journey = [
    {
        title: 'Nazwa',
        key: 'nazwa',
        render: (text: any, record: any) => <>{record.name}</>,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
        title: 'Cena',
        key: 'cena',
        render: (text: any, record: any) => <>{record.price}</>,
        sorter: (a: any, b: any) => a.price - b.price,
    },
    {
        title: 'Data rozpoczecia',
        key: 'data_rozpoczecia',
        render: (text: any, record: any) => <>{record.start_date.split(' ')[0]}</>,
        sorter: (a: any, b: any) => stringToDate(a.start_date.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.start_date.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
    },
    {
        title: 'Data ukonczenia',
        key: 'data_ukonczenia',
        render: (text: any, record: any) => <>{record.end_date.split(' ')[0]}</>,
        sorter: (a: any, b: any) => stringToDate(a.end_date.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.end_date.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
    },
];

const UpdateClient = () => {
    const { pesel } = useParams();
    console.log(pesel);
    const [form] = Form.useForm();
    const [data, setData] = useState({ personalNumber: pesel || '', name: '', surname: '', address: '', phoneNumber: '', birthDate: '', podroze: [] });
    const [loading, setLoading] = useState(false);

    const [selectedJounrneyKeys, setSelectedJounrneyKeys] = useState<React.Key[]>([]);
    const [journeyData, setJounrneyData] = useState<any[]>([]);
    const onSelectLanguagesChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedJounrneyKeys(newSelectedRowKeys);
    };
    const rowJourneySelection = {
        selectedRowKeys: selectedJounrneyKeys,
        preserveSelectedRowKeys: false,
        onChange: onSelectLanguagesChange,
    };

    useEffect(() => {
        getCertainClient(pesel, (response: { status: string; result: any }) => {
          if (response.status === "OK") {
            const { personalNumber, name, surname, address, phoneNumber, dateOfBirth } = response.result;
            setData({
              personalNumber,
              name,
              surname,
              address,
              phoneNumber,
              birthDate: dateOfBirth,
              podroze: [], // Assuming podroze is an array
            });
            form.setFieldsValue({
              name,
              surname,
              address,
              phoneNumber,
            });
          } else {
            message.error("Failed to fetch client data. Please try again.");
          }
        });
        getJourneyData(setJounrneyData);
      }, [pesel, form]);


    const onFinish = (values: any) => {
        const peselValue = pesel ? parseInt(pesel, 10) : 0;

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(values), // Remove the "values" wrapper
        };

        setLoading(true);
        fetch(config.SERVER_URL + `/api/update/certain-client/${peselValue}`, requestOptions) // Include the personalNumber in the API request URL
            .then((response) => response.json())
            .then((response) => {
                console.log(values);
                if (response.status === "OK") {
                    selectedJounrneyKeys.filter(onlyUnique).map((value: any) => {
                        addClientToJourney(pesel, value);
                    });
                    message.success("Aktualizacja klienta powiodła się.");
                    setTimeout(function () {
                        window.open('/klienty', '_self');
                    }, 2.0 * 1000);
                } else {
                    setLoading(false);
                    message.error("Wystąpił błąd podczas edycji klienta, odśwież stronę i spróbuj ponownie.");
                }
            })
            .catch(() => message.error('Błąd połączenia z serwerem'));
    };

    return (
        <>
            <h2>Edycja klienta</h2>
            <Form
                form={form}
                {...formItemLayout}
                name="add_pilto"
                onFinish={onFinish}
                style={{ maxWidth: 1200 }}
                scrollToFirstError
            >
                <Form.Item hidden name="pesel" label="Pesel">
                    <Input readOnly value={data.personalNumber} />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Imię"
                    rules={[
                        {
                            required: true,
                            message: 'Pole imię nie może być puste!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="surname"
                    label="Nazwisko"
                    rules={[
                        {
                            required: true,
                            message: 'Pole nazwisko nie może być puste!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Adres"
                    rules={[
                        {
                            required: true,
                            message: 'Pole adres nie może być puste!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item hidden name="data_urodzenia" label="Data urodzenia">
                    <Input hidden />
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Numer telefonu"
                    rules={[
                        {
                            required: true,
                            message: 'Pole numer telefonu nie może być puste!',
                        },
                        {
                            validator: (_, value) => {
                                if (!/^\+?[0-9]{10,12}$/.test(value)) {
                                    return Promise.reject('Numer telefonu jest nieprawidłowy');
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name=""
                    label="Powiązane z podróżami"
                >
                    <Table
                        columns={columns_journey}
                        dataSource={journeyData}
                        rowSelection={rowJourneySelection}
                    />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Zatwierdź edycje klienta
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default UpdateClient;
