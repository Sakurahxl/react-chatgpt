import React, { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import Header from "../components/Header";
import {
  List,
  Image,
  SearchBar,
  Modal,
  Badge,
  SearchBarRef,
  Dialog,
  SwipeAction,
  SwipeActionRef,
} from "antd-mobile";
import AddOutline from "antd-mobile-icons/es/AddOutline";
import ListTitle from "./components/ListTitle";
import { history } from "umi";
import {
  addContact,
  delContact,
  getContacts,
  searchContacts,
  updateStatus,
} from "@/services/message";
import {
  AddCircleOutline,
  CheckCircleOutline,
  ClockCircleOutline,
  CloseCircleOutline,
} from "antd-mobile-icons";
import { getLoginStatus } from "@/services/auth";

export interface Icontact {
  avatar: string;
  name: string;
  description: string;
  id: string;
  account: string;
  status: string;
  createTime?: string;
}

const MessageApp = () => {
  const [contacts, setContacts] = useState<Icontact[]>([]);
  const [searchList, setSearchList] = useState([]);
  const [sentList, setSentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const searchRef = useRef<SearchBarRef>(null);
  const timeRef = useRef<any>(null);
  const swipeActionRef = useRef<SwipeActionRef>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    searchRef.current?.clear();
    setSearchList([]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getContactsList();
    timeRef.current
      ? (timeRef.current = setInterval(() => {
          console.log("refresh");
          getContactsList();
        }, 1000 * 60 * 3))
      : clearInterval(timeRef.current); // 3 分钟刷新一次
  }, []);

  // 获取联系人列表
  const getContactsList = () => {
    getContacts().then((res) => {
      // console.log(res);
      const contactWithId: Icontact[] = [...res.confirmed, ...res.accepted].map(
        (item: Icontact, index: number) => {
          item.id = index + 1 + ""; // 使用数组索引作为 id，这里索引从 0 开始，所以加 1
          return item;
        }
      );
      setContacts(contactWithId);
      setSentList(res.sent);
    });
  };

  const searchContactsList = (value: string) => {
    setSearchList([]);
    searchContacts(value).then((res) => {
      res = res.filter(
        (item: { account: string }) => item.account !== getLoginStatus()
      ); // 过滤掉该账号
      const contactWithId = res.map((item: { id: string }, index: number) => {
        item.id = index + 1 + ""; // 使用数组索引作为 id，这里索引从 0 开始，所以加 1
        return item;
      });
      setSearchList(contactWithId);
    });
  };

  const toChatWindow = () => {
    history.push("/home/message/chatWindow");
  };

  // 发送添加请求
  const sendAddRequest = async (account: string) => {
    Dialog.confirm({
      content: "是否确认添加好友？",
      onConfirm: async () => {
        await addContact(account).then((res) => {
          if (res === "add successfully") {
            getContactsList();
            searchContactsList(searchValue);
          }
        });
      },
    });
  };

  // 检查状态
  const checkStatus = (list: any[], account: string, status: string) => {
    return list.some(
      (item) => item.account === account && item.status === status
    );
  };

  // 更新状态
  const changeStatus = (account: string, status: string) => {
    updateStatus(account, status).then((res) => {
      if (res === "update successfully") {
        getContactsList();
        searchContactsList(searchValue);
      }
    });
  };

  return (
    <div className={styles.message}>
      <div className={styles["top-wrapper"]}>
        <Header display={true} />
      </div>
      <List header={<ListTitle addContact={showModal} />}>
        {contacts.map((contact: Icontact) => {
          let isAccepted = contact.status === "accepted";
          return (
            <SwipeAction
              ref={swipeActionRef}
              key={contact.id}
              rightActions={
                isAccepted
                  ? [
                      {
                        key: "delete",
                        text: "删除",
                        color: "danger",
                        onClick: async () => {
                          await Dialog.confirm({
                            content: "确定要删除该联系人吗？",
                            onConfirm: async () => {
                              await delContact(contact.account).then((res) => {
                                if (res === "delete successfully") {
                                  getContactsList();
                                  searchContactsList(searchValue);
                                }
                              });
                            },
                          });
                          swipeActionRef.current?.close();
                        },
                      },
                    ]
                  : []
              }
            >
              <List.Item
                key={contact.id}
                onClick={isAccepted ? toChatWindow : () => {}}
                arrow={
                  isAccepted ? (
                    <Badge content="99+" />
                  ) : (
                    <div>
                      <CheckCircleOutline
                        color="#76c6b8"
                        onClick={() =>
                          changeStatus(contact.account, "accepted")
                        }
                      />
                      <CloseCircleOutline
                        color="var(--adm-color-danger)"
                        onClick={() =>
                          changeStatus(contact.account, "rejected")
                        }
                      />
                    </div>
                  )
                }
                prefix={
                  <Image
                    src={contact.avatar}
                    style={{ borderRadius: 20 }}
                    fit="cover"
                    width={40}
                    height={40}
                  />
                }
                description={
                  isAccepted ? contact.description : "是否确认添加好友？"
                }
              >
                {contact.name}
              </List.Item>
            </SwipeAction>
          );
        })}
      </List>
      <Modal
        visible={isModalOpen}
        header={
          <SearchBar
            value={searchValue}
            ref={searchRef}
            placeholder="请输入账号"
            onSearch={searchContactsList}
            onChange={(val) => {
              setsearchValue(val);
            }}
          />
        }
        title="搜索结果"
        content={
          <List>
            {searchList.map((contact: Icontact) => {
              let disabled = true;
              let icons;
              if (checkStatus(sentList, contact.account, "pending")) {
                icons = (
                  <div>
                    <ClockCircleOutline color="var(--adm-color-primary)" />
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--adm-color-primary)",
                      }}
                    >
                      添加中
                    </span>
                  </div>
                );
              } else if (checkStatus(contacts, contact.account, "accepted")) {
                icons = <CheckCircleOutline color="#76c6b8" />;
              } else if (checkStatus(contacts, contact.account, "pending")) {
                icons = (
                  <div>
                    <CheckCircleOutline
                      color="#76c6b8"
                      onClick={() => changeStatus(contact.account, "accepted")}
                    />
                    <CloseCircleOutline
                      color="var(--adm-color-danger)"
                      onClick={() => changeStatus(contact.account, "rejected")}
                    />
                  </div>
                );
                disabled = false;
              } else {
                icons = (
                  <AddCircleOutline
                    onClick={() => sendAddRequest(contact.account)}
                  />
                );
                disabled = false;
              }
              return (
                <List.Item
                  disabled={disabled}
                  key={contact.name}
                  prefix={
                    <Image
                      src={contact.avatar}
                      style={{ borderRadius: 20 }}
                      fit="cover"
                      width={40}
                      height={40}
                    />
                  }
                  arrow={icons}
                  description={contact.description}
                >
                  {contact.name}
                </List.Item>
              );
            })}
          </List>
        }
        actions={[
          {
            key: "sumbit",
            text: "添加完成",
            primary: true,
            onClick: handleOk,
          },
        ]}
      ></Modal>
    </div>
  );
};

export default MessageApp;
