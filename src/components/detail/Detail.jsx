import "./detail.css"
import {doSignOut} from "../../lib/auth.js";
import {useChatStore} from "../../lib/chatStore.js";
import {useUserStore} from "../../lib/userStore.js";
import {updateDoc, arrayRemove, arrayUnion, doc} from "firebase/firestore";
import {db} from "../../lib/firebase.js";

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
    const {currentUser } = useUserStore();

    const handleBlock = async () => {
        console.log(user)
        if(!user) return;

        const userDocRef = doc(db,"users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })
            changeBlock()
        } catch (e) {
            console.error(e);
        }

    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt=""/>
                <h2>{user?.username}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, quasi!</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="/arrowUp.png" alt=""/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="/arrowUp.png" alt=""/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="/arrowDown.png" alt=""/>
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="/orc.png" alt=""/>
                                <span>Photo_orc.png</span>
                            </div>
                            <img src="/download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="/orc.png" alt=""/>
                                <span>Photo_orc.png</span>
                            </div>
                            <img src="/download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="/orc.png" alt=""/>
                                <span>Photo_orc.png</span>
                            </div>
                            <img src="/download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="/orc.png" alt=""/>
                                <span>Photo_orc.png</span>
                            </div>
                            <img src="/download.png" alt="" className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="/arrowUp.png" alt=""/>
                    </div>
                </div>
                <button onClick={handleBlock} >
                    {
                        isCurrentUserBlocked
                            ? "You are blocked!"
                            : isReceiverBlocked
                                ? "User Blocked!"
                                : "Block User"
                    }
                </button>
                <button className="logout" onClick={()=>doSignOut()}>Log Out</button>
            </div>
        </div>
    )
}

export default Detail