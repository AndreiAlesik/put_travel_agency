import { Collapse, List, Popconfirm, Table, Tag, Space, Button } from "antd"
import { useEffect, useState } from "react";
import getEtapyData from "../../utils/adapter/getEtapyData";
import removeEtap from "../../utils/adapter/removeEtap";
import { stringToDate } from "../home/UpdateClient";

const { Panel } = Collapse;

const EtapView = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        getEtapyData(setData)

    }, [])
    const columns = [
        {
            title: 'Punkt poczatkowy',
            key: 'punkt_poczatkowy',
            render: (text: any, record: any) => <a href={"https://www.google.com/maps/search/?api=1&query=" + record.punkt_poczatkowy.replace(' ', '+')}>{record.punkt_poczatkowy}</a>,
        },
        {
            title: 'Punkt koncowy',
            render: (text: any, record: any) => <a href={"https://www.google.com/maps/search/?api=1&query=" + record.punkt_konczowy.replace(' ', '+')}>{record.punkt_konczowy}</a>,
            key: 'punkt_konczowy',
        },
        {
            title: 'Koszt',
            key: 'koszt',
            sorter: (a: any, b: any) => a.koszt - b.koszt,
            render: (text: any, record: any) => <>{record.koszt}zł</>,
        },
        {
            title: 'Data poczatkowa',
            key: 'data_poczatkowa',
            render: (text: any, record: any) => <>{record.data_poczatkowa.split(' ')[0]}</>,
            sorter: (a: any, b: any) => stringToDate(a.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
        },
        {
            title: 'Data koncowa',
            key: 'data_koncowa',
            render: (text: any, record: any) => <>{record.data_koncowa.split(' ')[0]}</>,
            sorter: (a: any, b: any) => stringToDate(a.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.data_rozpoczecia.split(' ')[0], "yyyy-mm-dd", '-').getTime(),
        },

        {
            title: 'Transport',
            key: 'transport',
            render: (text: any, record: any) =>
                record.transport.length > 0 ? <>
                    Nazwa: {record.transport[0].nazwa}<br />
                    Liczba jednostek: {record.transport[0].liczba_jednostek}<br />
                    Liczba miejsc: {record.transport[0].liczba_miejsc}
                </> : <></>


        },
        {
            title: 'Akcja',
            render: (text: any, record: any) => <>
                <a href={"/etapy/edycja/" + record.id}>Edytuj</a><br />
                <Popconfirm title="Czy napewno chcesz usunąć etap z jego transportem?" onConfirm={() => removeEtap(record.key)}>
                    <a>Usuń</a>
                </Popconfirm>
            </>
        },
    ]
    return (
        <div>
            <h2>Etapy</h2>
            <Space><Button type="primary" onClick={() => { window.open('/etapy/dodaj', '_self') }}>Dodaj etap</Button></Space>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />
        </div>
    )
}
export default EtapView
