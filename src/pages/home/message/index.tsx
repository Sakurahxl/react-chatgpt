import React, { useState } from 'react';
import { Input, Button, List } from 'antd';
import styles from './index.less';
import Header from '../components/Header';

const MessageApp = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // 发送新消息
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        text: newMessage,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.message}>
        <div className={styles['top-wrapper']}>
        <Header display={true}/>
      </div>
      <h1>消息接收</h1>
      <div>
        <Input.TextArea
          rows={3}
          placeholder="在此写入新消息"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="primary" onClick={sendMessage}>
          发送信息
        </Button>
      </div>
      <div>
        <h2>消息列表</h2>
        <List
          dataSource={messages}
          renderItem={(message, index) => (
            <List.Item>
              <span>{message.text}</span>
              <span>{message.timestamp}</span>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default MessageApp;
