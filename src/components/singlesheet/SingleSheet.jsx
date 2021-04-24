import "./singleSheet.css";
import { Fragment, useContext } from "react";
import axios from "axios";
import { API_CONFIG } from "../../utils/config";
import { AppContext } from "../../store/Store";
import { Link } from "react-router-dom";
import { useTitle, useUpdateEffect } from "ahooks";

export default function SingleSheet() {
  const {
    sheet,
    setPlayList,
    ready,
    setReady,
    playState,
    setPlayState,
    setPlayMode,
    setCurrentIdx,
    setCurrentSongId,
    currentSong,
    setCurrentSong,
  } = useContext(AppContext);

  const getTracks = async (id) => {
    if (!ready || !playState) {
      setReady({ type: "开始" });
      setPlayState({ type: "播放" });
    }
    setPlayMode({ type: "loop" });
    const resultTracks = await axios.get(
      `${API_CONFIG}playlist/detail?id=${id.toString()}`
    );
    setPlayList(resultTracks.data.playlist.tracks);
    setCurrentIdx(0);
    setCurrentSongId(resultTracks.data.playlist.tracks[0].id);
    setCurrentSong(resultTracks.data.playlist.tracks[0]);
  };

  useTitle(currentSong.name ? currentSong.name : "react-hooks打造网易云pc端");

  return (
    <Fragment>
      {sheet.map((item, idx) => {
        return (
          <div key={idx} className="sheet-item">
            <div className="sheet-cover">
              <Link to={`/sheetInfo/${item.id}`}>
                <img
                  src={item.picUrl}
                  alt={item.name}
                  width={140}
                  height={140}
                />
              </Link>
              <div className="sheet-bottom">
                <div className="sheet-num">
                  <i className="sheet-icon-headset"></i>
                  <span className="sheet-span">{`${(
                    item.playCount / 10000
                  ).toFixed(0)}万`}</span>
                </div>
                <i
                  className="sheet-icon-play"
                  onClick={() => getTracks(item.id)}
                ></i>
              </div>
            </div>
            <span className="sheet-dec">{item.name}</span>
          </div>
        );
      })}
    </Fragment>
  );
}
