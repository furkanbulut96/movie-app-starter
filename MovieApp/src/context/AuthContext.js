import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import {
  toastErrorNotify,
  toastSuccessNotify,
  toastWarnNotify,
} from "../helpers/ToastNotify";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    userObserver();
  }, []);

  const createUser = async (email, password, displayName) => {
    try {
        //? yeni bir kullanıcı oluşturmak için kullanılan firebase metodu
        let userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          //? kullanıcı profilini güncellemek için kullanılan firebase metodu
          await updateProfile(auth.currentUser, {
            displayName: displayName,
          });
      navigate("/");
      toastSuccessNotify("KAYIT OLUŞTURULDU");
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  const signIn = async (email, password) => {
    //? Kullanıcı girişi içn logine
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toastSuccessNotify("GİRİŞ YAPILDI");
    } catch (error) {
      toastErrorNotify(error.message);
    }
  };

  const LogOut = () => {
    signOut(auth);
    toastWarnNotify("ÇIKIŞ YAPILDI");
  };

  const userObserver = () => {
    //? userı gözlemler user varsa.. yap yoksa.. yap
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({ email, displayName, photoURL });
      } else {
        setCurrentUser(false);
        // console.log("logged out")
      }
    });
  };


  const signUpProvider=()=>{
    //?Google girşi için kullanılan
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  .then((result) => {
    console.log(result)
    navigate("/")
    toastSuccessNotify("Google Hesabıyla giriş yapıldı")

  }).catch((error) => {

    console.log(error)
  });
  
  }
  const values = {
    LogOut,
    signIn,
    createUser,
    currentUser,
    signUpProvider
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

//*Context1) create edilcek
//* dışarda kullanmak için export edilir useContext()
//* children = sarmalladığız yerlerdir
//* value = childrenlara gönderdiklerimiz
//*tüketimi için de useContext hooku kullanır

//*SıgnIn başarlı olup olmadığını navigate home diyerek anlarız
//*navigate Routerun altında çalışır o yüzden contexti Routerin altına almalıyz

//*userobserver herhangi bir yerden çağırmacaz kendi kenbdine çalıck o yüzden contex
//* ten direk useeffcekt ile çağrılcak

//*userUbdateProfleyi Create userin altında vermemiz sebebi profile ilk girişi
