import { Button, Form, Input, message, Table } from "antd";
import { useEffect, useState } from "react";
import getAllAttractions from "../../utils/adapter/getAllAttractions";
import getAllLanguages from "../../utils/adapter/getAllLanguages";

import config from '../../config.json'
import addAttractionToPilot from "../../utils/adapter/addAttractionToPilot";
import addLanguageToPilot from "../../utils/adapter/addLanguageToPilot";
import addLanguageToWorker from "../../utils/adapter/addLanguageToWorker";

const onFinish = (values: any) => {
};
// const attraction_columns = [
//     {
//         title: 'Atrakcja',
//         key: 'atrakcja',
//         render: (text: any, record: any) => <>{record.nazwa}</>,
//     },
//     {
//         title: 'Adres',
//         key: 'adres',
//         render: (text: any, record: any) => <>{record.adres}</>,
//     },
//     {
//         title: 'Opis',
//         key: 'opis',
//         render: (text: any, record: any) => <>{record.opis}</>,
//     },
// ]
const languages_columns = [
    {
        title: 'Kod języka',
        key: 'kod',
        render: (text: any, record: any) => <>{record.kod}</>,
    },
    {
        title: 'Język',
        key: 'jezyk',
        render: (text: any, record: any) => <>{record.nazwa}</>,
    },
]
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
const AddEmployee = () => {
    const [form] = Form.useForm();



    const [selectedLanguagesKeys, setSelectedLanguagesKeys] = useState<React.Key[]>([]);
    const [languagesData, setLanguagesData] = useState();
    const onSelectLanguagesChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedLanguagesKeys(newSelectedRowKeys);
    };
    const rowLanguagesSelection = {
        selectedLanguagesKeys,
        onChange: onSelectLanguagesChange,
    };

    useEffect(() => {
        getAllLanguages(setLanguagesData)
    }, [])

    const onFinish = (values: any) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ params: values })
        };

        fetch(config.SERVER_URL + "/api/push/worker", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                if (response.status == 200) {
                    selectedLanguagesKeys.map((value: any) => {
                        addLanguageToWorker(value, response.result)
                    })
                    console.log(response)
                    setTimeout(function () {
                        window.open('/pracownicy', '_self')
                    }, 2.0 * 1000);
                } else {
                    message.error("Wystąpił błąd podczas dodawania przewodnika, odśwież strone i spróbuj ponownie")
                }

            }).then(() => {
                if (message.error.length == 0) {
                    // window.open('/pracownicy')
                }
            })
            .catch((error) => message.error('Błąd połączenia z serwerem'));
    };
    return <>
        <h2>Dodawanie nowego pracownika</h2>
        <Form
            form={form}
            {...formItemLayout}
            name="add_pilto"
            onFinish={onFinish}
            style={{ maxWidth: 1200 }}
            scrollToFirstError
        >
            <Form.Item
                name="imie"
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
                name="nazwisko"
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
                name="adres"
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
            <Form.Item
                name="numer_telefon"
                label="Numer telefonu"
                rules={[
                    {
                        required: true,
                        message: 'Pole numer telefonu nie może być puste!',
                    },
                    {
                        validator: (rule, value) => {
                            if (!/^\+?[0-9]{10,12}$/.test(value)) {
                                return Promise.reject('Numer telefonu jest nieprawidłowy');
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input />
            </Form.Item>
            {/* <Form.Item
                label="Powiązany z atrakcjami"
            >
                <Table
                    rowSelection={rowAttractionSelection}
                    columns={attraction_columns}
                    dataSource={attractionData}
                />
            </Form.Item> */}
            <Form.Item
                label="Zna języki"
            >
                <Table
                    rowSelection={rowLanguagesSelection}
                    columns={languages_columns}
                    dataSource={languagesData}
                />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Dodaj pracownika
                </Button>
            </Form.Item>
        </Form>
    </>
}
export default AddEmployee;
