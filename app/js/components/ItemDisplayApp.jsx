"use strict"

import React from "react"
import Promise from "bluebird"

import BaseGrid from "lib/BaseGrid.jsx"
import LoadSpinner from "lib/LoadSpinner.jsx"

import ItemDisplayStore from "stores/ItemDisplayStore"
import ItemDisplayAction from "actions/ItemDisplayAction"
import ShoppingCartAction from "actions/ShoppingCartAction"
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal.jsx"

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    hasMoreItems: ItemDisplayStore.hasMoreItems()
  };
}

let _getItemPromise = null;

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      items: ItemDisplayStore.getItems(),
      hasMoreItems: ItemDisplayStore.hasMoreItems(), 
      
      selectedItem: {},
      showItemDetailModal: false,
      isLoading: false,
      isItemsAdded: true
    };
  }
  
  componentDidMount() {
    ItemDisplayStore.addChangeListener(this._onChange);
    
    window.addEventListener("scroll", this.checkScrollToBottom);
    
    this.checkScrollToBottom();
  }
  
  componentWillUnmount() {
    ItemDisplayStore.removeChangeListener(this._onChange);
    
    window.removeEventListener("scroll", this.checkScrollToBottom); 
    
    if (_getItemPromise) {
      _getItemPromise.cancel();
    }
  }
  
  _onChange = () => {
    let newState = getStateFromStores()
    ,   items = this.state.items;

    let newItems = newState.items.slice(items.length);
    
    this.setState({
      hasMoreItems: newState.hasMoreItems,
      isItemsAdded: false
    });
    
    let p = Promise.cast();
    
    for (let item of newItems)
    {
      p = p.then(() => {
        return new Promise((resolve, reject) => {
          Promise.delay(200).then(() => {
            items.push(item);

            this.setState({
              items: items
            });
            
            resolve();
          });
        });
      });
    }
    
    p.then(() => {
      this.setState({
        isItemsAdded: true
      });
    }).catch(function(err) {
      console.log(err);
    });
  };
  
  handleItemClick = (item) => {
    this.setState({
      selectedItem: item,
      showItemDetailModal: true
    });
  };
  
  handleAddToCartClick = (item) => {
    ShoppingCartAction
    .addToCart(item)
    .finally(function() {
      console.log("added to cart", item);
    });
  };
  
  doInfiniteLoad = () => {
    // do nothing when it's already in the loading process
    // or when there's no more items 
    // or when new items are not fully added to the grid
    if (this.state.isLoading || 
       !this.state.hasMoreItems || 
       !this.state.isItemsAdded) {
      return;
    }
    
    this.setState({
      isLoading: true
    });

    _getItemPromise = ItemDisplayAction
    .getItems()
    .then(() => {
      this.setState({
        isLoading: false
      });
    });
  };
  
  onItemDetailModalClose = () => {
    this.setState({
      showItemDetailModal: false
    });
  };
  
  checkScrollToBottom = () => {
    let scrollTop = 
      document.documentElement && document.documentElement.scrollTop || 
      document.body.scrollTop;
    
    let scrollHeight = 
      document.documentElement && document.documentElement.scrollHeight || 
      document.body.scrollHeight; 
    
    if ((scrollTop + window.innerHeight) >= scrollHeight) {
      this.doInfiniteLoad();
    }
  };
  
  render() {
    let itemDetailModal = (
      <ItemDetailModal 
        showModal={this.state.showItemDetailModal} 
        item={this.state.selectedItem}
        onClose={this.onItemDetailModalClose}
        />
    );
    
    return (
      <div>
        {itemDetailModal}
        <BaseGrid
          items={this.state.items} 
          handleItemClick={this.handleItemClick}
          handleAddToCartClick={this.handleAddToCartClick} />
        <LoadSpinner hidden={!this.state.isLoading} />
      </div>
    );
  }
  
}
