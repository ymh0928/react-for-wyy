import "./songInfo.css";
import { Fragment, useContext, useState } from "react";
import { Button, message } from "antd";
import {
  PlayCircleOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../store/Store";
import { API_CONFIG } from "../../utils/config";
import { WyLyric } from "../../utils/wyLyric";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMount, useUpdateEffect, useTitle } from "ahooks";

export default function SongInfo(props) {
  const [toggleLyric, setToggleLyric] = useState(false);
  const { id } = props.match.params;
  const {
    playList,
    setPlayList,
    setSongUrl,
    setCurrentIdx,
    setCurrentSongId,
    currentSong,
    setCurrentSong,
    setCurrentLyric,
    setCurrentLineNum,
    songDetail,
    setSongDetail,
    ready,
    setReady,
    playState,
    setPlayState,
    setPlayMode,
    songLyric,
    setSongLyric,
  } = useContext(AppContext);

  const onPlusClick = () => {
    if (!ready) {
      setReady({ type: "开始" });
    }
    setPlayMode({ type: "loop" });
    const playlist = playList.slice();
    const nameArr = [];
    playlist.forEach((item) => {
      nameArr.push(item.name);
    });
    if (nameArr.indexOf(songDetail.name) === -1) {
      playlist.push(songDetail);
      setPlayList(playlist);
    } else {
      message.warning("您的歌单中已经有这首歌啦");
    }
  };

  const playClick = async (playlist, songdetail, currentsongid) => {
    const index = playlist.indexOf(songdetail);
    setCurrentIdx(index);
    setCurrentSongId(currentsongid);
    setCurrentSong(playlist[index]);

    const resultUrl = await axios.get(`${API_CONFIG}song/url?id=${id}`);
    try {
      setSongUrl(resultUrl.data.data[0].url);
    } catch (error) {
      message.warning("对不起，这首歌没有播放链接");
    }
    const resultLyric = await axios.get(`${API_CONFIG}lyric?id=${id}`);
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

  const onPlayClick = async () => {
    if (!ready || !playState) {
      setReady({ type: "开始" });
      setPlayState({ type: "播放" });
    }
    setPlayMode({ type: "loop" });
    const playlist = playList.slice();
    const nameArr = [];
    playlist.forEach((item) => {
      nameArr.push(item.name);
    });
    if (nameArr.indexOf(songDetail.name) === -1) {
      playlist.push(songDetail);
      setPlayList(playlist);
      playClick(playlist, songDetail, songDetail.id);
    } else {
      playClick(nameArr, songDetail.name, songDetail.id);
    }
  };

  useMount(async () => {
    const resultSong = await axios.get(`${API_CONFIG}song/detail?ids=${id}`);
    setSongDetail(resultSong.data.songs[0]);
    const resultLyric = await axios.get(`${API_CONFIG}lyric?id=${id}`);
    try {
      const res = {
        lyric: resultLyric.data.lrc.lyric,
        tlyric: resultLyric.data.tlyric.lyric,
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setSongLyric(lyricLines);
    } catch (err) {
      const res = {
        lyric: "",
        tlyric: "",
      };
      const lyric = new WyLyric(res);
      const lyricLines = lyric.lines;
      setSongLyric(lyricLines);
    }
  });

  useUpdateEffect(() => {
    const content = document.querySelector("#song-content");
    if (toggleLyric) {
      content.className = "song-expand";
    } else {
      content.className = "song-lyric-content";
    }
  }, [toggleLyric]);

  const handleLyric = () => {
    setToggleLyric(!toggleLyric);
  };

  useTitle(currentSong.name ? currentSong.name : "react-hooks打造网易云pc端");

  return (
    <Fragment>
      <div className="song-wrap song-feature-wrap">
        <div className="song-g-wrap6">
          <div className="song-m-info song-clearfix">
            <div className="song-cover">
              <img
                src={songDetail.al?.picUrl}
                alt={
                  Object.getOwnPropertyNames(songDetail).length !== 0
                    ? songDetail.ar[0].name
                    : ""
                }
                style={{ height: "100%" }}
              />
              <div className="song-mask"></div>
            </div>
            <div className="song-cnt">
              <div className="song-cntc">
                <div className="song-hd song-clearfix">
                  <i className="song-f-pr"></i>
                  <div className="song-tit">
                    <h2 className="song-f-ff2 song-f-brk">
                      {Object.getOwnPropertyNames(songDetail).length !== 0
                        ? songDetail.name
                        : ""}
                    </h2>
                  </div>
                </div>
                <div className="song-user song-f-cb">
                  <div className="song-singers song-clearfix">
                    <span className="song-span-1">歌手：</span>
                    <ul className="song-ul song-clearfix">
                      {songDetail ? (
                        <Link
                          to={`/singer/${
                            Object.getOwnPropertyNames(songDetail).length !== 0
                              ? songDetail.ar[0].id
                              : ""
                          }`}
                        >
                          {Object.getOwnPropertyNames(songDetail).length !== 0
                            ? songDetail.ar[0].name
                            : ""}
                        </Link>
                      ) : (
                        <a>
                          {Object.getOwnPropertyNames(songDetail).length !== 0
                            ? songDetail.ar[0].name
                            : ""}
                        </a>
                      )}
                    </ul>
                  </div>
                  <div className="song-al">
                    <span>所属专辑：</span>
                    <span className="song-al-name">{songDetail.al?.name}</span>
                  </div>
                </div>
                <div className="song-btns">
                  <div className="song-btn">
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      className="song-play"
                      onClick={() => onPlayClick()}
                    >
                      播放
                    </Button>
                    <Button
                      type="primary"
                      className="song-add"
                      onClick={() => onPlusClick()}
                    >
                      +
                    </Button>
                  </div>
                  <Button className="song-btn song-like">
                    <span>收藏</span>
                  </Button>
                  <Button className="song-btn song-share">
                    <span>分享</span>
                  </Button>
                </div>
                <div className="song-lyric-info song-f-brk">
                  <div className="song-lyric-content" id="song-content">
                    {Object.getOwnPropertyNames(songDetail).length !== 0
                      ? songLyric.map((item, idx) => {
                          return (
                            <div className="song-lyric-line" key={idx}>
                              <p className="song-p">{item.txt}</p>
                              <p className="song-p">{item.txtCn}</p>
                            </div>
                          );
                        })
                      : null}
                  </div>

                  {songLyric.length ? (
                    toggleLyric ? (
                      <Fragment>
                        <div
                          className="song-toggle-expand"
                          onClick={() => handleLyric()}
                        >
                          <span className="song-span-2">收起</span>
                          <UpOutlined />
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div
                          className="song-toggle-expand"
                          onClick={() => handleLyric()}
                        >
                          <span className="song-span-2">展开</span>
                          <DownOutlined />
                        </div>
                      </Fragment>
                    )
                  ) : (
                    <Fragment>
                      <div style={{ marginTop: "-305px" }}>
                        <span>本首歌曲为纯音乐，没有歌词</span>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
