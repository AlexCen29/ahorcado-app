<template>
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-inner">
          <svg class="hangman-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="loading-text">
          <span>Cargando palabras</span>
          <span class="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingComponent'
  }
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #FDE74C;
  }
  
  .loading-spinner {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .spinner-inner {
    animation: rotate 2s linear infinite;
    width: 100px;
    height: 100px;
  }
  
  .hangman-icon {
    fill: #FA7921;
    stroke: #000;
    stroke-width: 1px;
  }
  
  .loading-text {
    margin-top: 20px;
    font-size: 20px;
    color: #333;
    display: flex;
    align-items: center;
  }
  
  .dots {
    display: inline-flex;
    margin-left: 5px;
  }
  
  .dots span {
    animation: blink 1.4s infinite both;
    color: #FA7921;
  }
  
  .dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
  </style>