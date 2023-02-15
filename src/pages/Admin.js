import { Grid, TextField, Button, Card, CardContent, Typography, CardActions } from "@mui/material";
import {signInWithEmailAndPassword} from "firebase/auth"
import { ControlPointDuplicate, Google, Label } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import MyDatePicker from "../Components/DatePick";
import { collection, addDoc, serverTimestamp, orderBy, query, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { ConfirmationNumber } from "@mui/icons-material";
import AlertDialog from "../Components/ConfirmDialog";
import { getColor, getDates } from "../helper/helper";

const Admin = () => {
    // sign in with google

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const [user, loading] = useAuthState(auth);
    const [logged, setLogged] = useState(false);
    const [posts, setPosts] = useState([])
    const [blockedDates, setBlockedDates] = useState([]);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();

    console.log("MSG = ", posts)

    useEffect(()=> {
        if (loading) return;
        if (user){
            console.log("Logged in")
            setLogged(true)
            getBlockedDates();
            retrievePosts();
        } else {
            setLogged(false)
            console.log("No one logged")
        }
    }, [user, loading])

    const reload = (id) => {
        {console.log("DELETE ",posts)}

        setPosts(
            (posts)=>{
                return posts.filter(post => post.id !== id)
            }
        )
        toast.warning("Le post a été correctement supprimé", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose:2000
           })
    }


    const correctDates = (f_date, t_date) => {
        const array = getDates(f_date, t_date)
        for (let i = 0; i < blockedDates.length; i++) {
            for (let j = 0; j < array.length; j++) {      
                const comp = blockedDates[i].toString()
                if ( comp == array[j].toString() ){
                    return false
                }   
            }
        }
        return true;
    }


    const updatePosts = (newPost) => {        
        try {
            const f_date = newPost.fromDate.toDate()
            const t_date = newPost.toDate.toDate()

            console.log(f_date)
            console.log(t_date)

            console.log(correctDates(f_date, t_date))

            if(!correctDates(f_date, t_date)){
                toast.error("Une réservation à déja été faites et la maison n'est pas disponnible a ces dates la", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose:2000
                   })
            } else {

                setPosts(
                    posts.map((post)=>
                        post.id === newPost.id
                        ? {...newPost}
                        : {...post}
                    )
                )

                addDate(f_date, t_date);
            }

        } catch(error) {
            toast.success("Une erreur est survenue, les dates ne sont pas valides", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose:2000
               })

        }
    }


    const validatePost = async (post) => {
        const f_date = post.fromDate.toDate()
        const t_date = post.toDate.toDate()
        if(!correctDates(f_date, t_date)){
            toast.error("Une réservation à déja été faites et la maison n'est pas disponnible a ces dates la", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose:2000
               })
        } else {
            post.validate = true;
            const docRef = doc(db, "posts", post.id);
            const updatePost = {post:post, timestamp: serverTimestamp()}
            await updateDoc(docRef, updatePost).then(updatePosts(post))
        }
    }

    const deletePost = async(post) => {
        const id = post.id;
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef).then(reload(id))
    }

    const retrievePosts = async() => {
        const collectionRefRetrieve = collection(db, "posts");
        const q = query(collectionRefRetrieve, orderBy("timestamp", "desc"))
        const array = new Array()
        console.log("Je suis la")
        const res = onSnapshot(q, (snapshot)=>{            
            const data = snapshot.docs.map((doc)=>({id: doc.id,...doc.data()}))
            for (let i = 0; i < data.length; i++) {
                data[i].post.id = data[i].id
                array.push(data[i].post)
            }
             
        })
        setPosts(array)
    }

    const getBlockedDates = async() => {
        const collectionRefRetrieve = collection(db, "dates");
        const q = query(collectionRefRetrieve, orderBy("timestamp", "desc"))
        const array = new Array()
        const dates = onSnapshot(q, (snapshot)=>{
            const data = snapshot.docs.map((doc)=>({...doc.data()}))
            for (let i = 0; i < data.length; i++) {
                for (let j=0; j< Object.keys(data[i]).length-1; j++){
                    array.push(data[i][j].toDate());
                }
            }
            setBlockedDates(array)            
        })
    }


    const formatDate  = (d) => {
        try {
            d = d.toDate()
        } catch(error){
            return "Date non fournies"
        }
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear()
        return datestring;
    }


    const updateDate = (f_date, s_date) => {
        setFromDate(f_date)
        setToDate(s_date)
    }

    const addDate = async (f_date, t_date) => {
        const collectionRef = collection(db, "dates")
        const array = getDates(f_date, t_date)
        await addDoc(collectionRef, {
            ...array,
            timestamp: serverTimestamp(),
        })
        toast.success("Les dates ont été bloqué", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose:2000
           })
    }


    const loginWithEmailAndPassword = async (mail, psw) =>{
         try {
            await signInWithEmailAndPassword(auth, mail, psw).then(
                ()=>{
                    setUsername("")
                    setPassword("")
                    toast.success("Authentification réussi", {
                        position: toast.POSITION.BOTTOM_CENTER,
                        autoClose:2000
                       })
                }
            )

         } catch (error){
            setUsername("")
            setPassword("")
            toast.error("Email ou mot de passe incorrect", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose:2000
               })
         }
    }


    const logOut = () => {
        auth.signOut()
        setUsername("")
        setPassword("")
        toast.success("Déconnexion réussi", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose:2000
           })
    }



    const sortPost = (value, posts) => {
        console.log("Je suis la",value)
        let sorted;
        switch (value) {
            case "valider":
                sorted = posts.sort((a,b)=>{
                    return Object.keys(b).length - Object.keys(a).length
                })
                break;
        
            case "wait":
                sorted = posts.sort((a,b)=>{
                    return Object.keys(a).length - Object.keys(b).length
                })
                break;
            
            case "dateD":
                sorted = posts.sort((a,b)=>{
                    return b.fromDate.toDate().getTime() - a.fromDate.toDate().getTime()
                })
                break;
            
            case "dateC":
                sorted = posts.sort((a,b)=>{
                    return a.fromDate.toDate().getTime() - b.fromDate.toDate().getTime()
                })
                break;  

            default:
                break;
        }
        if (sorted){
            setPosts([...sorted])
        }
    }

    return (
        <div className="container">
            <ToastContainer/>
            <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
                <h2 className="text-2xl font-medium">
                    Admin
                </h2>
             
                {!logged ?
                <div> 
                <div className="py-4">
                    <form>

                   
                <TextField
                    style={{margin:"5px"}}
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    label="Username"
                    variant="outlined"
                    required
                    />
                <TextField
                    style={{margin:"5px"}}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    label="Password"
                    variant="outlined"
                    required
                    />


                <div className="signIn">
                    <Button onClick={()=> loginWithEmailAndPassword(username, password)} >
                        Sign in
                    </Button>
                </div>
                </form>
                </div>

                    </div>   
                         : 
                         
                <div>
                <div className="right">
                    <Button onClick={logOut}><h2>Logout</h2></Button>

                    <div/>
                </div>
                    <div>
                        <p className="text-center" style={{margin:"5px"}}>
                            Bloquer manuellement pour les utilisateurs
                        </p>
                    </div>
                <MyDatePicker data={updateDate} blocked={blockedDates} className="MyDatePicker"/>
                <Button onClick={()=>{addDate(fromDate, toDate)}}>Bloquer</Button>
                </div> 
                }

                {error? 
                <h2 className="text-2xl font-medium">
                    {error}
                </h2>:null}
            </div>

            {logged ? 
                <div>



            <div className="row">
                {posts.length !== 0 
                ?<div>  
                <div className="flex justify-center mt-6">
                <select id="countries" defaultValue={""} onChange={e=>sortPost(e.target.value, posts)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="default" disabled>Option de tri</option>
                    <option value="valider">Valider</option>
                    <option value="wait">En attente</option>
                    <option value="dateC">Du plus récent post au plus ancien</option>
                    <option value="dateD">Du plus ancien post au plus récent</option>
                    
                </select>

                 </div>  
                {posts.map((post)=>(
                    <div key={post.id} className="col-md-6 col-sm-12 col-lg-4">
                        <div style={{boxShadow:`10px 10px 40px ${getColor(post)}`}} className={`shadow-2xl mb-4 mt-32 p-10 text-gray-700 rounded-lg myCard`}>
                            <div className="flex justify-between">
                                <p className="text-1xl text-left font-medium">
                                    Nom : {post.lastName}
                                </p>
                                <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white"><span style={{ backgroundColor: `${getColor(post)}` }} className={`flex w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0`}></span>{post.validate? "Valider" : "En attente"}</span>
                            </div>
                            <p className="text-1xl text-left font-medium">
                                Prenom : {post.name}
                            </p>

                            <p className="text-1xl text-left font-medium">
                            Email : <a href={`mailto:${post.email}`} className="text-1xl text-left font-medium">
                                {post.email}
                            </a> 
                            </p>
                            
                            <p className="text-1xl text-left font-medium">
                                Tel : {post.tel}
                            </p>  
                            <p className="text-1xl text-left font-medium">
                                Du : { formatDate(post.fromDate)}
                            </p>   

                            <p className="text-1xl text-left font-medium">
                                Au : { formatDate(post.toDate)}
                            </p>  

                            <hr className="flex mt-2 mb-2 justify-center">

                            </hr>
                            <p className="text-1xl text-center font-medium">
                                Message : <br/> {post.msg}
                            </p>
                            <div className="flex gap-4 justify-between">
                            <div className="text-red-600 flex items-center justify-center gap-2 py-2 text-sm">
                                <AlertDialog content={"Une fois confirmé les dates seront bloquer pour les utilisateurs"} confirmFunction={deletePost} post={post} del={true}/>
                            </div>

                            {post.validate ? 
                                <div/>
                            :
                                <div className="text-green-600 flex items-center justify-center gap-2 py-2 text-sm">
                                    <AlertDialog content={"Une fois confirmé les dates seront bloquer pour les utilisateurs"} confirmFunction={validatePost} post={post} del={false} />
                                </div>
                            }
                            
                            </div>
                        </div>

                    </div>    
                ))}
                </div>
                :
                  <p className="text-center m-4">Aucun post...</p>
                }



            </div>
                </div>
            :
                <div/>
            }

        </div>


    )
}

export default Admin;