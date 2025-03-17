<template>
  <div class="animated-bg">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.animated-bg {
  min-height: 100vh;
  background: linear-gradient(-45deg, #5BC0EB, #FDE74C, #9BC53D, #E55934, #FA7921);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
display: flex;  flex-direction: column;
  top: 0;
  left: 0;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
