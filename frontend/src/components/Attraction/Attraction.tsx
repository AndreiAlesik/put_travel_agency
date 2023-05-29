import { Button, Collapse, List, Popconfirm, Space, Table, Tag, } from "antd"
import { useEffect, useState } from "react";
import getAttraction from "../../utils/adapter/getAttractionData";
import removeAttraction from "../../utils/adapter/removeAttraction";

const { Panel } = Collapse;

const AttractionView = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        getAttraction(setData)
    }, [])
    const columns = [
        {
            title: 'Nazwa',
            key: 'nazwa',
            render: (text: any, record: any) => <>{record.nazwa}</>,
            sorter: (a: any, b: any) => a.nazwa.localeCompare(b.nazwa),
        },
        {
            title: 'Adres',
            render: (text: any, record: any) => <a href={"https://www.google.com/maps/search/?api=1&query=" + record.adres.replace(' ', '+')}>{record.adres}</a>,
            key: 'adres',
            sorter: (a: any, b: any) => a.adres.localeCompare(b.adres),
        },

        {
            title: 'Sezon',
            key: 'sezon',
            render: (text: any, record: any) =>
                <>{record.sezon.length > 0 ? <>{record.sezon.map((value: any) => <Tag>{value}</Tag>)}</> : <>Brak zdefiniowanych sezonów</>}</>,
            filters: [
                {
                    text: 'Wiosna',
                    value: 'Wiosna',
                },
                {
                    text: 'Lato',
                    value: 'Lato',
                },
                {
                    text: 'Jesień',
                    value: 'Jesien',
                },
                {
                    text: 'Zima',
                    value: 'Zima',
                },
            ],
            onFilter: (value: any, record: any) => record.sezon.join('').toLowerCase().indexOf(value.toLowerCase()) === 0,
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
            title: 'Przewodnicy',
            key: 'przewodnicy',
            render: (text: any, record: any) =>
                <>{record.przewodnicy.length > 0 ?
                    <Collapse >
                        <Panel header={record.przewodnicy.length > 1 ? "Przepisano " + record.przewodnicy.length + " przewodników" : "Przepisano " + record.przewodnicy.length + " przewodnika"} key="1">
                            <List
                                bordered
                                dataSource={record.przewodnicy}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        {item.imie} {item.nazwisko} tel:{item.numer_telefonu}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse >
                    :
                    <>Brak przypisanych przewodników</>

                }</>
        },
        {
            title: 'Akcja',
            render: (text: any, record: any) => <>
                <a href={"/atrakcje/edycja/" + record.id}>Edytuj</a><br />
                <Popconfirm title="Czy napewno chcesz usunąć atrakcje?" onConfirm={() => removeAttraction(record.id)}>
                    <a>Usuń</a>
                </Popconfirm>
            </>
        },
    ]
    return (
        <div>
            <h2>Atrakcje</h2>
            <Space><Button type="primary" onClick={() => { window.open('/atrakcje/dodaj', '_self') }}>Dodaj atrakcje</Button></Space>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />
        </div>
    )
}
export default AttractionView
