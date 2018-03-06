import React from 'react'
import { Route } from 'react-router'
import { injectReducer } from 'redux/rootReducer'

import url from 'routes/tokens'

import Layout from './Layout'
import EnsureData from './EnsureData'
import reducer from './store/reducer'

import Cockpit from './views/Cockpit'
import List from './views/List'
import Details from './views/Details'

export default function IntegratorModule (store) {
  return <Route component={Layout} childRoutes={[
    {
      path: url.integrator.index,
      getComponent (nextState, cb) {
        injectReducer(store, { key: 'integrator', reducer })
        cb(null, EnsureData)
      },
      indexRoute: { component: Cockpit },
      childRoutes: [
        { path: url.integrator.clients, component: List },
        { path: Details.path, component: Details }
      ]
    }
  ]} />
}
