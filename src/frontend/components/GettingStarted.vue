<template lang="html">
  <div class="overlay">
    <div class="lg-col-6 md-col-8 sm-col-10 mx-auto">
      <h1 class="center">Getting started</h1>
      <div class="col-12 step">
        <div class="step-num col-2 left">
          <span class="inline-block center">1</span>
        </div>
        <div class="step-content col-8">
          <span>Go to </span>
          <a target="_blank" class="hotkeysLink" @click.prevent="onHotkeysClick" href="#">hotkeys config</a>
        </div>
      </div>
      <div class="col-12 step">
        <div class="step-num col-2 left">
          <span class="inline-block center">2</span>
        </div>
        <div class="step-content col-8">
          <span>Assign a key to either field:</span>
        </div>
        <div class="step-content step-content col-10">
          <div class="imgBox inline-block">
            <img src="img/hotkeys.png" alt="hotkey" />
          </div>
        </div>
      </div>
      <div class="col-12 step">
        <div class="step-num col-2 left">
          <span class="inline-block center">3</span>
        </div>
        <div class="step-content col-8">
          <span>You can use FuzzyMark now</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messageService from '../message-service';

export default {
  methods: {
    onHotkeysClick() {
      const url = "chrome://extensions/configureCommands";
      messageService.send({ type: 'open_tab', url: url });
    }
  }
}
</script>

<style lang="css">
.step {
  margin-top: 25px;
}

.step-num span {
  width: 72px;
  color: #3498db;
  background: #fff;
  line-height: 72px;
  border-radius: 100%;
  border: 2px #3498db solid;
  font-size: 24px;
}
.step-content {
  line-height: 72px;
  font-size: 16px;
}

.imgBox {
  margin: 16px 0;
}
.imgBox img {
  box-shadow: 0 4px 23px 5px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0,0,0,0.15);
}
</style>
