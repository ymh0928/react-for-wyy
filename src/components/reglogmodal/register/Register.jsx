import "./register.css";
import { Fragment, useContext } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { PhoneOutlined, LockOutlined, HeartOutlined } from "@ant-design/icons";
import { AppContext } from "../../../store/Store";
import { API_CONFIG } from "../../../utils/config";
import axios from "axios";

export default function Register() {
  const { setChangeRegLog } = useContext(AppContext);

  const onFinish = async (values) => {
    console.log(values);
    const resultRegister = await axios.get(
      `${API_CONFIG}cellphone/existence/check?phone=${values.phone}`
    );
    if (resultRegister.data.exist === 1) {
      message.warning("该手机号已被注册!");
    }
  };

  return (
    <Fragment>
      <div className="register-modal-wrap">
        <Form
          id="registerForm"
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          width="530px"
          height="394.98px"
        >
          <label>昵称</label>
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: "请输入昵称" }]}
          >
            <Input
              prefix={<HeartOutlined className="site-form-item-icon" />}
              placeholder="请输入昵称"
            />
          </Form.Item>

          <label>密码</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>

          <label>手机号</label>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
              () => ({
                validator(rule, value) {
                  if (/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
                    return Promise.resolve();
                  }

                  return Promise.reject("不是规范的手机格式!");
                },
              }),
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
          </Form.Item>

          <label>验证码</label>
          <Row>
            <Col xl={16}>
              <Form.Item
                name="captcha"
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <Input placeholder="请输入验证码" />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item>
                <Button type="primary" className="login-form-button">
                  获取
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Form.Item style={{ float: "right", marginBottom: "0" }}>
              <a onClick={() => setChangeRegLog({ type: "登录页" })}>
                已有账号，我要登录
              </a>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              下一步
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
}
