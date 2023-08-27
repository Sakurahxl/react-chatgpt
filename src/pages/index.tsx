
import { Button } from 'antd-mobile';
import { history } from 'umi';
import yayJpg from '../assets/yay.jpg';

export default function HomePage() {
  const toGpt = () => {
    history.push('/chatgpt');
  }
  return (
    <div>
      kongbai
      <Button onClick={toGpt}>gpt</Button>
    </div>
  );
}
