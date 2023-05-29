import { Button, Collapse, List, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import getLanguagesData from "../../utils/adapter/getLanguageData";
import removeLanguage from "../../utils/adapter/removeLanguage";

const { Panel } = Collapse;

const LangView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getLanguagesData(setData);
  }, []);

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Language',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      render: (text: any, record: any) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => removeLanguage(record.id)}
        >
          <a>Usuń</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Języki</h2>
      <Space>
        <Button type="primary" onClick={() => { window.open('/jezyki/dodaj', '_Self') }}>
          Add language
        </Button>
      </Space>
      <br />
      <br />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default LangView;
