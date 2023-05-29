import { Button, DatePicker, Form, Input, InputNumber, message, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
import config from '../../config.json'
import addEtapToJourney from "../../utils/adapter/addEtapToJourney";
import getCertainEtap from "../../utils/adapter/getCertainEtapData";
import getJourneyData from "../../utils/adapter/getJourneyData";
import { stringToDate } from "../home/UpdateClient";
import { onlyUnique } from "../Pilots/UpdatePilot";
import getTransportData from "../../utils/adapter/getTransportData";
import { RowSelectionType } from "antd/es/table/interface";
const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: 'Proszę wybrać date i godzine' }],
};

const columns_transport = [
    {
        title: 'Nazwa',
        key: 'nazwa',
        render: (text: any, record: any) => <>{record.nazwa}</>,
    },
    {
        title: 'Liczba jednostek',
        key: 'liczba_jednostek',
        render: (text: any, record: any) => <>{record.liczba_jednostek}</>,
    },
    {
        title: 'Liczba miejsc',
        key: 'liczba_miejsc',
        render: (text: any, record: any) => <>{record.liczba_miejsc}</>,
    },
]
const columns_journey = [
    {
        title: 'Nazwa',
        key: 'nazwa',
        render: (text: any, record: any) => <>{record.nazwa}</>,
        sorter: (a: any, b: any) => a.nazwa.localeCompare(b.nazwa),
    },
    {
        title: 'Cena',
        key: 'cena',
        render: (text: any, record: any) => <>{record.cena}zł</>,
        sorter: (a: any, b: any) => a.cena - b.cena,
    },
    {
        title: 'Data rozpoczecia',
        key: 'data_rozpoczecia',
        render: (text: any, record: any) => <>{record.data_rozpoczecia.split(' ')[0]}</>,
        sorter: (a: any, b: any) => stringToDate(a.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
    },
    {
        title: 'Data ukonczenia',
        key: 'data_ukonczenia',
        render: (text: any, record: any) => <>{record.data_ukonczenia.split(' ')[0]}</>,
        sorter: (a: any, b: any) => stringToDate(a.data_ukonczenia.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.data_ukonczenia.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
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
const UpdateEtap = () => {
    const [form] = Form.useForm();
    const { id } = useParams();

    const [data, setData] = useState({ data_poczatkowa: '', data_koncowa: '', firmy_transportowe: [], podroze: [], transport: [] });
    const [loading, setLoading] = useState(false);
    const [selectedJounrneyKeys, setSelectedJounrneyKeys] = useState<React.Key[]>([]);
    const [journeyData, setJourneyData] = useState();
    const onSelectLanguagesChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedJounrneyKeys(newSelectedRowKeys);

    };
    const rowJourneySelection = {
        selectedRowKeys: selectedJounrneyKeys,
        preserveSelectedRowKeys: false,
        onChange: onSelectLanguagesChange,
    };
    const [selectedTransportKeys, setSelectedTransportKeys] = useState<React.Key[]>([]);
    const [transportData, setTransportData] = useState();
    const onSelectTransportsChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedTransportKeys(newSelectedRowKeys);

    };
    const rowTransportSelection = {
        selectedRowKeys: selectedTransportKeys,
        preserveSelectedRowKeys: false,
        type: 'radio' as RowSelectionType,
        onChange: onSelectTransportsChange,
    };
    useEffect(() => {
        getCertainEtap(id, setData)
        getTransportData(setTransportData);
        getJourneyData(setJourneyData)
        form.setFieldsValue({ koszt: 0 })
    }, [])

    useEffect(() => {
        form.setFieldsValue(data)
        if (data.transport.length > 0 && data.transport.at(-1)) {
            let transport: any = []
            data.transport.map((value: any) => {
                transport.push(value.id)
            })
            setSelectedTransportKeys(transport)
        }
        if (data.data_poczatkowa) {
            form.setFieldsValue({ data_rozpoczecia: [dayjs(data.data_poczatkowa), dayjs(data.data_koncowa)] })
            const sendData = {
                id_list: [],
                from: dayjs(data.data_poczatkowa).format('DD-MM-YYYY'),
                to: dayjs(data.data_koncowa).format('DD-MM-YYYY')
            }
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ params: sendData })
            };

            fetch(config.SERVER_URL + "/api/get/certain_journey", requestOptions)
                .then((response) => response.json())
                .then((response) => {

                    if (response.status == 200) {
                        setJourneyData(response.result)
                    } else {
                        message.error("Wystąpił błąd podczas pobierania podróży, spróbuj ponownie")
                    }

                })
        }
        let podroze: any = []
        data.podroze.map((value: any) => {
            podroze.push(value.id)
        })
        setSelectedJounrneyKeys(podroze)
    }, [data])


    const onChange = (data: any) => {
        console.log(data)
        let sendData = {
            id_list: [],
            from: '',
            to: ''
        }

        if (data && data[0] && data[1]) {
            sendData = {
                id_list: [],
                from: data[0].format('DD-MM-YYYY'),
                to: data[1].format('DD-MM-YYYY')
            }
        }


        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ params: sendData })
        };

        fetch(config.SERVER_URL + "/api/get/certain_journey", requestOptions)
            .then((response) => response.json())
            .then((response) => {

                if (response.status == 200) {
                    setJourneyData(response.result)
                    setSelectedJounrneyKeys([])
                } else {
                    message.error("Wystąpił błąd podczas pobierania podróży, spróbuj ponownie")
                }

            }).then(() => {

            })
            .catch((error) => message.error('Błąd połączenia z serwerem'));
    }



    const onFinish = (values: any) => {


        const out = {
            id: Number(id),
            punkt_poczatkowy: values.punkt_poczatkowy,
            punkt_konczowy: values.punkt_konczowy,
            koszt: values.koszt,
            data_poczatkowa: values.data_rozpoczecia[0].format('DD-MM-YYYY'),
            data_koncowa: values.data_rozpoczecia[1].format('DD-MM-YYYY'),
            transport_id: selectedTransportKeys.length == 0 ? -1 : selectedTransportKeys.at(0)
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ params: out })
        };

        setLoading(true)
        fetch(config.SERVER_URL + "/api/update/certain_etap", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                if (response.status == 200) {
                    selectedJounrneyKeys.filter(onlyUnique).map((value: any) => {
                        addEtapToJourney(Number(id), value)
                    })
                    message.success("Pomyślnie zaktualizowano etap")
                    setTimeout(function () {
                        window.open('/etapy', '_self')
                    }, 2.0 * 1000);
                } else {
                    setLoading(false)
                    message.error("Wystąpił błąd podczas aktualizowania etapu, spróbuj ponownie")
                }

            })
            .catch((error) => message.error('Błąd połączenia z serwerem'));
    };
    return <>
        <h2>Dodawanie nowego etapu</h2>
        <Form
            form={form}
            {...formItemLayout}
            name="add_pilto"
            onFinish={onFinish}
            style={{ maxWidth: 1200 }}
            scrollToFirstError
        >
            <Form.Item
                name="punkt_poczatkowy"
                label="Punkt poczatkowy"
                rules={[
                    {
                        required: true,
                        message: 'Pole punkt poczatkowy nie może być puste!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="punkt_konczowy"
                label="Punkt konczowy"
                rules={[
                    {
                        required: true,
                        message: 'Pole punkt konczowy nie może być puste!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="koszt"
                label="Koszt (zł)"
                rules={[
                    {
                        required: true,
                        message: 'Pole adres nie może być puste!',
                    },
                    {
                        validator: (rule, value) => {
                            if (value < 0) {
                                return Promise.reject('Koszt musi być dodatni');
                            }
                            return Promise.resolve();
                        },
                    }
                ]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item name="data_rozpoczecia" label="Data rozpoczęcia i zakończenia" {...rangeConfig} required>
                <RangePicker format="DD-MM-YYYY" onChange={onChange} />
            </Form.Item>

            <Form.Item
                label="Powiązany z transportem"
            >
                <Table
                    rowSelection={rowTransportSelection}
                    columns={columns_transport}
                    dataSource={transportData}
                />
            </Form.Item>

            <Form.Item
                label="Powiązany z podróżami"
            >
                <Table
                    rowSelection={rowJourneySelection}
                    columns={columns_journey}
                    dataSource={journeyData}
                />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Zatwierdź edycje
                </Button>
            </Form.Item>
        </Form>
    </>
}
export default UpdateEtap 
