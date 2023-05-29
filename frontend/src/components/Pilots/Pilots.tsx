import { Collapse, List, Popconfirm, Table, Tag, Space, Button } from "antd"
import { useEffect, useState } from "react";
import getPilotData from "../../utils/adapter/getPilotData";
import removePilot from "../../utils/adapter/removePilot";
const { Panel } = Collapse;

const PilotsView = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        getPilotData(setData)
    }, [])
    const columns = [
        {
            title: 'Przewodnik',
            key: 'pilot',
            render: (text: any, record: any) => <>{record.imie + ' ' + record.nazwisko}</>,
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
        },
        {
            title: 'Atrakcje',
            key: 'atrakcje',
            render: (text: any, record: any) =>
                <>{record.atrakcje.length > 0 ?

                    <Collapse >
                        <Panel header={record.atrakcje.length > 4 ? "Obsługuje " + record.atrakcje.length + " atrkacji" : "Obsługuje " + record.atrakcje.length + " atrakcje"} key="1">
                            <List
                                bordered
                                dataSource={record.atrakcje}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        {item.nazwa}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse > :
                    <>Brak danych</>
                }</>
        },
        {
            title: 'Znane języki',
            render: (text: any, record: any) =>
                <>{record.jezyki.length > 0 ? <>{record.jezyki.map((value: any) => <Tag>{value.nazwa}</Tag>)}</> : <>Brak danych</>}</>
        },
        {
            title: 'Podróże',
            key: 'podroze',
            render: (text: any, record: any) =>
                <>{record.podroze.length > 0 ?
                    <Collapse >
                        <Panel header={record.podroze.length > 4 ? "Obsługuje " + record.atrakcje.length + " podróże" : "Obsługuje " + record.podroze.length + " podróży"} key="1">
                            <List
                                bordered
                                dataSource={record.podroze}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        {item.nazwa}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse >
                    :
                    <>Brak danych</>

                }</>
        },
        {
            title: 'Akcja',
            render: (text: any, record: any) => <>
                <a href={"/przewodnicy/edycja/" + record.id}>Edytuj</a><br />
                <Popconfirm title="Napewno usunąć przewodnika?" onConfirm={() => removePilot(record.key)}>
                    <a>Usuń</a>
                </Popconfirm>
            </>
        },
    ]
    return (
        <div>
            <h2>Przewodnicy</h2>
            <Space><Button type="primary" onClick={() => { window.open('/przewodnicy/dodaj', '_self') }}>Dodaj przewodnika</Button></Space>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />
        </div>
    )
}
export default PilotsView
