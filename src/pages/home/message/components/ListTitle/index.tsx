import { AddOutline } from "antd-mobile-icons";
import styles from "./index.less";

const listTitle = (props: { addContact: Function; }) => {
    const {addContact} = props;
    return (
        <div className={styles['list-title']}>
            <div>好友列表</div>
            <div onClick={() => addContact()}><AddOutline /></div>  
        </div>
    );
};
export default listTitle;