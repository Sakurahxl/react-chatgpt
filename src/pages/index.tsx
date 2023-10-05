import { history } from "umi";
import { useEffect } from "react";
import { getLoginStatus } from "@/services/auth";



export default function HomePage() {
  useEffect(() => {
    const account = getLoginStatus();
    console.log(account.length);
    
    if(account.length != 0) {
      history.push('/home');
      return;
    }
    const judge = window.navigator.userAgent.indexOf("Html5Plus") === -1;
    if(judge) {
      history.push("/loginWeb");
    }else{
      history.push("/loginApp");
    }
  })
  
  return (
    <div>
    </div>
  );
}
