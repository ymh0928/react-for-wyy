import "./sheetInfo.css";
import { Fragment, useContext, useState } from "react";
import { Button, Tag, Table, message } from "antd";
import {
  PlayCircleOutlined,
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  FolderAddOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../store/Store";
import axios from "axios";
import { API_CONFIG } from "../../utils/config";
import { timestampToTime, transformTime } from "../../utils/utilFunc";
import { WyLyric } from "../../utils/wyLyric";
import { Link } from "react-router-dom";
import { useMount } from "ahooks";

const { Column } = Table;

export default function SheetInfo(props) {
  const [showExpand, setShowExpand] = useState(false);
  const {
    playList,
    setPlayList,
    setSongUrl,
    setCurrentIdx,
    setCurrentSongId,
    setCurrentSong,
    setCurrentLyric,
    setCurrentLineNum,
    sheetDetail,
    setSheetDetail,
    ready,
    setReady,
    playState,
    setPlayState,
    setPlayMode,
  } = useContext(AppContext);
  //歌单id
  const { id } = props.match.params;

  //封装播放单首歌曲的函数
  const songPlay = async (item, playlist) => {
    const index = playlist.indexOf(item);
    setCurrentIdx(index);
    setCurrentSongId(playlist[index].id);
    setCurrentSong(playlist[index]);
    const currentId = playlist[index].id;
    const resultUrl = await axios.get(`${API_CONFIG}song/url?id=${currentId}`);
    try {
      setSongUrl(resultUrl.data.data[0].url);
    } catch (error) {
      message.warning("对不起，这首歌没有播放链接");
    }
    const resultLyric = await axios.get(`${API_CONFIG}lyric?id=${currentId}`);
    try {
      const res = {
        lyric: resultLyric.data.lrc.lyric,
        tlyric: resultLyric.data.tlyric.lyric,
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setCurrentLyric(lyricLines);
      const handleLyric = () => {
        lyric.handler.subscribe(({ lineNum }) => {
          setCurrentLineNum(lineNum);
        });
      };
      handleLyric();
    } catch (err) {
      const res = {
        lyric: "",
        tlyric: "",
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setCurrentLyric(lyricLines);
      const handleLyric = () => {
        lyric.handler.subscribe(({ lineNum }) => {
          setCurrentLineNum(lineNum);
        });
      };
      handleLyric();
    }
  };

  //播放单首歌曲
  const onPlayClick = async (item) => {
    if (!ready || !playState) {
      setReady({ type: "开始" });
      setPlayState({ type: "播放" });
    }
    const playlist = playList.slice();
    if (playlist.indexOf(item) === -1) {
      playlist.push(item);
      setPlayList(playlist);
      songPlay(item, playlist);
    } else if (playlist.indexOf(item) > -1) {
      songPlay(item, playlist);
    }
  };

  //封装播放歌单的函数
  const songListPlay = async () => {
    setPlayMode({ type: "loop" });
    setPlayList(sheetDetail.tracks);
    setCurrentIdx(0);
    setCurrentSongId(sheetDetail.tracks[0].id);
    setCurrentSong(sheetDetail.tracks[0]);
    const currentId = sheetDetail.tracks[0].id;
    const resultUrl = await axios.get(`${API_CONFIG}song/url?id=${currentId}`);
    try {
      setSongUrl(resultUrl.data.data[0].url);
    } catch (error) {
      message.warning("对不起，这首歌没有播放链接");
    }
    const resultLyric = await axios.get(`${API_CONFIG}lyric?id=${currentId}`);
    try {
      const res = {
        lyric: resultLyric.data.lrc.lyric,
        tlyric: resultLyric.data.tlyric.lyric,
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setCurrentLyric(lyricLines);
      const handleLyric = () => {
        lyric.handler.subscribe(({ lineNum }) => {
          setCurrentLineNum(lineNum);
        });
      };
      handleLyric();
    } catch (err) {
      const res = {
        lyric: "",
        tlyric: "",
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setCurrentLyric(lyricLines);
      const handleLyric = () => {
        lyric.handler.subscribe(({ lineNum }) => {
          setCurrentLineNum(lineNum);
        });
      };
      handleLyric();
    }
  };

  //播放歌单
  const onSongListPlay = () => {
    if (!ready) {
      setReady({ type: "开始" });
      setPlayState({ type: "播放" });
      songListPlay();
    } else {
      songListPlay();
    }
  };

  //添加歌曲
  const onPlusClick = async (item) => {
    if (!ready) {
      setReady({ type: "开始" });
    }
    setPlayMode({ type: "loop" });
    const playlist = playList.slice();
    if (playlist.indexOf(item) === -1) {
      playlist.push(item);
      setPlayList(playlist);
    } else {
      message.warning("您的歌单中已经有这首歌啦");
    }
  };

  const data = [];
  sheetDetail.tracks?.forEach((item, idx) => {
    data.push({
      key: idx,
      playIcon: (
        <div>
          <span>{idx + 1}</span>
          <PlayCircleOutlined
            className=""
            onClick={() => onPlayClick(item)}
            style={{ marginLeft: "10px" }}
          />
        </div>
      ),
      title: (
        <Fragment>
          <Link to={`/songInfo/${item.id}`} style={{ color: "#1890ff" }}>
            {item.name}
          </Link>
        </Fragment>
      ),
      time: transformTime(item.dt / 1000),
      singer: (
        <Fragment>
          <a>{item.ar[0].name}</a>
        </Fragment>
      ),
      album: item.al.name,
      icons: (
        <Fragment>
          <span
            className="info-icons-span"
            title="添加"
            onClick={() => onPlusClick(item)}
          >
            <PlusOutlined />
          </span>
          <span className="info-icons-span" title="收藏">
            <FolderAddOutlined />
          </span>
          <span className="info-icons-span" title="分享">
            <ShareAltOutlined />
          </span>
        </Fragment>
      ),
    });
  });

  const onExpand = () => {
    setShowExpand(!showExpand);
  };

  useMount(async () => {
    const resultDetail = await axios.get(
      `${API_CONFIG}playlist/detail?id=${id.toString()}`
    );
    setSheetDetail(resultDetail.data.playlist);
  });

  return (
    <Fragment>
      <div className="info-wrap info-feature-wrap">
        <div className="info-g-wrap6">
          <div className="info-m-info info-clearfix">
            <div className="info-cover">
              <img
                src={sheetDetail.coverImgUrl}
                alt={sheetDetail.name}
                style={{ height: "100%" }}
              />
              <div className="info-mask"></div>
            </div>
            <div className="info-cnt">
              <div className="info-cntc">
                <div className="info-hd info-clearfix">
                  <i className="info-f-pr"></i>
                  <div className="info-tit">
                    <h2 className="info-f-ff2 info-f-brk">
                      {sheetDetail.name}
                    </h2>
                  </div>
                </div>
                <div className="info-user info-f-cb">
                  <a
                    className="info-face"
                    href={`//music.163.com/artist?id=${sheetDetail.userId}`}
                  >
                    <img
                      src={sheetDetail.creator?.avatarUrl}
                      alt={sheetDetail.nickname}
                      style={{ float: "left", width: "35px", height: "35px" }}
                    />
                  </a>
                  <span className="info-name">
                    <a
                      className="info-s-fc7"
                      href={`//music.163.com/artist?id=${sheetDetail.userId}`}
                    >
                      {sheetDetail.nickname}
                    </a>
                  </span>
                  <span className="info-time info-s-fc4">
                    {timestampToTime(sheetDetail.createTime)} 创建
                  </span>
                </div>
                <div className="info-btns">
                  <div className="info-btn">
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      className="info-play"
                      onClick={() => onSongListPlay()}
                    >
                      播放
                    </Button>
                  </div>
                  <Button className="info-btn info-like">
                    <span>收藏</span>({sheetDetail.subscribedCount})
                  </Button>
                  <Button className="info-btn info-share">
                    <span>分享</span>({sheetDetail.shareCount})
                  </Button>
                </div>
                <div className="info-tags info-clearfix">
                  <span className="info-span">标签</span>
                  <div className="info-tag-wrap">
                    {sheetDetail.tags?.map((item, idx) => {
                      return <Tag key={idx}>{item}</Tag>;
                    })}
                  </div>
                </div>
                {sheetDetail.description?.length < 99 ? (
                  <div className="info-intr info-f-brk">
                    <p>
                      <b>介绍：</b>
                      {sheetDetail.description}
                    </p>
                  </div>
                ) : (
                  <Fragment>
                    {showExpand ? (
                      <Fragment>
                        <div className="info-intr info-f-brk">
                          <p>
                            <b>介绍：</b>
                            {sheetDetail.description}
                          </p>
                        </div>
                        <div className="info-expand">
                          <span
                            className="info-span-2"
                            onClick={() => onExpand()}
                          >
                            收起
                          </span>
                          <UpOutlined />
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className="info-intr info-f-brk">
                          <p>
                            <b>介绍：</b>
                            {sheetDetail.description?.slice(0, 99) + "..."}
                          </p>
                        </div>
                        <div className="info-expand">
                          <span
                            className="info-span-2"
                            onClick={() => onExpand()}
                          >
                            展开
                          </span>
                          <DownOutlined />
                        </div>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </div>
            </div>
          </div>
          <div className="info-wy-sec">
            <div className="info-u-title info-wy-sec-wrap info-clearfix">
              <h3 className="info-wy-sec-tit info-h3">
                <span className="info-f-ff2">歌曲列表</span>
              </h3>
              <span className="info-sub info-s-fc3">
                {sheetDetail.tracks?.length} 首歌
              </span>
              <div className="info-more info-s-fc3">
                播放：
                <strong className="info-s-fc6 info-strong">
                  {sheetDetail.playCount} 次
                </strong>
              </div>
            </div>
            <Table
              dataSource={data}
              bordered={true}
              // pagination={{ position: ["bottomCenter"] }}
              pagination={false}
              id="currentSheetSong1"
            >
              <Column dataIndex="playIcon" width="80px" />
              <Column title="标题" dataIndex="title" />
              <Column title="时长" dataIndex="time" width="120px" />
              <Column title="歌手" dataIndex="singer" width="150px" />
              <Column title="专辑" dataIndex="album" />
              <Column dataIndex="icons" width="120px" />
            </Table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
