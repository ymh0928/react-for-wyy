import Register from "./register/Register";
import Login from "./login/Login";
import { Fragment, useContext } from "react";
import { Modal, Button } from "antd";
import { AppContext } from "../../store/Store";

export default function RegLogModal() {
  const {
    changeRegLog,
    setChangeRegLog,
    isModalVisible,
    setIsModalVisible,
  } = useContext(AppContext);

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Fragment>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        centered={true}
        closable={true}
        footer={null}
        width="530px"
        height="394.98px"
      >
        {changeRegLog === "default" ? (
          <div className="card-cnzt">
            <div className="card-select-log">
              <div className="card-mid-wrap">
                <div className="card-pic">
                  <img src="./platform.png" alt="wyy" />
                </div>
                <div className="card-methods">
                  <Button
                    type="primary"
                    style={{
                      display: "block",
                      marginTop: "10px",
                      width: "100%",
                      height: "40px",
                    }}
                    onClick={() => setChangeRegLog({ type: "登录页" })}
                  >
                    手机号登陆
                  </Button>
                  <Button
                    style={{
                      display: "block",
                      marginTop: "10px",
                      width: "100%",
                      height: "40px",
                    }}
                    onClick={() => setChangeRegLog({ type: "注册页" })}
                  >
                    注册
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : changeRegLog === "login" ? (
          <div>
            <Login />
          </div>
        ) : (
          <div>
            <Register />
          </div>
        )}
      </Modal>
    </Fragment>
  );
}
