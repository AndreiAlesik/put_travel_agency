import { Button, DatePicker, Form, Input, InputNumber, message, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";


import config from '../../config.json'
import { useParams } from "react-router-dom";
import getCertainAttraction from "../../utils/adapter/getCertainAttractionData";
import { stringToDate } from "../home/UpdateClient";
import addAttractionToJourney from "../../utils/adapter/addAttractionToJourney";
import addAttractionToPilot from "../../utils/adapter/addAttractionToPilot";
import getJourneyData from "../../utils/adapter/getJourneyData";
import getPilotData from "../../utils/adapter/getPilotData";
// import { onlyUnique } from "../Pilots/UpdatePilot";
import TextArea from "antd/es/input/TextArea";

const options = [{ value: 'zima' }, { value: 'lato' }, { value: 'wiosna' }, { value: 'jesień' }];
const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag

            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
};

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
        render: (text: any, record: any) => <>{record.cena}</>,
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
const columns_pilot = [
    {
        title: 'Przewodnik',
        key: 'pilot',
        render: (text: any, record: any) => <>{record.imie + ' ' + record.nazwisko}</>,
        sorter: (a: any, b: any) => a.nazwisko.localeCompare(b.nazwisko),
    },
    {
        title: 'Numer telefonu',
        key: 'telefon',
        render: (text: any, record: any) => <>{record.numer_telefonu}</>,
    },
    {
        title: 'Addres',
        render: (text: any, record: any) => <a href={"https://www.google.com/maps/search/?api=1&query=" + record.adres.replace(' ', '+')}>{record.adres}</a>,
        key: 'addres',
        sorter: (a: any, b: any) => a.adres.localeCompare(b.adres),
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
export function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}
const UpdateAttraction = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [data, setData] = useState({ pesel: '', imie: '', nazwisko: "", adres: '', numer_telefonu: '', data_urodzenia: '', koszt: 0, podroze: [], przewodnicy: [] });
    const [loading, setLoading] = useState(false);

    const [selectedJounrneyKeys, setSelectedJounrneyKeys] = useState<React.Key[]>([]);
    const [journeyData, setJounrneyData] = useState();
    const onSelectLanguagesChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedJounrneyKeys(newSelectedRowKeys.filter(onlyUnique));

    };
    const rowJourneySelection = {
        selectedRowKeys: selectedJounrneyKeys,
        preserveSelectedRowKeys: false,
        onChange: onSelectLanguagesChange,
    };

    const [selectedPilotKeys, setSelectedPilotKeys] = useState<React.Key[]>([]);
    const [pilotData, setPilotData] = useState();
    const onSelectPilotChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedPilotKeys(newSelectedRowKeys.filter(onlyUnique));
        
    };
    const rowPilotSelection = {
        selectedRowKeys: selectedPilotKeys,
        preserveSelectedRowKeys: false,
        onChange: onSelectPilotChange,
    };


    useEffect(() => {
        getCertainAttraction(id, setData)
        getJourneyData(setJounrneyData);
        getPilotData(setPilotData);

    }, [])
    useEffect(() => {
        form.setFieldsValue(data)
        let piloci: any = []
        let podroze: any = []
        data.podroze.map((value: any) => {
            podroze.push(value.id)
            console.log(value.id)
        })
        data.przewodnicy.map((value: any) => {
            piloci.push(value.id)
            console.log(value.id)
        })

        setSelectedJounrneyKeys(podroze)
        setSelectedPilotKeys(piloci)

    }, [data])
    const onFinish = (values: any) => {
        values.id = Number(id)
        if(!values.opis){
            values.opis=''
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ params: values })
        };
        setLoading(true);
        fetch(config.SERVER_URL + "/api/update/certain_attraction", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                console.log(values);
                if (response.status == 200) {
                    selectedJounrneyKeys.filter(onlyUnique).map((value: any) => {
                        addAttractionToJourney(Number(id), value)
                    })
                    selectedPilotKeys.filter(onlyUnique).map((value: any) => {
                        addAttractionToPilot(Number(id), value)
                    })

                    message.success("Aktualizacja atrakcji powiodła się.")
                    setTimeout(function () {
                        window.open('/atrakcje', '_self')
                    }, 2.0 * 1000);
                } else {
                    setLoading(false)
                    message.error("Wystąpił błąd podczas edycji atrakcji, odśwież strone i spróbuj ponownie")
                }

            }).catch((error) => message.error('Błąd połączenia z serwerem'));
    };
    return <>
        <h2>Edycja atrakcji</h2>
        <Form
            form={form}
            {...formItemLayout}
            name="add_pilto"
            onFinish={onFinish}
            style={{ maxWidth: 1200 }}
            scrollToFirstError
        >

            <Form.Item
                name="nazwa"
                label="Nazwa"
                rules={[
                    {
                        required: true,
                        message: 'Pole nazwa nie może być puste!',
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
                        message: 'Pole nazwisko nie może być puste!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="sezon"
                label="Sezon"
            >
                <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}

                    style={{ width: '100%' }}
                    options={options}
                />
            </Form.Item>
            <Form.Item
                name="opis"
                label="Opis"
               
            >
                <TextArea
                    showCount
                    maxLength={1000}
                    style={{ height: 120, marginBottom: 24 }}
                />

            </Form.Item>
            <Form.Item
                name="koszt"
                label="Koszt (zł)"
                rules={[
                    {
                        validator: (rule, value) => {
                            if (value < 0) {
                                return Promise.reject('Koszt nie może być ujemny');
                            }
                            return Promise.resolve();
                        },
                    }
                ]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item
                name=""
                label="Powiązana z podróżami"
            >
                <Table columns={columns_journey} dataSource={journeyData}
                    rowSelection={rowJourneySelection}
                />
            </Form.Item>
            <Form.Item
                name=""
                label="Powiązana z przewodnikami"
            >
                <Table columns={columns_pilot} dataSource={pilotData}
                    rowSelection={rowPilotSelection}
                />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Zatwierdź edycje atrakcji
                </Button>
            </Form.Item>
        </Form>
    </>
}
export default UpdateAttraction 
