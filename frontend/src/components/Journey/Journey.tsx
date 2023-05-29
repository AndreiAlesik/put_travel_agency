import { Collapse, List, Popconfirm, Table, Tag, Space, Button, message, InputNumber } from "antd"
import { useEffect, useState } from "react";
import getJourneyData from "../../utils/adapter/getJourneyData";
import removeJourney from "../../utils/adapter/removeJourney";
import { stringToDate } from "../home/UpdateClient";

import config from '../../config.json'
const { Panel } = Collapse;

const inflacja = (value: any, setValue: any) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ params: value })
    };

    fetch(config.SERVER_URL + "/api/get/inflacja", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if (response.status == 200) {
                message.success('Inflacja została naniesiona')
                setTimeout(function () {
                    window.open('/', '_self')
                }, 2.0 * 1000);

            }
        })
}

const JourneysView = () => {

    const [data, setData] = useState([]);
    const [inflacjaState, setInflacjaState] = useState<number>(0);
    useEffect(() => {
        getJourneyData(setData)
    }, [])
    const columns = [
        {
            title: 'Nazwa',
            key: 'nazwa',
            sorter: (a: any, b: any) => a.nazwa.localeCompare(b.nazwa),
            render: (text: any, record: any) => <>{record.nazwa}</>,
        },
        {
            title: 'Cena',
            key: 'cena',
            sorter: (a: any, b: any) => a.cena - b.cena,
            render: (text: any, record: any) => <>{record.cena}zł</>,
        },
        {
            title: 'Zysk',
            key: 'zysk',
            sorter: (a: any, b: any) => a.zysk - b.zysk,
            render: (text: any, record: any) => <>{record.zysk}zł</>,

        },
        {
            title: 'Opis',
            key: 'opis',
            sorter: (a: any, b: any) => a.nazwa.localeCompare(b.opis),
            render: (text: any, record: any) => <>{record.opis.length > 0 ? 
                record.opis
                :
                <>Brak opisu</>
            }</>,
        },
        {
            title: 'Termin',
            key: 'data_rozpoczecia',
            sorter: (a: any, b: any) => stringToDate(a.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
            render: (text: any, record: any) => <>od {record.data_rozpoczecia.split(' ')[0]}<br />do {record.data_ukonczenia.split(' ')[0]}</>,
        },
        {
            title: 'Kierowane przez pracowników',
            key: 'pracownicy',
            render: (text: any, record: any) =>
                <>{record.pracownicy.length > 0 ?

                    <Collapse >
                        <Panel header={record.pracownicy.length > 4 ? "Kierowane przez" + record.pracownicy.length + " pracowników" : "Kierowane przez " + record.pracownicy.length + " pracowników"} key="1">
                            <List
                                bordered
                                dataSource={record.pracownicy}

                                renderItem={(item: any) => (

                                    <List.Item>
                                        {item.imie + ' ' + item.nazwisko}<br />
                                        {item.numer_telefon}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak przypisanych pracowników</>
                }</>
        },

        {
            title: 'Atrakcje',
            key: 'atrakcje',
            render: (text: any, record: any) =>
                <>{record.atrakcje.length > 0 ?

                    <Collapse >
                        <Panel header={record.atrakcje.length > 4 ? "Obsługuje " + record.atrakcje.length + " atracje" : "Obsługuje " + record.atrakcje.length + " atrakcje"} key="1">
                            <List
                                bordered
                                dataSource={record.atrakcje}

                                renderItem={(item: any) => (

                                    <List.Item>
                                        {item.nazwa}<br />
                                        <a href={"https://www.google.com/maps/search/?api=1&query=" + item.adres.replace(' ', '+')}>{item.adres}</a><br />
                                        {item.koszt}zł
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak przypisanych atrakcji</>
                }</>
        },
        {
            title: 'Klienci',
            key: 'klienci',
            render: (text: any, record: any) =>
                <>{record.klienci.length > 0 ?

                    <Collapse >
                        <Panel header={record.klienci.length > 4 ? "Przepisano " + record.klienci.length + " klientów" : "Przepisano " + record.klienci.length + " klientów"} key="1">
                            <List
                                bordered
                                dataSource={record.klienci}

                                renderItem={(item: any) => (

                                    <List.Item>
                                        {item.imie + ' ' + item.nazwisko}<br />
                                        {item.numer_telefonu}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak danych</>
                }</>
        },

        {
            title: 'Przewodnicy',
            key: 'przewodnicy',
            render: (text: any, record: any) =>
                <>{record.klienci.length > 0 ?

                    <Collapse >
                        <Panel header={record.przewodnicy.length > 4 ? "Jest pilotowana przez " + record.przewodnicy.length + " przewodników" : "Jest pilotowana przez " + record.przewodnicy.length + " przewodników"} key="1">
                            <List
                                bordered
                                dataSource={record.przewodnicy}

                                renderItem={(item: any) => (

                                    <List.Item>
                                        {item.imie + ' ' + item.nazwisko}<br />
                                        <a href={"https://www.google.com/maps/search/?api=1&query=" + item.adres.replace(' ', '+')}>{item.adres}</a><br />
                                        {item.numer_telefonu}.
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak przypisanych przewodników</>
                }</>
        },
        {
            title: 'Zakwaterowania',
            key: 'zakwaterowania',
            render: (text: any, record: any) =>
                <>{record.zakwaterowania.length > 0 ?

                    <Collapse >
                        <Panel header={record.zakwaterowania.length > 4 ? "Ilość zakwaterowań " + record.zakwaterowania.length : "Ilość zakwaterowań  " + record.zakwaterowania.length} key="1">
                            <List
                                bordered
                                dataSource={record.zakwaterowania}
                                renderItem={(item: any) => (

                                    <List.Item>
                                        {item.nazwa}<br />
                                        {item.koszt}zł<br />
                                        Miejsca: {item.ilosc_miejsc}<br />
                                        Standard {item.standard_zakwaterowania}<br />
                                        Miejsc: {item.ilosc_miejsc}<br />
                                        <a href={"https://www.google.com/maps/search/?api=1&query=" + item.adres.replace(' ', '+')}>{item.adres}</a>
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak przypisanych</>
                }</>
        },

        {
            title: 'Akcja',
            render: (text: any, record: any) => <>

                <a href={"/podrozy/edycja/" + record.id}>Edytuj</a><br />
                <Popconfirm title="Czy napewno chcesz usunąć podróż?" onConfirm={() => removeJourney(record.key)}>
                    <a>Usuń</a>
                </Popconfirm>
            </>
        },
    ]
    return (
        <div>
            <h2>Podróże</h2>
            <Space>Inflacja <InputNumber min={0} value={inflacjaState} onChange={(value: any) => { setInflacjaState(value); console.log(value) }} /> <Button onClick={() => inflacja(inflacjaState, setInflacjaState)}>Wprowadź</Button></Space>

            <br />
            <br />        <Space><Button type="primary" onClick={() => { window.open('/podrozy/dodaj', '_self') }}>Dodaj podróż</Button></Space>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />
        </div >
    )
}
export default JourneysView
