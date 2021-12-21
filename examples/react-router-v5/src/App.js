import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Basic Example</h1>

        <p>
          This example demonstrates some of the core features of React Router
          including nested <code>&lt;Route&gt;</code>s,{' '}
          <code>&lt;Link&gt;</code>
          s, and using a "*" route (aka "splat route") to render a "not found"
          page when someone visits an unrecognized URL.
        </p>

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Layout />
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

// You can think of these components as "pages"
// in your app.

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />
    </div>
  )
}

export function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

export function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  )
}

export function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
