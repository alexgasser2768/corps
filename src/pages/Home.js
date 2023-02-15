import room1 from "../images/room1.jpg"
import room2 from "../images/room2.jpg"
import room3 from "../images/room3.jpg"
import room4 from "../images/room4.jpg"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { TextField, Button } from "@mui/material";
import {Send } from "@mui/icons-material";
import MyDatePicker from "../Components/DatePick";
import Navbar from "../Components/Navbar"
import { collection, addDoc, serverTimestamp, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase"
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [num, setNum] = useState("")
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(()=> {
      getBlockedDates();
}, [])


  // retrieve blocked date from firestore
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





const updateDate = (f_date, s_date) => {
  setFromDate(f_date)
  setToDate(s_date)
}


const cleanValues = () => {
  setName("")
  setLastName("")
  setEmail("")
  setNum("")
  setFromDate("")
  setToDate("")
  setMessage("")
  toast.success("Le message a été correctement envoyé", {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose:2000
   })
}



const addPost = async () => {
  const collectionRef = collection(db, "posts")
  await addDoc(collectionRef, {
       post:{
        msg:message,
        name:name,
        lastName:lastName,
        email:email,
        tel:num,
        fromDate:fromDate,
        toDate:toDate
      },
       timestamp: serverTimestamp(),
   }).then(cleanValues)
}

    return (
      <div>
<ToastContainer/>
<div className="img-container container">
<div className="box">
    <div className="img" data-toggle="modal" data-target="#lightbox">
      <div className="frame">
        <img src={room1} data-target="#indicators" data-slide-to="0" alt="" />    
        <img src={room2} data-target="#indicators" data-slide-to="1" alt="" /> 
        <img src={room2} data-target="#indicators" data-slide-to="2" alt="" /> 
        <img src={room2} data-target="#indicators" data-slide-to="3" alt="" /> 

      </div>  
  </div>
  {/* <div className="img">
       <img src={room2} data-target="#indicators" data-slide-to="1" alt="" />
  </div>
  <div className="img">
     <img src={room3} data-target="#indicators" data-slide-to="2"  alt="" />
  </div>
  <div className="img">
       <img src={room4} data-target="#indicators" data-slide-to="3" alt="" />
  </div> */}

</div>

<div className="contact-container">

<div className="description">
    <p>
Vous cherchez une maison paisible et bénéficiant d'un cadre idyllique ? Votre recherche est terminée ! Nous vous proposons notre magnifique maison située à Corps, à seulement 2 pas des Alpes. <br/><br/>

Cette maison offre une vue imprenable sur les montagnes et un cadre paisible pour vous permettre de vous ressourcer et de profiter de la nature. La maison dispose de toutes les commodités nécessaires pour vous assurer un confort optimal, tout en étant proche des centres d'intérêts locaux.

Vous pourrez profiter d'une cuisine entièrement équipée, de chambres confortables et spacieuses, ainsi que d'une salle de bain moderne.<br/><br/>

N'hésitez pas à nous contacter pour plus d'informations et pour organiser une visite. Nous sommes certains que vous tomberez sous le charme de notre maison et de son environnement exceptionnel.
</p>
</div>
<div style={{width:"50%"}}>
  <MyDatePicker data={updateDate} blocked={blockedDates} className="MyDatePicker"/>
</div>

</div>

<div className="modal fade" id="lightbox" role="dialog" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
        <button type="button" className="close text-right p-2" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      <div id="indicators" className="carousel slide" data-interval="false">
  <ol className="carousel-indicators">
    <li data-target="#indicators" data-slide-to="0" className="active"></li>
    <li data-target="#indicators" data-slide-to="1"></li>
    <li data-target="#indicators" data-slide-to="2"></li>
    <li data-target="#indicators" data-slide-to="3"></li>
    <li data-target="#indicators" data-slide-to="4"></li>
    <li data-target="#indicators" data-slide-to="5"></li>
  </ol>
  <div className="carousel-inner">
    
    <div className="carousel-item active">
      
      <img className="d-block w-100" src={room1} alt="First slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={room2} alt="Second slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={room3} alt="Third slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src={room4} alt="Fourth slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#indicators" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#indicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>

    </div>
  </div>
</div>
                         </div>
                         <div className="form-container">
<form className="form" id="contact">
      <div className="text m-4">
        <h3>Remplissez le formulaire et nous reviendrons vers vous le plus vite possible</h3>
      </div>
          <div className="InputBox">
            <div className="InputField">
                              <TextField
                                  sx={{ input: { color: 'white' }, label:{color:"white", fontSize:"1rem"} }}
                                  type="text"
                                  label="Nom"
                                  variant="outlined"
                                  value={lastName}
                                  onChange={(e)=>{setLastName(e.target.value)}}
                                  />
                              <TextField
                                  sx={{ input: { color: 'white' }, label:{color:"white", fontSize:"1rem"}}}

                                  type="text"
                                  label="Prénom"
                                  variant="outlined"
                                  value={name}
                                  onChange={(e)=>{setName(e.target.value)}}
                                  />
                              <TextField
                                  sx={{input: { color: 'white' }, label:{color:"white", fontSize:"1rem"}}}
                                  type="text"
                                  label="Email"
                                  variant="outlined"
                                  className="inputColor"
                                  value={email}
                                  onChange={(e)=>{setEmail(e.target.value)}}
                                  />
                              <PhoneInput
                                className="phone"
                                placeholder="Numéro de téléphone"
                                value={num}
                                onChange={setNum}/>
    

                      </div>

                    
                    <div className="textBox">

                      <div className="textArea">
                            <textarea value={message} onChange={(e)=>{setMessage(e.target.value)}} placeholder="Ecrivez votre message..."></textarea>
                        </div>
                        <Button style={{margin:"10px"}} onClick={addPost} variant="contained" endIcon={<Send />}>
                            Envoyer
                        </Button>
                    </div>


          </div>


                </form>

</div>
      </div>
    )
}

export default Home;