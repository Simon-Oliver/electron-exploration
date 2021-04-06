import React from 'react'
import styles from "./modal.module.css"

export default function Modal(props) {
  return (
    <div className={styles.modal} onClick={props.closeModal}>
      <div className={styles.modalContent}>
        {props.children}
      </div>
    </div>
  )
}
