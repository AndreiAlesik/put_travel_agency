import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from '../../config.json';

const AddLang = () => {
  const [form] = Form.useForm();
  const [createSuccess, setCreateSuccess] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(values),
    };

    fetch(config.SERVER_URL + "/api/push/language", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "CREATED") {
          console.log(response.result);
          setCreateSuccess(true);
        } else {
          message.error(response.message);
        }
      })
      .catch((error) => message.error('Server connection error'));
  };

  const handleReset = () => {
    form.resetFields();
    setCreateSuccess(false);
  };

  useEffect(() => {
    if (createSuccess) {
      const timeout = setTimeout(() => {
        navigate("/jezyki");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [createSuccess, navigate]);

  return (
    <>
      <h2>Add New Language</h2>
      {createSuccess ? (
        <div>
          <p>Language created successfully!</p>
          <Button type="primary" onClick={handleReset}>
            Add Another Language
          </Button>
        </div>
      ) : (
        <Form
          form={form}
          name="add_pilot"
          onFinish={onFinish}
          style={{ maxWidth: 1200 }}
          scrollToFirstError
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: 'Code is required!',
              },
              {
                max: 5,
                message: 'Maximum 5 characters allowed'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Language
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default AddLang;
