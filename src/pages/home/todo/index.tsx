import React, { useState } from "react";
import { Input, Button, List, Checkbox } from "antd";
import styles from "./index.less";
import Header from "../components/Header";

const TodoApp = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [task, setTask] = useState("");

  // 添加待办事项
  const addTodo = () => {
    if (task.trim() !== "") {
      setTodos([...todos, { text: task, completed: false }]);
      setTask("");
    }
  };

  // 删除待办事项
  const deleteTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i: number) => i !== index);
    setTodos(updatedTodos);
  };

  // 标记待办事项为已完成
  const toggleComplete = (index: number) => {
    const updatedTodos = todos.map((todo, i: number) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className={styles.todo}>
      <div className={styles['top-wrapper']}>
        <Header display={true}/>
      </div>
      <h1>任务清单</h1>
      <div>
        <Input
          type="text"
          placeholder="添加新任务"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button type="primary" onClick={addTodo}>
          添加待办事项
        </Button>
      </div>
      <List
        dataSource={todos}
        renderItem={(todo, index) => (
          <List.Item
            actions={[
              <Checkbox
                onChange={() => toggleComplete(index)}
                checked={todo.completed}
              >
                {todo.completed ? "已完成" : "完成"}
              </Checkbox>,
              <Button onClick={() => deleteTodo(index)}>删除</Button>,
            ]}
          >
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoApp;
