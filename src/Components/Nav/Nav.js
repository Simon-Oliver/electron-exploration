import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import fs from 'fs';
import styles from './nav.module.css'

export default function Nav() {
  const navItems = [
    {notifications:3, name:"home",path:"/", svg:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"},
    {notifications:0, name:"BLE",path:"/ble", svg:"M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"},
    {notifications:0 ,name:"Serial",path:"/serial", svg:"M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"},
  ]

  const renderNav = (items) => {
  return items.map(e =>{
    return (
        <NavLink className={styles.notification} style={{fill:"#858585"}} activeStyle={{fill:"white"}} exact={true} to={e.path}>
        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" ><path d="M0 0h24v24H0z" fill="none"/><path d={e.svg}/></svg>
        {e.notifications > 0 ? <span className={styles.badge}>{e.notifications}</span>: ""}
        </NavLink>
    )
  })
}

  return (
    <div className={styles.bg}>
      {renderNav(navItems)}
    </div>
  )
}
