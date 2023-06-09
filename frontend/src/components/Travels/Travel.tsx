// import { UseAppContext } from "../../AppContextProvider";
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { StaticHandler } from '@remix-run/router';


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: React.Key;
    Nazwa: string;
    Data_rozpoczecia: string;
    Data_ukonczenia: string;
    Opis: string;
    Cena: string;
}
interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 10 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {

    key: React.Key;
    Nazwa: string;
    Data_rozpoczecia: string;
    Data_ukonczenia: string;
    Opis: string;
    Cena: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const Travel: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {

            key: '0',
            Nazwa: '1',
            Data_rozpoczecia: '2',
            Data_ukonczenia: '3',
            Opis: '4',
            Cena: '5',
        },

    ]);

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'Nazwa',
            dataIndex: 'Nazwa',
            editable: true,
        },
        {
            title: 'Data rozpoczecia',
            dataIndex: 'Data_rozpoczecia',
            editable: true,

        },
        {
            title: 'Data ukonczenia',
            dataIndex: 'Data_ukonczenia',
            editable: true,
        },
        {
            title: 'Opis',
            dataIndex: 'Opis',
            editable: true,

        },
        {
            title: 'Cena',
            dataIndex: 'Cena',

        },
        {
            title: 'Operation',
            dataIndex: 'Operation',
            render: (_, record: any) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,

        },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: count,
            Nazwa: '1',
            Data_rozpoczecia: '2',
            Data_ukonczenia: '3',
            Opis: '4',
            Cena: '5',
            //address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <Button href='podrozy/dodaniePodrozy' onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Dodaj podróż
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default Travel;
