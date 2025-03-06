import "./login.css";
import {useState} from "react";
import {toast} from "react-toastify";
import {doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword} from "../../lib/auth.js";
import {db} from "../../lib/firebase.js";
import {collection, getDocs, query, where} from "firebase/firestore";


const Login = () => {
    const [avatar,setAvatar] = useState(
        {
            file:null,
            url:""
        }
    );
const [loading,setLoading] = useState(false);


    const handleAvatar = e => {
        if(e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(e.target)

        const {email,password} = Object.fromEntries(formData);

        try{
            await doSignInWithEmailAndPassword(email,password)
            toast.success("Signed in!")
        } catch(err) {
            console.error(err);
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(e.target)

        const {username,email,password} = Object.fromEntries(formData);

        //Validate Inputs
        if(!username || !email || !password ) {
            return toast.error("Please enter valid details");
        }
        if(!avatar.file) return toast.error("Please upload an avatar");

        //Validate unique username

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return toast.warn("Select another username");
        }


        try {
            await doCreateUserWithEmailAndPassword(email,password,username,avatar.file)

            toast.success("Account Created Successfully");

            await doSignInWithEmailAndPassword(email,password)

        }
        catch(err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email"/>
                    <input type="password" placeholder="Password" name="password"/>
                    <button disabled = {loading} >{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "avatar.png" }  alt=""/>
                        Upload an Image
                    </label>
                    <input type="file" id="file" accept={"image/png, image/jpeg"} style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username"/>
                    <input type="email" placeholder="Email" name="email"/>
                    <input type="password" placeholder="Password" name="password"/>
                    <button disabled = {loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>


        </div>

    )
}

export default Login