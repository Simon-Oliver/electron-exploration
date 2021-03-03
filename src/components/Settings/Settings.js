import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Nav from "../Nav"
import styles from '../../styleApp.module.css';

export default function Settings() {
  return (
    <div className={styles.gridContainer}>
      <Nav></Nav>
    <div className={styles.mainContainer}></div>
    </div>
  )
}
