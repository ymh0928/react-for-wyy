import { createContext, useState, useReducer } from "react";
import { useMount, useSetState } from "ahooks";
import { API_CONFIG } from "../utils/config";
import axios from "axios";
const AppContext = createContext({
  banner: [], //首页的走马灯
  setBanners: () => {},
  tag: [], //首页热门推荐的标签
  setTags: () => {},
  artist: [], //首页入驻歌手
  setArtist: () => {},
  sheet: [], //首页的16个推荐歌单
  setSheet: () => {},
  playList: [], //首页单个歌单的全部歌曲
  setPlayList: () => {},
  currentIdx: -1, //歌曲在playlist中的索引
  setCurrentIdx: () => {},
  songUrl: "",
  setSongUrl: () => {},
  currentSongId: 0,
  setCurrentSongId: () => {},
  currentSong: {},
  setCurrentSong: () => {},
  currentTime: 0,
  setCurrentTime: () => {},
  currentPercent: 0,
  setCurrentPercent: () => {},
  volume: 60,
  setVolume: () => {},
  currentLyric: [],
  setCurrentLyric: () => {},
  currentLineNum: -1,
  setCurrentLineNum: () => {},
  showPanel: false,
  setShowPanel: () => {},
  sheets: {},
  setSheets: () => {},
  radioValue: "hot",
  setRadioValue: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  cat: "",
  setCat: () => {},
  sheetDetail: {},
  setSheetDetail: () => {},
  songDetail: {},
  setSongDetail: () => {},
  singerDetail: {},
  setSingerDetail: () => {},
  showSearchPanel: false,
  setShowSearchPanel: () => {},
  searchResult: {},
  setSearchResult: () => {},
  userDetail: {},
  setUserDetail: () => {},
  isModalVisible: false,
  setIsModalVisible: () => {},
  songLyric: [],
  setSongLyric: () => {},
  hasToken: false,
  setHasToken: () => {},
});

export default function Store(props) {
  const [banner, setBanner] = useState([]);
  const [tag, setTag] = useState([]);
  const [artist, setArtist] = useState([]);
  const [sheet, setSheet] = useState([]);

  const [playList, setPlayList] = useState([]);

  const [currentIdx, setCurrentIdx] = useState(-1);
  const [songUrl, setSongUrl] = useState("");
  const [currentSongId, setCurrentSongId] = useState(0);
  const [currentSong, setCurrentSong] = useSetState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [volume, setVolume] = useState(60);
  const [currentLyric, setCurrentLyric] = useState([]);
  const [currentLineNum, setCurrentLineNum] = useState(-1);
  const [showPanel, setShowPanel] = useState(false);

  const [sheets, setSheets] = useSetState({});
  const [radioValue, setRadioValue] = useState("hot");
  const [currentPage, setCurrentPage] = useState(1);
  const [cat, setCat] = useState("");

  const [sheetDetail, setSheetDetail] = useSetState({});
  const [songDetail, setSongDetail] = useSetState({});
  const [singerDetail, setSingerDetail] = useSetState({});

  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchResult, setSearchResult] = useSetState({});

  const [userDetail, setUserDetail] = useSetState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [songLyric, setSongLyric] = useState([]);

  const [hasToken, setHasToken] = useState(false);

  const [ready, setReady] = useReducer((state, action) => {
    switch (action.type) {
      case "停止":
        return false;
      case "开始":
        return true;
      default:
        return state;
    }
  }, false);

  const [playState, setPlayState] = useReducer((state, action) => {
    switch (action.type) {
      case "暂停":
        return false;
      case "播放":
        return true;
      default:
        return state;
    }
  }, false);

  const [playMode, setPlayMode] = useReducer((state, action) => {
    switch (action.type) {
      case "loop":
        return "loop";
      case "random":
        return "random";
      case "singleLoop":
        return "singleLoop";
      default:
        return state;
    }
  }, "loop");

  const [changeRegLog, setChangeRegLog] = useReducer((state, action) => {
    switch (action.type) {
      case "默认页":
        return "default";
      case "注册页":
        return "register";
      case "登录页":
        return "login";
      default:
        return state;
    }
  }, "default");

  useMount(async () => {
    const resultBanner = await axios.get(`${API_CONFIG}banner`);
    const resultTag = await axios.get(`${API_CONFIG}playlist/hot`);
    const resultArtist = await axios.get(`${API_CONFIG}artist/list`);
    const resultSheet = await axios.get(`${API_CONFIG}personalized?limit=16`);
    setBanner(resultBanner.data.banners);
    setTag(resultTag.data.tags);
    setArtist(resultArtist.data.artists);
    setSheet(resultSheet.data.result);
  });

  return (
    <AppContext.Provider
      value={{
        banner,
        tag,
        artist,
        sheet,
        playList,
        setPlayList,
        ready,
        setReady,
        playState,
        setPlayState,
        currentIdx,
        setCurrentIdx,
        songUrl,
        setSongUrl,
        currentSongId,
        setCurrentSongId,
        currentSong,
        setCurrentSong,
        currentTime,
        setCurrentTime,
        currentPercent,
        setCurrentPercent,
        volume,
        setVolume,
        currentLyric,
        setCurrentLyric,
        currentLineNum,
        setCurrentLineNum,
        playMode,
        setPlayMode,
        showPanel,
        setShowPanel,
        sheets,
        setSheets,
        radioValue,
        setRadioValue,
        currentPage,
        setCurrentPage,
        cat,
        setCat,
        sheetDetail,
        setSheetDetail,
        songDetail,
        setSongDetail,
        singerDetail,
        setSingerDetail,
        showSearchPanel,
        setShowSearchPanel,
        searchResult,
        setSearchResult,
        userDetail,
        setUserDetail,
        changeRegLog,
        setChangeRegLog,
        isModalVisible,
        setIsModalVisible,
        songLyric,
        setSongLyric,
        hasToken,
        setHasToken,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext };
