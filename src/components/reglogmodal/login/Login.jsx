import "./login.css";
import { Fragment, useContext } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { AppContext } from "../../../store/Store";
import { codeJson } from "../../../utils/base64";
import { API_CONFIG } from "../../../utils/config";
import axios from "axios";
import { useUpdateEffect } from "ahooks";

export default function Login() {
  const {
    setChangeRegLog,
    setIsModalVisible,
    setUserDetail,
    setHasToken,
  } = useContext(AppContext);

  const onFinish = async (values) => {
    const resultUser = await axios.get(
      `${API_CONFIG}login/cellphone?phone=${values.phone}&password=${values.password}`
    );
    localStorage.setItem("wyUserId", resultUser.data.account.id);
    const resultUserDetail = await axios.get(
      `${API_CONFIG}user/detail?uid=${resultUser.data.account.id}`
    );
    if (resultUser.data.msg === "密码错误") {
      message.warning(resultUser.data.msg);
    } else {
      message.success("登录成功");
      setUserDetail(resultUserDetail.data);
      setHasToken(true);
      setIsModalVisible(false);
    }
    if (values.remember) {
      localStorage.setItem("wyRememberLogin", JSON.stringify(codeJson(values)));
    } else {
      localStorage.removeItem("wyRememberLogin");
    }
  };

  //二维码登录
  const onKeyLogin = async () => {
    const resultKey = await axios.get(`${API_CONFIG}login/qr/key`);
    const key = resultKey.data.data.unikey;
    await axios.get(`${API_CONFIG}login/qr/create?key=${key}`);
    await axios.get(`${API_CONFIG}login/qr/check?key=${key}`);
  };

  const user = localStorage.getItem("wyRememberLogin");
  const User = user
    ? codeJson(JSON.parse(user), "decode")
    : { phone: "", password: "", remember: false };

  const [form] = Form.useForm();

  useUpdateEffect(() => {
    form.setFieldsValue({
      phone: User.phone,
      password: User.password,
      remember: User.remember,
    });
  }, [User]);

  return (
    <Fragment>
      <div className="login-modal-wrap">
        <Form
          form={form}
          id="loginForm"
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            style={{
              marginTop: "-50px",
              marginLeft: "-100px",
            }}
          >
            <a onClick={() => onKeyLogin()}>扫码登录</a>
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
          <label>密码</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <Form.Item style={{ float: "right", marginBottom: "0" }}>
              <a onClick={() => setChangeRegLog({ type: "注册页" })}>
                没有账号？免费注册
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
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Fragment>
  );
}
