import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import {useEffect, useRef, useState} from "react";
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../lib/firebase.js";
import {useChatStore} from "../../lib/chatStore.js";
import {useUserStore} from "../../lib/userStore.js";
import upload from "../../lib/upload.js";

const Chat = () => {

    const [open, setOpen] = useState(false)
    const [chat, setChat] = useState()
    const [text, setText] = useState("")
    const [img, setImg] = useState({
        file: null, url: "",
    })

    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore()
    const {currentUser} = useUserStore()

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: "smooth"})
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub();
        };
    }, [chatId])

    const handleEmoji = e => {
        setText(prev => prev + e.emoji)
        setOpen(false)
    }

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0], url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null

        try {

            if (img.file) {
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id, text, createdAt: new Date(), ...(imgUrl && {img: imgUrl})
                })
            });

            const userIDs = [currentUser.id, user.id]
            for (const id of userIDs) {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                    userChatsData.chats[chatIndex].updatedAtDate = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            }

        } catch (e) {
            console.log(e)
        }

        setImg({
            file: null, url: ""
        })

        setText("")
    }

    return (<div className='chat'>
        <div className="top">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt=""/>
                <div className="texts">
                    <span>{user?.username}</span>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, itaque?</p>
                </div>
            </div>
            <div className="icons">
                <img src="/phone.png" alt=""/>
                <img src="/video.png" alt=""/>
                <img src="/info.png" alt=""/>
            </div>
        </div>
        <div className="center">
            {chat?.messages.map((message) => (<div
                    className={message.senderId === currentUser.id ? "message own" : "message"}
                    key={message?.createdAt}
                >
                    <div className="texts">
                        {message.img && <img src={message.img} alt=""/>}
                        <p>{message.text}</p>
                        {/*<span>{message.createdAt}</span>*/}
                    </div>
                </div>))}
            {img.url && <div className="message own">
                <div className="texts">
                    <img src={img.url} alt=""/>
                </div>
            </div>}
            <div ref={endRef}></div>
        </div>
        <div className="bottom">
            <div className="icons" >
                <label htmlFor="file" >
                    <img src="/img.png" alt="" />
                </label>
                <input
                    type="file"
                    name=""
                    accept={"image/png, image/jpeg"}
                    id="file"
                    style={{display: 'none'}}
                    onChange={handleImg}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <img src="/camera.png" alt=""/>
                <img src="/mic.png" alt=""/>
            </div>
            <input
                type="text"
                placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message." : "Type a message..."}
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
            <div className="emoji" >
                <img
                    src="/emoji.png" alt="" onClick={ !(isCurrentUserBlocked || isReceiverBlocked) ? () => setOpen(prev => !prev) : undefined }
                />
                <div className="picker">
                    <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                </div>
            </div>
            <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                Send
            </button>
        </div>
    </div>)
}

export default Chat