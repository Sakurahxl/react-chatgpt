import { useState, useEffect } from "react";
import styles from "./index.less";
import storage, { SearcHistory } from "@/utils/storage";
import { SearchBar } from "antd-mobile";
import {
  getHotwords,
  getSuggests,
  getSearchRecord,
  addSearchRecord,
  deleteSearchRecord,
} from "@/services/search";
import { Helmet } from "umi";
import Result from "./Result";
import { history } from "umi";

const Search = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [suggestList, setSuggestList] = useState<
    Array<{ name: string; value: string }>
  >([]);
  const [searchHistories, setSearchHistories] = useState<SearcHistory[]>([]);

  useEffect(() => {
    getHotwords().then((result: any) => {
      if (result.code === 0) {
        const words = result.list.map(
          (item: { keyword: string }) => item.keyword
        );
        setWords(words);
      }
    });

    setSearchHistories(storage.getSearchHistory());
    getSearchRecord().then((result: any) => {
      console.log(result);
    });
  }, []);

  const handleSetKeyword = async (keyword: string) => {
    if (keyword) {
      setSuggestList([]);
      setSearchValue(keyword);
      setKeyword(keyword);
      setSearchValue(keyword);
      storage.setSearchHistory({
        value: keyword,
        timestamp: new Date().getTime(),
      });
      await addSearchRecord(keyword);
    }
  };

  const handleClearSearch = () => {
    setSuggestList([]);
    setSearchValue("");
    setKeyword("");
    setSearchHistories(storage.getSearchHistory());
  };

  const handleClearSearchHistory = async () => {
    storage.clearSearchHistory();
    await deleteSearchRecord();
    setSearchHistories([]);
  };

  const handleGetSuggests = (value: string) => {
    const content = value;
    setSearchValue(value);
    if (content) {
      getSuggests(content).then((result: any) => {
        if (result.code === 0) {
          let suggestList = [];
          if (result.result.tag) {
            suggestList = result.result.tag.map(
              (item: { name: string; value: string }) => ({
                name: item.name,
                value: item.value,
              })
            );
          }
          setSuggestList(suggestList);
          setKeyword("");
        }
      });
    } else {
      setSuggestList([]);
      setKeyword("");
    }
  };

  const handleSetSearchContent = async (value: string) => {
    const content = value;
    if (content) {
      setSuggestList([]);
      setKeyword(content);
      storage.setSearchHistory({
        value: content,
        timestamp: new Date().getTime(),
      });
      await addSearchRecord(content);
    }
  };

  return (
    <div className={styles.search}>
      <Helmet>
        <title>搜索</title>
      </Helmet>
      {/* 搜索框 */}
      <div className={styles.searchTop}>
        <SearchBar
          placeholder="搜索视频、UP主或AV号"
          value={searchValue}
          showCancelButton={() => true}
          onCancel={() => history.push("/home")}
          onChange={(value) => handleGetSuggests(value)}
          onSearch={(value) => handleSetSearchContent(value)}
          onClear={() => handleClearSearch()}
        />
      </div>
      {!keyword ? (
        <div>
          <div className={styles.words}>
            <div className={styles.wordTitle}>大家都在搜</div>
            <div className={`${styles.wordWrapper} clear`}>
              {words.map((word, i) => (
                <div
                  className={styles.wordItem}
                  key={"word" + i}
                  onClick={() => handleSetKeyword(word)}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
          {suggestList.length > 0 ? (
            <div className={styles.suggest}>
              {suggestList.map((suggest, i) => (
                <div className={styles.suggestItem} key={"suggest" + i}>
                  <p
                    dangerouslySetInnerHTML={{ __html: suggest.name }}
                    onClick={() => handleSetKeyword(suggest.value)}
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className={styles.history}>
            <div className={styles.historyTitle}>历史搜索</div>
            <div className={styles.historyList}>
              {searchHistories.map((history, i) => (
                <div
                  className={styles.historyItem}
                  key={i}
                  onClick={() => handleSetKeyword(history.value)}
                >
                  <i className={styles.historyIco} />
                  <div className={styles.name}>{history.value}</div>
                </div>
              ))}
            </div>
            {searchHistories.length > 0 ? (
              <div
                className={styles.historyClear}
                onClick={handleClearSearchHistory}
              >
                清除历史记录
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={styles.searchResult}>
          <Result keyword={keyword} />
        </div>
      )}
    </div>
  );
};

export default Search;
