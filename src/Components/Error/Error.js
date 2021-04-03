import React, {useEffect,useState,useContext} from 'react'
import styles from './error.module.css'
import {ErrorContext} from "../../Utils/ErrorContext"

export default function Error(param) {
  const { isError, error, color } = useContext(ErrorContext)

  useEffect(()=>{
    console.log("Error Context",isError)
  })

  return (
    <>
  {isError ? <div className={styles.error}>{error}</div>:""}
  </>

  )
}
