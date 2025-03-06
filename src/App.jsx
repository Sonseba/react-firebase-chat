import Chat from "./components/chat/Chat";
import List from "./components/list/List";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/notification.jsx";
import {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from  "./lib/firebase"
import {useUserStore} from "./lib/userStore.js";
import {useChatStore} from "./lib/chatStore.js";

const App = () => {
    const {currentUser, isLoading, fetchUserInfo} = useUserStore()
    const {chatId} = useChatStore()


    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user).then(() => {});
        });

        return () => {
        unSub();
    };
}, [fetchUserInfo]);

    if(isLoading) return <div className="loading"> Loading...</div>
  return (
    <div className='container'>
      {
        currentUser ? (
            <>
          <List/>
                { chatId && <Chat/>}
                { chatId && <Detail/>}
            </>
        ) : (
            <Login/>
        )
      }
      <Notification/>

    </div>
  )
}

export default App