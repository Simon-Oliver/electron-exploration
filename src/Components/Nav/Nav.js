import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import fs from 'fs';
import styles from './nav.module.css'

export default function Nav() {
  return (
    <div className={styles.bg}>
      <Link to="/">Home</Link>
      <Link to="/ble">Ble</Link>
      <Link to="/serial">Serial</Link>
    </div>
  )
}
