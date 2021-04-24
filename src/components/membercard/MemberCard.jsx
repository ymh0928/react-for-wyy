import "./memberCard.css";
import RegLogModal from "../reglogmodal/RegLogModal";
import { Fragment, useContext } from "react";
import { Button } from "antd";
import { AppContext } from "../../store/Store";

export default function MemberCard() {
  const { setIsModalVisible, hasToken, userDetail } = useContext(AppContext);

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <Fragment>
      {hasToken ? (
        <Fragment>
          <div className="card-n-myinfo">
            <div className="card-f-cb card-clearfix">
              <div className="card-head">
                <img
                  src={userDetail.profile?.avatarUrl}
                  alt={userDetail.profile?.nickname}
                />
              </div>
              <div className="card-info">
                <h4>
                  <a className="card-nm card-ellipsis">
                    {userDetail.profile?.nickname}
                  </a>
                </h4>
                <p className="card-lv">
                  <span className="card-u-lv card-u-icn2">
                    {userDetail.level}
                    <i className="card-lvright card-u-icn2"></i>
                  </span>
                </p>
                <div className="card-btnwrap card-f-pr">
                  <Button type="primary">签到</Button>
                </div>
              </div>
            </div>
            <ul className="card-dny card-clearfix">
              <li className="card-li card-fst">
                <strong className="card-strong card-ellipsis">
                  {userDetail.profile?.eventCount}
                </strong>
                <span className="card-span">动态</span>
              </li>
              <li className="card-li">
                <strong className="card-strong card-ellipsis">
                  {userDetail.profile?.follows}
                </strong>
                <span className="card-span">关注</span>
              </li>
              <li className="card-li card-lst">
                <strong className="card-strong card-ellipsis">
                  {userDetail.profile?.followeds}
                </strong>
                <span className="card-span">粉丝数</span>
              </li>
            </ul>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="card-login">
            <p className="card-p">
              登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机
            </p>
            <button className="card-btn" onClick={showModal}>
              用户登录
            </button>
          </div>
          <RegLogModal />
        </Fragment>
      )}
    </Fragment>
  );
}
