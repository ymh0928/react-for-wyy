import "./player.css";
import Panel from "../panel/Panel";
import { transformTime, shuffle } from "../../utils/utilFunc";
import { WyLyric } from "../../utils/wyLyric";
import { Fragment, useContext, useRef } from "react";
import { useBoolean, useClickAway, useUpdateEffect } from "ahooks";
import { message, Slider } from "antd";
import { API_CONFIG } from "../../utils/config";
import axios from "axios";
import { AppContext } from "../../store/Store";
import { Link } from "react-router-dom";

export default function Player() {
  const {
    playList,
    setPlayList,
    ready,
    playState,
    setPlayState,
    currentIdx,
    songUrl,
    setSongUrl,
    setCurrentIdx,
    currentSongId,
    setCurrentSongId,
    setCurrentSong,
    currentTime,
    setCurrentTime,
    currentPercent,
    setCurrentPercent,
    volume,
    setVolume,
    setCurrentLyric,
    setCurrentLineNum,
    playMode,
    setPlayMode,
    showPanel,
    setShowPanel,
  } = useContext(AppContext);

  //得到audio的ref
  const radioRef = useRef();
  const onCanplay = () => {
    radioRef.current.play();
    setPlayState({ type: "播放" });
    radioRef.current.volume = volume / 100;
  };

  //audio的timeupdate事件
  const onTimeUpdate = () => {
    const duration = playList[currentIdx]?.dt / 1000;
    const currentPercent = (radioRef.current.currentTime / duration) * 100;
    setCurrentTime(radioRef.current.currentTime);
    setCurrentPercent(currentPercent);
  };

  //进度条改变时
  const onPercentChange = (newValue) => {
    radioRef.current.pause();
    const duration = playList[currentIdx].dt / 1000;
    const newPercent = newValue;
    const newCurrent = (duration * newValue) / 100;
    radioRef.current.currentTime = newCurrent;
    setCurrentTime(newCurrent);
    setCurrentPercent(newPercent);
  };

  //进度条改变后
  const onPercentAfterChange = () => {
    radioRef.current.play();
  };

  //单曲循环
  const loop = () => {
    radioRef.current.play();
  };

  //监听音量的变化
  const onVolumeChange = (newValue) => {
    if (radioRef.current) {
      radioRef.current.volume = newValue / 100;
      setVolume(newValue);
    }
    setVolume(newValue);
  };

  const [showVolume, { toggle, setFalse }] = useBoolean(false);

  const toggleVolPanel = () => {
    toggle();
  };

  const mainRef = useRef();
  useClickAway(() => {
    setFalse();
  }, [mainRef]);

  const scrollRef = document.querySelector("#scrollRef");

  const onPrevNext = async (index) => {
    setCurrentIdx(index);
    setCurrentSongId(playList[index].id);
    setCurrentSong(playList[index]);
    if (!playState) {
      setPlayState({ type: "true" });
    }
    setCurrentLyric([]);
    setCurrentLineNum(-1);
    const currentId = playList.map((item) => item.id)[index];
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

  //上一首歌
  const onPrev = () => {
    if (!ready) return;
    if (playList.length === 1) {
      loop();
    } else {
      if (currentIdx <= 0) {
        onPrevNext(playList.length - 1);
        scrollRef.scrollTo(0, 174);
      } else {
        onPrevNext(currentIdx - 1);
        scrollRef.scrollTop -= 42;
      }
    }
  };

  //下一首歌
  const onNext = () => {
    if (!ready) return;
    if (playList.length === 1) {
      loop();
    } else {
      if (currentIdx >= playList.length - 1) {
        onPrevNext(0);
        scrollRef.scrollTo(0, 0);
      } else {
        onPrevNext(currentIdx + 1);
        scrollRef.scrollTop += 42;
      }
    }
  };

  //当播放模式变为random时
  const onPlayModeChange = () => {
    setPlayMode({ type: "random" });
    setPlayList(shuffle(playList));
  };

  //改变播放模式时改变图标
  const checkMode = () => {
    if (playMode === "loop") {
      return "player-loop";
    } else if (playMode === "random") {
      return "player-random";
    } else {
      return "player-singleLoop";
    }
  };

  //改变播放模式时改变标题
  const checkTitle = () => {
    if (playMode === "loop") {
      return "列表播放";
    } else if (playMode === "random") {
      return "随机播放";
    } else {
      return "单曲循环";
    }
  };

  //播放结束
  const onEnded = () => {
    if (playMode === "singleLoop") {
      loop();
    } else {
      onNext();
    }
  };

  useUpdateEffect(async () => {
    if (playList.length && currentIdx !== -1) {
      if (ready) {
        if (playMode === "random") {
          const idArr = [];
          playList.forEach((item) => {
            idArr.push(item.id);
          });
          const currentindex = idArr.indexOf(currentSongId);
          setCurrentIdx(currentindex);
          const currentId = playList.map((item) => item.id)[currentindex];
          const resultUrl = await axios.get(
            `${API_CONFIG}song/url?id=${currentId}`
          );
          try {
            setSongUrl(resultUrl.data.data[0].url);
          } catch (error) {
            message.warning("对不起，这首歌没有播放链接");
          }
          const resultLyric = await axios.get(
            `${API_CONFIG}lyric?id=${currentId}`
          );
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
        } else {
          const currentId = playList.map((item) => item.id)[currentIdx];
          const resultUrl = await axios.get(
            `${API_CONFIG}song/url?id=${currentId}`
          );
          try {
            setSongUrl(resultUrl.data.data[0].url);
          } catch (error) {
            message.warning("对不起，这首歌没有播放链接");
          }
          const resultLyric = await axios.get(
            `${API_CONFIG}lyric?id=${currentId}`
          );
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
        }
        if (playState) {
          radioRef.current.play();
        } else {
          radioRef.current.pause();
        }
      }
    }
  }, [playList, ready, playState, currentIdx, playMode]);

  return (
    <Fragment>
      <div className="player-main" ref={mainRef}>
        <div className="player-lock">
          <div className="player-left">
            <i className="player-icon"></i>
          </div>
        </div>
        <div className="player-hand"></div>
        <div className="player-container">
          <div className="player-wrap">
            <div className="player-btns">
              <i className="player-prev" onClick={() => onPrev()}></i>
              {playList.length && currentIdx !== -1 ? (
                playState ? (
                  <i
                    className="player-toggle player-playing"
                    onClick={() => setPlayState({ type: "暂停" })}
                  ></i>
                ) : (
                  <i
                    className="player-toggle"
                    onClick={() => setPlayState({ type: "播放" })}
                  ></i>
                )
              ) : (
                <i className="player-toggle"></i>
              )}
              <i className="player-next" onClick={() => onNext()}></i>
            </div>
            <div className="player-head">
              <img
                src={
                  playList.length && currentIdx !== -1
                    ? playList[currentIdx].al.picUrl
                    : `//s4.music.126.net/style/web2/img/default/default_album.jpg`
                }
                alt={
                  playList.length && currentIdx !== -1
                    ? playList[currentIdx].ar[0].name
                    : "歌手图"
                }
                className="player-img"
              />
              {currentSongId !== 0 ? (
                <Link to={`/songInfo/${currentSongId}`}>
                  <i className="player-mask"></i>
                </Link>
              ) : (
                <i className="player-mask"></i>
              )}
            </div>
            <div className="player-play">
              <div
                className="player-words player-clearfix"
                style={{ width: "608px", height: "21px" }}
              >
                <p className="player-ellipsis player-margin-bottom-none player-p">
                  <Link to={`/songInfo/${currentSongId}`}>
                    {playList.length && currentIdx !== -1
                      ? playList[currentIdx].name
                      : ""}
                  </Link>
                </p>
                <ul className="player-songs player-clearfix player-margin-bottom-none">
                  <li className="player-li">
                    <Link
                      to={`/singer/${playList[currentIdx]?.ar[0].id}`}
                      className="player-a"
                    >
                      {playList.length && currentIdx !== -1
                        ? playList[currentIdx].ar[0].name
                        : ""}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="player-bar">
                <div className="player-slider-wrap">
                  <Slider
                    style={{ margin: "0", padding: "0" }}
                    tooltipVisible={false}
                    defaultValue={0}
                    value={currentPercent}
                    disabled={playList.length ? false : true}
                    onChange={onPercentChange}
                    onAfterChange={onPercentAfterChange}
                  />
                </div>
                <span className="player-time">
                  <em className="player-em">
                    {playList.length ? transformTime(currentTime) + " / " : ""}
                  </em>
                  {playList.length && currentIdx !== -1
                    ? transformTime(playList[currentIdx].dt / 1000)
                    : ""}
                </span>
              </div>
            </div>
            <div className="player-oper">
              <i className="player-like" title="收藏"></i>
              <i className="player-share" title="分享"></i>
            </div>
            <div className="player-ctrl">
              <i
                className="player-volume"
                title="音量"
                onClick={() => toggleVolPanel()}
              ></i>
              {playList.length && ready ? (
                playMode === "loop" ? (
                  <i
                    className={checkMode()}
                    title={checkTitle()}
                    onClick={() => onPlayModeChange()}
                  ></i>
                ) : playMode === "random" ? (
                  <i
                    className={checkMode()}
                    title={checkTitle()}
                    onClick={() => setPlayMode({ type: "singleLoop" })}
                  ></i>
                ) : (
                  <i
                    className={checkMode()}
                    title={checkTitle()}
                    onClick={() => setPlayMode({ type: "loop" })}
                  ></i>
                )
              ) : (
                <i className="player-loop" title="列表播放"></i>
              )}
              {playList.length ? (
                <p
                  className="player-open"
                  onClick={() => setShowPanel(!showPanel)}
                >
                  <span className="player-span"></span>
                </p>
              ) : (
                <p className="player-open">
                  <span className="player-span"></span>
                </p>
              )}

              <div
                className={showVolume ? "player-control-vol" : "player-hide"}
              >
                <Slider
                  style={{ margin: "0", padding: "0" }}
                  vertical
                  defaultValue={volume}
                  onChange={onVolumeChange}
                />
              </div>
            </div>
            <div className={showPanel ? "panel-main panel-show" : "panel-main"}>
              <Panel playList={playList} />
            </div>
          </div>
        </div>
        {playList.length && ready ? (
          <audio
            ref={radioRef}
            id="radioRef"
            src={songUrl}
            onCanPlay={() => onCanplay()}
            onTimeUpdate={() => onTimeUpdate()}
            onEnded={() => onEnded()}
          ></audio>
        ) : (
          <audio></audio>
        )}
      </div>
    </Fragment>
  );
}
