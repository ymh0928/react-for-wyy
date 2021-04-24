import "./home.css";
import Main from "../../components/main/Main";
import WyPlayer from "../../components/player/Player";
import SheetList from "../sheetlist/SheetList";
import SheetInfo from "../sheetinfo/SheetInfo";
import SongInfo from "../songinfo/SongInfo";
import SingerDetail from "../singerdetail/SingerDetail";
import WySearch from "../../components/search/Search";
import { codeJson } from "../../utils/base64";

import { Layout, Menu, Input, BackTop, Avatar, message, Form } from "antd";
import { MobileOutlined, UserAddOutlined } from "@ant-design/icons";
import { Fragment, useContext, useRef } from "react";
import { useClickAway, useMount } from "ahooks";
import { Switch, Redirect, Route, NavLink } from "react-router-dom";
import { API_CONFIG } from "../../utils/config";
import axios from "axios";
import { AppContext } from "../../store/Store";

const { Header, Footer, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function Home() {
  const {
    setSearchResult,
    showSearchPanel,
    setShowSearchPanel,
    setChangeRegLog,
    setIsModalVisible,
    userDetail,
    // setUserDetail,
    hasToken,
    setHasToken,
  } = useContext(AppContext);

  let timer = null;
  const onInput = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (e.target.value !== "") {
        setShowSearchPanel(true);
        const fetchData = async () => {
          const resultSearch = await axios.get(
            `${API_CONFIG}search/suggest?keywords=${e.target.value}}`
          );
          setSearchResult(resultSearch.data.result);
        };
        fetchData();
      }
    }, 300);
  };

  const onFocus = () => {
    setShowSearchPanel(true);
  };

  const searchRef = useRef();
  useClickAway(() => {
    setShowSearchPanel(false);
  }, [searchRef]);

  const phoneLogin = () => {
    setIsModalVisible(true);
    setChangeRegLog({ type: "登录页" });
  };

  const phoneRegister = () => {
    setIsModalVisible(true);
    setChangeRegLog({ type: "注册页" });
  };

  const logout = async () => {
    const result = await axios.get(`${API_CONFIG}logout`);
    if (result.statusText === "OK") {
      setHasToken(false);
    }
    message.success("退出成功");
  };

  const style = {
    height: 40,
    width: 40,
    lineHeight: "40px",
    borderRadius: 4,
    backgroundColor: "#1088e9",
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  };

  return (
    <Fragment>
      <Layout>
        <Header>
          <div className="home-wrap">
            <div className="home-left">
              <h1 className="home-h1">Music</h1>
              <Menu
                theme="dark"
                mode="horizontal"
                style={{ height: "64px", lineHeight: "64px" }}
              >
                <Menu.Item>
                  <NavLink to="/home">发现</NavLink>
                </Menu.Item>
                <Menu.Item>
                  <NavLink to="/sheet">歌单</NavLink>
                </Menu.Item>
              </Menu>
            </div>
            <div className="home-right" style={{ position: "relative" }}>
              <div className="home-search" ref={searchRef}>
                <Search
                  placeholder="歌单/歌手/歌曲"
                  style={{
                    width: "202.5px",
                    marginTop: "16px",
                  }}
                  onInput={(e) => onInput(e)}
                  onFocus={() => onFocus()}
                />
              </div>
              {showSearchPanel ? (
                <div style={{ position: "absolute", zIndex: 1, top: 73 }}>
                  <WySearch />
                </div>
              ) : null}

              <div className="home-member">
                {hasToken ? (
                  <Menu theme="dark" mode="horizontal">
                    <SubMenu
                      icon={<Avatar src={userDetail.profile?.avatarUrl} />}
                    >
                      <Menu.Item>我的主页</Menu.Item>
                      <Menu.Item onClick={() => logout()}>退出</Menu.Item>
                    </SubMenu>
                  </Menu>
                ) : (
                  <Menu theme="dark" mode="horizontal">
                    <SubMenu title="登录∨">
                      <Menu.Item
                        icon={<MobileOutlined />}
                        onClick={() => phoneLogin()}
                      >
                        手机登录
                      </Menu.Item>
                      <Menu.Item
                        icon={<UserAddOutlined />}
                        onClick={() => phoneRegister()}
                      >
                        注册
                      </Menu.Item>
                    </SubMenu>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ backgroundColor: "#f2f2f2" }}>
          <Switch>
            <Route path="/home" component={Main} />
            <Route path="/sheet" component={SheetList} />
            <Route path="/sheetInfo/:id" component={SheetInfo} />
            <Route path="/songInfo/:id" component={SongInfo} />
            <Route path="/singer/:id" component={SingerDetail} />
            <Redirect to={"/home"} />
          </Switch>
        </Content>
        <Footer className="home-footer">
          Ant Design ©2021 Implement By React
        </Footer>
      </Layout>
      <BackTop>
        <div style={style}>UP</div>
      </BackTop>
      <WyPlayer />
    </Fragment>
  );
}

// remember:做完全自动登录
// useMount(async () => {
//   const user = localStorage.getItem("wyRememberLogin");
//   if (user) {
//     const User = codeJson(JSON.parse(user), "decode");
//     // const resultUser = await axios.get(
//     //   `${API_CONFIG}login/cellphone?phone=${User.phone}&password=${User.password}`
//     // );
//     // localStorage.setItem("wyUserId", resultUser.data.account?.id);
//     // const resultUserDetail = await axios.get(
//     //   `${API_CONFIG}user/detail?uid=${resultUser.data.account?.id}`
//     // );
//     // if (resultUser.data.msg === "密码错误") {
//     //   message.warning(resultUser.data.msg);
//     // } else {
//     //   message.success("登录成功");
//     //   setUserDetail(resultUserDetail.data);
//     //   setHasToken(true);
//     //   setIsModalVisible(false);
//     // }
//   }
// });
