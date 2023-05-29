import { Button, Collapse, Input, List, Popconfirm, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import getClientsData from "../../utils/adapter/getClientsData";
import removeClient from "../../utils/adapter/removeClient";
import { stringToDate } from "./UpdateClient";
import { SearchOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const ClientsView = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (confirm: (param?: any) => void) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: { setSelectedKeys: (keys: React.Key[]) => void, selectedKeys: React.Key[], confirm: () => void, clearFilters: () => void }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div style={{ textAlign: 'right' }}>
          <Space style={{ paddingTop: 10 }}>
            <Button onClick={() => handleReset(clearFilters)} size="middle">
              Reset
            </Button>
            <Button
              type="primary"
              onClick={() => handleSearch(confirm)}
              icon={<SearchOutlined />}
              size="middle"
            >
              Search
            </Button>
          </Space>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: '#00a498' }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getClientsData(setData);
  }, []);

  const columns = [
    {
      title: 'Personal Number',
      dataIndex: 'personalNumber',
      key: 'personalNumber',
      sorter: (a: any, b: any) => a.personalNumber.localeCompare(b.personalNumber),
      ...getColumnSearchProps('personalNumber'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
      key: 'surname',
      sorter: (a: any, b: any) => a.surname.localeCompare(b.surname),
      ...getColumnSearchProps('surname'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text: any, record: any) => <a href={"https://www.google.com/maps/search/?api=1&query=" + record.address.replace(' ', '+')}>{record.address}</a>,
      sorter: (a: any, b: any) => a.address.localeCompare(b.address),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a: any, b: any) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      sorter: (a: any, b: any) => stringToDate(a.dateOfBirth.split('T')[0], "yyyy-mm-dd", '-').getTime() - stringToDate(b.dateOfBirth.split('T')[0], "yyyy-mm-dd", '-').getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <>
          <a href={`/klienty/edycja/${record.personalNumber}`}>Edit</a><br />
          <Popconfirm title="Confirm whether you want to delete the client" onConfirm={() => removeClient(record.personalNumber)}>
            <a>Delete</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Klienci</h2>
      <Space>
        <Button type="primary" onClick={() => { window.open('/klienty/dodaj', '_self') }}>
          Dodaj klienta
        </Button>
      </Space>
      <br />
      <br />
      <Table columns={columns} dataSource={data.map((item, index) => ({ ...item, key: index.toString() }))} />
    </div>
  );
};

export default ClientsView;
