import React, { useState } from 'react';
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    DatePicker
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 2 },
        sm: { span: 13 },
    },
};
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

const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: 'Proszę wybrać termin!' }],
};

const { RangePicker } = DatePicker;
const TravelForm: React.FC = () => {
    const [form] = Form.useForm();


    const onFinish = (fieldsValue: any) => {
        // Should format date value before submit.
        const rangeValue = fieldsValue['range-picker'];
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
            ...fieldsValue,
            'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
            'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
            'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
            'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
            'range-time-picker': [
                rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
            ],
            'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
        };
        console.log('Received values of form: ', values);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle
            rules={
                [
                    {
                        required: true,
                        message: 'Proszę wprowadzić prefix'
                    }
                ]
            }>
            <Select style={{ width: 70 }}>
                <Option value="48">+48</Option>
            </Select>
        </Form.Item>
    );

    const suffixSelector = (
        <Form.Item name="suffix" noStyle
            rules={
                [
                    {
                        required: true,
                        message: 'Proszę wybrać walutę'
                    }
                ]
            }>
            <Select style={{ width: 70 }}>
                <Option value="USD">USD</Option>
                <Option value="PLN">PLN</Option>
                <Option value="EURO">EUR</Option>
            </Select>
        </Form.Item>
    );

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

    const onWebsiteChange = (value: string) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            // initialValues={{
            //   residence: ['zhejiang', 'hangzhou', 'xihu'],
            //   prefix: '48',
            // }}

            scrollToFirstError
        >

            <Form.Item
                name="nazwa_podrozy"
                label="Nazwa podróży"
                // rules={[
                //   {
                //     type: 'email',
                //     message: 'The input is not valid E-mail!',
                //   },
                //   {
                //     required: true,
                //     message: 'Please input your E-mail!',
                //   },
                // ]}
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item name="data_podrozy" label="Data rozpoczęcia i zakończenia" {...rangeConfig} hasFeedback>
                <RangePicker />
            </Form.Item>

            <Form.Item
                name="opis_podrozy"
                label="Opis"
            >
                <TextArea
                    showCount
                    maxLength={1000}
                    style={{ height: 120, marginBottom: 24 }}
                />
            </Form.Item>

            <Form.Item
                name="cena_podrozy"
                label="Cena"
                rules={[{ required: true, message: 'Proszę wprowadzić cenę!' }]}
                hasFeedback
            >
                <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="nazwa_atrakcji"
                label="Nazwa atrakcji"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="sezon"
                label="Sezon"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="opis"
                label="Opis"
            ><TextArea
                    showCount
                    maxLength={1000}
                    style={{ height: 120, marginBottom: 24 }}
                />
            </Form.Item>

            <Form.Item
                name="adres_zakwaterowania_atrakcja"
                label="Adres zakwaterowania"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić adres'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="cena_atrakcji"
                label="Cena"
                rules={[{ required: true, message: 'Proszę wprowadzić cenę!' }]}
                hasFeedback
            >
                <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="nazwa_zakwaterowania"
                label="Nazwa zakwaterowania"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="ilosc_miejsc_zakwaterowania"
                label="Ilość miejsc"
                rules={
                    [
                        {
                            type: 'number',
                            message: 'Proszę wprowadzić liczbę'
                        },
                        {

                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <InputNumber required min={0} />
            </Form.Item>

            <Form.Item
                name="standard_zakwaterowania"
                label="Standard zakwaterowania"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić adres'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="adres_zakwaterowania"
                label="Adres zakwaterowania"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić adres'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="nazwa_etapu"
                label="Nazwa etapu"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="punkt_poczatkowy"
                label="Punkt poczatkowy"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="punkt_koncowy"
                label="Punkt końcowy"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="cena_etapu"
                label="Cena"
                rules={[{ required: true, message: 'Proszę wprowadzić cenę!' }]}
                hasFeedback
            >
                <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="data_etapu" label="Data rozpoczęcia i zakończenia" {...rangeConfig} hasFeedback>
                <RangePicker />
            </Form.Item>

            <Form.Item
                name="nazwa_transporu"
                label="Nazwa transportu"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="liczba_jednostek"
                label="Liczba jednostek"
                rules={
                    [
                        {
                            type: 'number',
                            message: 'Proszę wprowadzić liczbę'
                        },
                        {

                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <InputNumber required min={0} />
            </Form.Item>


            <Form.Item
                name="liczba_miejsc_transportu"
                label="liczba_miejsc"
                rules={
                    [
                        {
                            type: 'number',
                            message: 'Proszę wprowadzić liczbę'
                        },
                        {

                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <InputNumber required min={0} />
            </Form.Item>

            <Form.Item
                name="nazwa_firma_transportowa"
                label="Nazwa firmy transportowej"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić nazwę'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="telefon"
                label="Numer telefonu"
                rules={[{ required: true, message: 'Proszę wprowadzić numer telefonu!' }]}
            >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="adres_firma_transportowa"
                label="Adres firmy"
                rules={
                    [
                        {
                            required: true,
                            message: 'Proszę wprowadzić adres'
                        }
                    ]
                }
                hasFeedback
            >
                <Input />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Dodaj podróż
                </Button>
            </Form.Item>


        </Form>
    );
};

export default TravelForm;
