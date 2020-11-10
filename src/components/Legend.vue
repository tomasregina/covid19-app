<template>
    <div class="legend">
      <h3>Legend</h3>
      <div class="legend-item" v-for="(color, idx) in colorSchema" :key="color">
        <div class="color-preview" :style="{backgroundColor: color}">
        </div>
        <p>{{statuses[idx]}}</p>
      </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            statuses: ['Active', 'Deaths', 'Recovered'],
            colorSchema: ['rgb(255, 73, 51)', 'rgb(116, 79, 33)', 'rgb(33, 218, 47)']
        }
    }
}
</script>
<style scoped>
.color-preview {
  height: 2.5rem;
  width: 2.5rem;
  margin-right: 1rem
}
.legend-item {
  display: flex;
  align-items: center;
}
h3 {
  text-align: left;
}
</style>
