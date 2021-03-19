import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Nav from "./Nav"
import styles from '../styleApp.module.css';
import fs from "fs"
import path from "path"
import invData from '../utils/inventoryStore.json'

export default function Inventory() {

  const dir = path.join(__dirname, '../src/utils/inventoryStore.json')

  const onClickHanlder = () => {
    console.log("CLICK", invData)

    let inventory = invData

    inventory = [...inventory, {name:"Test 1"}]

    fs.writeFile(dir, JSON.stringify(inventory), err=>{
      if(err){
        console.log(err)
      }
      console.log("File written")
    })
  }
  return (
    <div className={styles.gridContainer}>
      <Nav></Nav>
    <div className={styles.mainContainer}>
      <p>INVENTORY</p>
      <button onClick={onClickHanlder}>Press me</button>
    </div>
    </div>
  )
}
