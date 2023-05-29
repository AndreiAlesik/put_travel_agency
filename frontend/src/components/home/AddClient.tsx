import { Button, DatePicker, Form, Input, message, Table } from "antd";
import { useEffect, useState } from "react";

import config from '../../config.json'
import addClientToJourney from "../../utils/adapter/addClientsToJourney";
import getJourneyData from "../../utils/adapter/getJourneyData";
import { onlyUnique } from "../Pilots/UpdatePilot";
import { stringToDate } from "./UpdateClient";


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
];
const AddClients = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, []);
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
  useEffect(() => {
    getJourneyData(setJourneyData);
  }, []);

  const onFinish = (values: any) => {
    const clientData = {
      name: values.imie,
      personalNumber: values.pesel,
      surname: values.nazwisko,
      address: values.adres,
      phoneNumber: values.numer_telefonu,
      dateOfBirth: values.data_urodzenia.toISOString(),
    };
  
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(clientData),
    };
  
    setLoading(true);
    fetch(config.SERVER_URL + "/api/push/client", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "OK") {
          selectedJounrneyKeys.filter(onlyUnique).map((value: any) => {
            addClientToJourney(response.result, value);
          });
          message.success("Dodanie klienta powiodło się.");
          console.log(response);
          setTimeout(function () {
            window.open('/klienty', '_self');
          }, 2.0 * 1000);
        } else {
          setLoading(false);
          message.error(response.message || "Wystąpił błąd podczas dodawania klienta, klient o podanym PESEL już istnieje");
        }
      })
      .catch((error) => message.error('Błąd połączenia z serwerem'));
  };

  return (
    <>
      <h2>Dodawanie nowego klienta</h2>
      <Form
        form={form}
        {...formItemLayout}
        name="add_pilto"
        onFinish={onFinish}
        style={{ maxWidth: 1200 }}
        scrollToFirstError
      >
        <Form.Item
          name="pesel"
          label="PESEL"
          rules={[
            {
              required: true,
              message: 'Pole PESEL nie może być puste!',
            },
            {
              validator: (rule, value) => {
                if (value.length !== 11) {
                  return Promise.reject('PESEL musi być długości 11');
                }
                return Promise.resolve();
              },
            },
            {
              validator: (rule, value) => {
                if (isNaN(+value)) {
                  return Promise.reject('PESEL musi składać się z cyfr');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
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
          name="numer_telefonu"
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
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="data_urodzenia"
          label="Data urodzenia"
          rules={[
            {
              required: true,
              message: 'Pole data urodzenia nie może być puste!',
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="" label="Powiązany z podróżami">
          <Table
            columns={columns_journey}
            dataSource={journeyData}
            rowSelection={rowJourneySelection}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Dodaj klienta
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddClients;