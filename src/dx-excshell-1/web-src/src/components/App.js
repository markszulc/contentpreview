/* 
* <license header>
*/

import React, { useEffect, useState } from 'react'
import { Provider, defaultTheme, Grid, View, Text } from '@adobe/react-spectrum'
import { ErrorBoundary } from 'react-error-boundary/dist/react-error-boundary.js'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './Home'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)

  let [variation, setVariation] = React.useState('main');

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  // Fetch a Content Fragment from AEM Sites API and return JSON
  // Example usage: getContentFragment('669759ff-0c7d-4bb5-a45e-72c39c14b64a')
    const getContentFragment = async (fragmentId) => {
    if (!props.ims || !props.ims.token) {
      throw new Error('Missing IMS token for authentication')
    }
    // Replace with your AEM host (e.g., https://author-p12345-e12345.adobeaemcloud.com)
    const aemHost = 'https://author-p154720-e1630809.adobeaemcloud.com'
    const url = `${aemHost}/adobe/sites/cf/fragments/${fragmentId}`
    const response = fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${props.ims.token}`,
        'Accept': 'application/json'
      }
    }).then(response => response.json())
    .then(data => {
      console.log('Content Fragment Data:', data)
      return data;}
    ).catch(error => {
      console.error('Error fetching content fragment:', error)
    })
    
    return response;
  }
  

  useEffect(() => {
    getContentFragment('575962a2-f7bc-4131-ab10-c2b3a8665124');    
  }, [])

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme={'light'}>
          <Grid
            areas={['content']}
            columns={['1fr']}
            rows={['auto']}
            height='100vh'
            gap='size-100'
          >
            <View
              gridArea='sidebar'
              backgroundColor='gray-200'
              padding='size-200'
            >
            </View>
            <View gridArea='content' padding='size-200'>
              <Routes>
                <Route path='/' element={<Home />} />
              </Routes>
            </View>
          </Grid>
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
