import { auth, db } from "./firebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    updateProfile,
    GoogleAuthProvider,
} from "firebase/auth";
import upload from "./upload.js";

export const doCreateUserWithEmailAndPassword = async (email, password, username,file) => {
    let user = await createUserWithEmailAndPassword(auth, email, password)
    let imgUrl = await doAddProfileImage(file)
    await doAddUserInfoToNewUser(user,email,username,imgUrl);
    await doAddUserChatsToNewUser(user)

    return user
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doAddUserChatsToNewUser = async (user) => {
         await setDoc(doc(db,"userchats", user.user.uid), {
             chats: [],
         })
    }

export const doAddUserInfoToNewUser = async  (user,email,username,imgUrl) => {
    await setDoc(doc(db,"users", user.user.uid), {
        username,
        email,
        avatar: imgUrl,
        searchName: username.toLocaleLowerCase(),
        id: user.user.uid,
        blocked: [],
    })
}

export const doAddProfileImage = async (file) => {
    return upload(file)

}

export const getUserData = async (uid) => {
    let data = await getDoc(doc(db, 'users', uid))
    return data.data();
}

export const doSignOut = () => {
    return auth.signOut();
};

export const doUpdateProfile = (displayName) => {
    return updateProfile(auth.currentUser, {displayName: displayName})
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};