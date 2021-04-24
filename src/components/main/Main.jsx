import "./main.css";
import Carousel from "../carousel/Carousel";
import SingleSheet from "../singlesheet/SingleSheet";
import MemberCard from "../membercard/MemberCard";
import { Fragment, useContext } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { AppContext } from "../../store/Store";
import { API_CONFIG } from "../../utils/config";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Main() {
  const {
    tag,
    artist,
    setSheets,
    radioValue,
    setCat,
    setSingerDetail,
  } = useContext(AppContext);

  const tagArr = tag.slice(0, 5);
  const artistArr = artist.slice(0, 9);

  const onClick = async (name) => {
    setCat(name);
    const resultSheets = await axios.get(
      `${API_CONFIG}top/playlist?cat=${name}&order=${radioValue}&offset=1&limit=35`
    );
    setSheets(resultSheets.data);
  };

  const getSingerDetail = async (item) => {
    const resultSinger = await axios.get(`${API_CONFIG}artists?id=${item.id}`);
    setSingerDetail(resultSinger.data);
  };

  return (
    <Fragment>
      <div className="carousel">
        <Carousel />
      </div>
      <div className="main-home">
        <div className="main-wrap">
          <div className="main-left">
            <div className="main-sec">
              <div className="main-up">
                <div className="main-navs">
                  <h2 className="main-h2">
                    <i className="main-i"></i>
                    <a className="main-h2-a">热门推荐</a>
                  </h2>
                  <nav className="main-nav">
                    {tagArr.map((item, idx) => {
                      return (
                        <Link
                          key={idx}
                          className="main-nav-a"
                          onClick={() => onClick(item.name)}
                          to={`/sheet?cat=${item.name}`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <a className="main-more-a">
                  更多 <ArrowRightOutlined />
                </a>
              </div>
              <div className="main-down">
                <SingleSheet />
              </div>
            </div>
          </div>
          <div className="main-right">
            <MemberCard />
            <div className="main-settled-singer">
              <div className="main-tit">
                <b className="main-tit-b">入驻歌手</b>
              </div>
              <div className="main-list">
                {artistArr.map((item, idx) => {
                  return (
                    <div className="main-card" key={idx}>
                      <Link
                        to={`/singer/${item.id}`}
                        onClick={() => getSingerDetail(item)}
                      >
                        <div>
                          <img
                            src={item.picUrl}
                            alt={item.name}
                            className="main-pic"
                          />
                        </div>
                        <div className="main-txt">
                          <b className="main-ellipsis">{item.name}</b>
                          <span className="main-span">
                            专辑数：{item.albumSize}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
