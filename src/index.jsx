import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "mobx-react"
import mainStore from "./stores/mainStore"

import App from "./components/App"
import "bootstrap/dist/css/bootstrap.min.css"

const stores = {
  mainStore,
  BlockchainStore: mainStore.BlockchainStore,
}

ReactDOM.render((
  <Provider {...stores}>
    <App />
  </Provider>
), document.getElementById("root"))
