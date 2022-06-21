import React, { createContext, useContext, useMemo } from "react";
import firebase from "firebase/app";
import "firebase/storage";



const FirebaseContext = createContext<typeof firebase | null>(null);

var firebaseConfig = {
    apiKey: process.env.GATSBY_FIREBASE_APIKEY,
    authDomain: process.env.GATSBY_FIREBASE_AUTH,
    projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
    storageBucket: process.env.GATSBY_FIREBASE_STORAGE,
    appId: process.env.GATSBY_FIREBASE_APPID,
    measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.GATSBY_FIREBASE_DB,
    messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGESENDER,
  };
export const FirebaseProvider: React.FC = ({children}) => {

    useMemo(() => {
        if(firebase.apps.length === 0){
            firebase.initializeApp(firebaseConfig)
        }
        
    }, [])

    return <FirebaseContext.Provider value={firebase}>
        {children}
    </FirebaseContext.Provider>
}

export const useFirebase = () => useContext(FirebaseContext) as typeof firebase