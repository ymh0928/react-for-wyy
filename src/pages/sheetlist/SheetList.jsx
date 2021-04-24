import "./sheetList.css";
import { Fragment, useContext } from "react";
import { Radio, Pagination } from "antd";
import axios from "axios";
import { API_CONFIG } from "../../utils/config";
import { AppContext } from "../../store/Store";
import { Link } from "react-router-dom";
import { useMount, useUpdateEffect, useTitle } from "ahooks";
import useUrlState from "@ahooksjs/use-url-state";

export default function SheetList() {
  const {
    setPlayList,
    setCurrentIdx,
    setCurrentSongId,
    currentSong,
    setCurrentSong,
    sheets,
    setSheets,
    radioValue,
    setRadioValue,
    currentPage,
    setCurrentPage,
    ready,
    setReady,
    playState,
    setPlayState,
    setPlayMode,
    cat,
  } = useContext(AppContext);

  const onChange = async (e) => {
    setRadioValue(e.target.value);
    if (e.target.value === "hot") {
      const resultSheets = await axios.get(
        `${API_CONFIG}top/playlist?cat=${cat}&order=${e.target.value}&offset=1&limit=35`
      );
      setSheets(resultSheets.data);
    } else if (e.target.value === "new") {
      const resultSheets = await axios.get(
        `${API_CONFIG}top/playlist?cat=${cat}&order=${e.target.value}&offset=1&limit=35`
      );
      setSheets(resultSheets.data);
    }
  };

  const changePage = async (page) => {
    setCurrentPage(page);
    const resultSheets = await axios.get(
      `${API_CONFIG}top/playlist?cat=${cat}&order=${radioValue}&offset=${page}&limit=35`
    );
    setSheets(resultSheets.data);
  };

  const getTracks = async (id) => {
    if (!ready || !playState) {
      setReady({ type: "true" });
      setPlayState({ type: "true" });
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

  const [catQuery] = useUrlState({ cat: cat });

  useMount(async () => {
    const resultSheets = await axios.get(
      `${API_CONFIG}top/playlist?cat=${
        catQuery.cat ? catQuery.cat : "全部"
      }&order=${radioValue}&offset=1&limit=35`
    );
    setSheets(resultSheets.data);
  });

  useUpdateEffect(async () => {
    const resultSheets = await axios.get(
      `${API_CONFIG}top/playlist?cat=${cat}&order=${radioValue}&offset=1&limit=35`
    );
    setSheets(resultSheets.data);
  }, [cat, radioValue]);

  useTitle(currentSong.name ? currentSong.name : "react-hooks打造网易云pc端");

  return (
    <Fragment>
      <div className="sheetList-wrap sheetList-feature-wrap">
        <div className="sheetList-list-r">
          <div className="sheetList-top">
            <div className="sheetList-cat">
              <span className="sheetList-span-1">
                {cat ? cat : catQuery.cat ? catQuery.cat : "全部"}
              </span>
            </div>
            <Radio.Group
              buttonStyle="solid"
              onChange={onChange}
              value={radioValue}
            >
              <Radio.Button value="hot">热门</Radio.Button>
              <Radio.Button value="new">最新</Radio.Button>
            </Radio.Group>
          </div>
          <div className="sheetList-list">
            {sheets && sheets.playlists
              ? sheets.playlists.map((item, idx) => {
                  return (
                    <div key={idx} className="sheetList-item">
                      <div className="sheetList-cover">
                        <Link to={`/sheetInfo/${item.id}`}>
                          <img
                            src={item.coverImgUrl}
                            alt={item.name}
                            width={140}
                            height={140}
                          />
                        </Link>

                        <div className="sheetList-bottom">
                          <div className="sheetList-num">
                            <i className="sheetList-icon-headset"></i>
                            <span className="sheetList-span-2">
                              {item.playCount > 10000
                                ? `${(item.playCount / 10000).toFixed(0)}万`
                                : item.playCount}
                            </span>
                          </div>
                          <i
                            className="sheetList-icon-play"
                            onClick={() => getTracks(item.id)}
                          ></i>
                        </div>
                      </div>
                      <span className="sheetList-dec">{item.name}</span>
                    </div>
                  );
                })
              : null}
          </div>
          <Pagination
            current={currentPage}
            pageSize={35}
            total={sheets.total}
            showSizeChanger={false}
            onChange={changePage}
            style={{ textAlign: "center" }}
            hideOnSinglePage
          />
        </div>
      </div>
    </Fragment>
  );
}
