import "./singerDetail.css";
import { Fragment, useContext } from "react";
import { Button, Table, message } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  FolderAddOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../store/Store";
import { Link } from "react-router-dom";
import { transformTime } from "../../utils/utilFunc";
import axios from "axios";
import { API_CONFIG } from "../../utils/config";
import { WyLyric } from "../../utils/wyLyric";
import { useMount, useTitle } from "ahooks";

const { Column } = Table;

export default function SingerDetail(props) {
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
    ready,
    setReady,
    playState,
    setPlayState,
    setPlayMode,
    singerDetail,
    setSingerDetail,
  } = useContext(AppContext);

  //封装播放单首歌曲的函数
  const songPlay = async (item, playlist) => {
    const index = playlist.indexOf(item);
    setCurrentIdx(index);
    setCurrentSongId(playlist[index].id);
    setCurrentSong(item);
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
  const onPlayClick = (item) => {
    if (!ready || !playState) {
      setReady({ type: "开始" });
      setPlayState({ type: "播放" });
    }
    setPlayMode({ type: "loop" });
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
    setPlayList(singerDetail.hotSongs);
    setCurrentIdx(0);
    setCurrentSongId(singerDetail.hotSongs[0].id);
    setCurrentSong(singerDetail.hotSongs[0]);
    const currentId = singerDetail.hotSongs[0].id;
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

  //添加单首歌曲
  const onPlusClick = (item) => {
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
  if (singerDetail) {
    singerDetail.hotSongs?.forEach((item, idx) => {
      data.push({
        key: idx,
        playIcon: (
          <div>
            <span>{idx + 1}</span>
            <PlayCircleOutlined
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
        album: item.al.name,
        icons: (
          <Fragment>
            <span
              className="singer-icons-span"
              title="添加"
              onClick={() => onPlusClick(item)}
            >
              <PlusOutlined />
            </span>
            <span className="singer-icons-span" title="收藏">
              <FolderAddOutlined />
            </span>
            <span className="singer-icons-span" title="分享">
              <ShareAltOutlined />
            </span>
          </Fragment>
        ),
      });
    });
  }

  useMount(async () => {
    const resultSinger = await axios.get(`${API_CONFIG}artists?id=${id}`);
    setSingerDetail(resultSinger.data);
  });

  useTitle(currentSong.name ? currentSong.name : "react-hooks打造网易云pc端");

  return (
    <Fragment>
      <div className="singer-wrap singer-feature-wrap singer-clearfix">
        <div className="singer-dt-left">
          <div className="singer-left-wrap">
            <div className="singer-n-artist">
              <div className="singer-names singer-clearfix">
                <h2 className="singer-ellipsis">{singerDetail.artist?.name}</h2>
                <h3 className="singer-ellipsis">
                  {singerDetail.artist?.alias.join(";")}
                </h3>
              </div>
              <div className="singer-cover-img">
                <img
                  src={singerDetail.artist?.picUrl}
                  alt={singerDetail.artist?.name}
                  className="singer-full-height"
                />
              </div>
              <button className="singer-btn-1 singer-btn-like"></button>
            </div>
            <div className="singer-top-50">
              <div className="singer-btns singer-clearfix">
                <div className="singer-btn-2">
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    className="singer-play"
                    onClick={() => onSongListPlay()}
                  >
                    播放
                  </Button>
                </div>
                <Button className="singer-btn singer-like">
                  <span>收藏</span>({singerDetail.hotSongs?.length})
                </Button>
              </div>
              <Table
                dataSource={data}
                bordered={true}
                // pagination={{ position: ["bottomCenter"] }}
                pagination={false}
                id="currentSheetSong2"
              >
                <Column dataIndex="playIcon" width="80px" />
                <Column title="标题" dataIndex="title" />
                <Column title="时长" dataIndex="time" width="120px" />
                <Column title="专辑" dataIndex="album" />
                <Column dataIndex="icons" width="120px" />
              </Table>
            </div>
          </div>
        </div>
        <div className="singer-dt-right">
          <div className="singer-right-wrap">
            <h3 className="singer-h3">相似歌手</h3>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
