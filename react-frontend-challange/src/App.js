import React from 'react';
import './App.css';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import {Task} from './components/task';

function App() {
  return (
    <div>
      <Header></Header>
      <div className='col-sm-12'>
        <div className='card mt-2'>
          <div className='card-body'>
           <Task />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
