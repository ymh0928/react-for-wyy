import "./search.css";
import { Fragment, useContext } from "react";
import { AppContext } from "../../store/Store";
import { Link } from "react-router-dom";

export default function Search() {
  const { searchResult, setShowSearchPanel } = useContext(AppContext);

  const onMouseOver = () => {
    setShowSearchPanel(true);
  };

  return (
    <Fragment>
      {Object.getOwnPropertyNames(searchResult).length !== 0 ? (
        <div className="search-panel" onMouseOver={() => onMouseOver()}>
          <div className="search-list-wrap">
            <div className="search-list-item search-clearfix">
              <div className="search-hd">
                <i className="search-ico search-ico-song"></i>
                <span className="search-span">单曲</span>
              </div>
              <ul className="search-ul">
                {searchResult.songs?.map((item, idx) => {
                  return (
                    <li className="search-ellipsis search-li" key={idx}>
                      <Link to={`/songInfo/${item.id}`}>{item.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="search-list-item search-clearfix">
              <div className="search-hd">
                <i className="search-ico search-ico-singer"></i>
                <span className="search-span">歌手</span>
              </div>
              <ul className="search-ul">
                {searchResult.artists?.map((item, idx) => {
                  return (
                    <li className="search-ellipsis search-li" key={idx}>
                      <Link to={`/singer/${item.id}`}>{item.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="search-list-item search-clearfix">
              <div className="search-hd">
                <i className="search-ico search-ico-sheet"></i>
                <span className="search-span">歌单</span>
              </div>
              <ul className="search-ul">
                {searchResult.playlists?.map((item, idx) => {
                  return (
                    <li className="search-ellipsis search-li" key={idx}>
                      <Link to={`/sheetInfo/${item.id}`}>{item.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}
