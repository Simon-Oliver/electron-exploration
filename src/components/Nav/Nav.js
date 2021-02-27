import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import styles from "../../styleApp.module.css";

export default function Nav() {
  return (
      <div className={styles.navContainer}>
        <NavLink to="/settings" className={styles.navItem}
        //activeStyle={{ fill:"white" }}
        activeClassName={styles.active}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="0 0 24 24"
            width="28"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
          </svg>
        </NavLink>
        <NavLink
         className={styles.navItem}
          to="/"
          exact
          //activeStyle={{ fill:"white" }}
          activeClassName={styles.active}
        >
          <svg

            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="0 0 24 24"
            width="28"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z" />
          </svg>
        </NavLink>
      </div>
  )
}
