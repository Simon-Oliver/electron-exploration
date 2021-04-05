import React, {useEffect,useState,useContext} from 'react'
import styles from './error.module.css'
import {ErrorContext} from "../../Utils/ErrorContext"

export default function Error(param) {
  const { isError, error, color, toggleError, setError } = useContext(ErrorContext)
  const [showDiv, setShowDiv] = useState(false);

  useEffect(()=>{
    console.log("Error Context",isError)
  })




  return (
    <>
  <div className={`${styles.error} ${isError ? styles.isOpen:""} ${styles[color]}`}>{error}</div>
  </>

  )
}
