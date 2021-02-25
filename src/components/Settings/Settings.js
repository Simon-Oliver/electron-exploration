import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div>
      <p>Settings</p>
      <Link to="/">Back Home</Link>
    </div>
  )
}
