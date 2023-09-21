import { history } from "umi";
import { useEffect } from "react";



export default function HomePage() {
  useEffect(() => {
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
