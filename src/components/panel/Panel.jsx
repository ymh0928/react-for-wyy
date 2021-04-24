import "./panel.css";
import { Popconfirm, message } from "antd";
import { useUpdateEffect } from "ahooks";
import { transformTime } from "../../utils/utilFunc";
import { WyLyric } from "../../utils/wyLyric";
import { API_CONFIG } from "../../utils/config";
import { Fragment, useContext, useRef } from "react";
import { AppContext } from "../../store/Store";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Panel(props) {
  const {
    setPlayList,
    setReady,
    playState,
    setPlayState,
    setSongUrl,
    currentIdx,
    setCurrentIdx,
    setCurrentSongId,
    setCurrentSong,
    currentTime,
    setCurrentTime,
    setCurrentPercent,
    currentLyric,
    setCurrentLyric,
    currentLineNum,
    setCurrentLineNum,
    setShowPanel,
  } = useContext(AppContext);

  const { playList } = props;

  const lyricRef = useRef();

  const onMouseEnterPanel = () => {
    window.removeEventListener("mousewheel", () => {});
  };

  const onSingerClick = async (item) => {
    if (!playState) {
      setPlayState({ type: "true" });
    }
    setCurrentLyric([]);
    setCurrentLineNum(-1);
    const currentId = item.id;
    const resultUrl = await axios.get(`${API_CONFIG}song/url?id=${currentId}`);
    try {
      setSongUrl(resultUrl.data.data[0].url);
    } catch (error) {
      message.warning("对不起，这首歌没有播放链接");
    }

    const index = playList.indexOf(item);
    setCurrentIdx(index);
    setCurrentSongId(playList[index].id);
    setCurrentSong(playList[index]);

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

  const onDeleteSong = (item, e) => {
    e.stopPropagation();
    setCurrentLyric([]);
    setCurrentLineNum(-1);
    const playlist = playList.slice();
    const index = playlist.indexOf(item);
    playlist.splice(index, 1);
    setPlayList(playlist);
    if (currentIdx > index) {
      setCurrentIdx(currentIdx - 1);
    } else if (currentIdx === index) {
      setCurrentIdx(index);
      setCurrentSongId(playlist[index]?.id);
      setCurrentSong(playlist[index]);
      if (currentIdx === playlist.length) {
        setCurrentIdx(index - 1);
        setCurrentSongId(playlist[index - 1]?.id);
        setCurrentSong(playlist[index - 1]);
      }
    }
    message.success("删除歌曲成功！！！");
    if (!playlist.length) {
      const radioRef = document.querySelector("#radioRef");
      radioRef.pause();
      setPlayList([]);
      setReady({ type: "停止" });
      setPlayState({ type: "暂停" });
      setCurrentIdx(-1);
      setSongUrl("");
      setCurrentSongId(0);
      setCurrentSong("");
      setCurrentTime(0);
      setCurrentPercent(0);
      setCurrentLyric([]);
      setCurrentLineNum(0);
      message.success("清空歌单成功！！！");
    }
    setShowPanel(false);
  };

  const onClearSong = (e) => {
    e.stopPropagation();
    const radioRef = document.querySelector("#radioRef");
    radioRef.pause();
    setPlayList([]);
    setReady({ type: "停止" });
    setPlayState({ type: "暂停" });
    setCurrentIdx(-1);
    setSongUrl("");
    setCurrentSongId(0);
    setCurrentSong("");
    setCurrentTime(0);
    setCurrentPercent(0);
    setCurrentLyric([]);
    setCurrentLineNum(0);
    message.success("清空歌单成功！！！");
    setShowPanel(false);
  };

  const onClose = () => {
    setShowPanel(false);
  };

  useUpdateEffect(() => {
    if (playList.length) {
      if (playState && currentLyric.length) {
        const play = () => {
          setCurrentLineNum(findCurNum(Math.floor(currentTime) * 1000));
        };
        const findCurNum = (time) => {
          const index = currentLyric.findIndex((item) => time <= item.time);
          return index === -1 ? currentLyric.length - 1 : index - 1;
        };
        play();
      }
      if (currentLyric.length && currentLineNum && currentLineNum !== -1) {
        lyricRef.current.children[0].children[currentLineNum].className =
          "panel-li-2 panel-li-2-current";
        const lyricRefArr = Array.from(lyricRef.current.children[0].children);
        const current = lyricRefArr.indexOf(
          lyricRef.current.children[0].children[currentLineNum]
        );
        lyricRefArr.splice(current, 1);
        lyricRefArr.forEach((item) => {
          item.className = "panel-li-2";
        });
        const lyricChildrenTop =
          lyricRef.current.children[0].children[currentLineNum].offsetTop;
        lyricRef.current.scrollTo(0, lyricChildrenTop - 96);
      }
    }
  }, [
    playList,
    playState,
    currentIdx,
    currentTime,
    currentLyric,
    currentLineNum,
  ]);

  return (
    <Fragment>
      <div className="panel-hd">
        <div className="panel-hdc">
          <h4 className="panel-h4">
            播放列表（<span>{playList.length ? playList.length : 0}</span>）
          </h4>
          <div className="panel-add-all">
            <i className="panel-icon" title="收藏全部"></i>
            收藏全部
          </div>
          <span className="panel-line"></span>
          <div className="panel-clear-all">
            {playList.length ? (
              <Popconfirm
                placement="topRight"
                title="确认删除吗？"
                onConfirm={(e) => onClearSong(e)}
                okText="是"
                cancelText="否"
              >
                <i className="panel-icon panel-trush" title="清空"></i>
                清空
              </Popconfirm>
            ) : (
              <Fragment>
                <i className="panel-icon panel-trush" title="清空"></i>
                清空
              </Fragment>
            )}
          </div>
          <p className="panel-playing-name"></p>
          <i className="panel-icon panel-close" onClick={() => onClose()}></i>
        </div>
      </div>

      <div className="panel-bd">
        <img
          src="//music.163.com/api/img/blur/109951163826278397"
          className="panel-imgbg"
          alt="背景图"
        />
        <div className="panel-msk"></div>
        <div
          className="panel-list-wrap"
          onMouseEnter={() => onMouseEnterPanel()}
          id="scrollRef"
        >
          <ul>
            {playList.length
              ? playList.map((song, id) => {
                  return (
                    <li
                      className="panel-li"
                      key={id}
                      onClick={() => onSingerClick(song)}
                    >
                      {playList.indexOf(song) === currentIdx ? (
                        <Fragment>
                          <i className="panel-col panel-arrow"></i>
                          <div className="panel-col panel-name panel-ellipsis">
                            {song.name}
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div
                            className="panel-col panel-name panel-ellipsis"
                            style={{ marginLeft: "30px" }}
                          >
                            <a>{song.name}</a>
                          </div>
                        </Fragment>
                      )}
                      <div className="panel-col panel-icons">
                        <i className="panel-ico panel-like" title="收藏"></i>
                        <i className="panel-ico panel-share" title="分享"></i>
                        <i
                          className="panel-ico panel-trush"
                          title="删除"
                          onClick={(e) => onDeleteSong(song, e)}
                        ></i>
                      </div>
                      <div className="panel-singers panel-clearfix panel-ellipsis">
                        <div className="panel-singer-item">
                          {song.ar.map((singer, id) => {
                            return (
                              <Link
                                to={`/singer/${singer.id}`}
                                className="panel-col panel-ellipsis"
                                key={id}
                                // onClick={(e) => toSinger(singer, e)}
                              >
                                {singer.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <div className="panel-col panel-duration">
                        {transformTime(song.dt / 1000)}
                      </div>
                      <div className="panel-col panel-link"></div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
        <div className="panel-list-lyric" ref={lyricRef} id="lyricRef">
          {playList.length ? (
            <ul>
              {currentLyric.map((lyric, id) => {
                return (
                  <li className="panel-li-2" key={id}>
                    {lyric.txt} <br /> {lyric.txtCn}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}
