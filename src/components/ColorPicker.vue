<template>
	<div class="jussirm-vue-colorpicker">
		<div class="color-pick-container">
			<saturation-lightness-picker 
				:hue="color.h" 
				v-model:saturation="color.s"
				v-model:lightness="color.l" 
			/>
		</div>
		<div class="color-slider-container">
			<hue-slider v-model="color.h" />
		</div>
	</div>
</template>

<script lang="ts">
import ColorHsl from '@/interfaces/ColorHsl';
import { defineComponent, PropType } from 'vue'
import HueSlider from "./HueSlider.vue";
import SaturationLightnessPicker from "./SaturationLightnessPicker.vue";

export default defineComponent({
	components: {
		HueSlider,
		SaturationLightnessPicker
	},

	props: {
		modelValue: {
			type: Object as PropType<ColorHsl|null>,
			required: true
		}
	},

	data() { return {
		color: {
			h: 0,
			s: 100,
			l: 50
		} as ColorHsl
	}},

	watch: {
		color() {
			this.$emit("update:modelValue", this.color);
		}
	},

	beforeMount() {
		if (this.modelValue) {
			this.color = { ...this.modelValue };
		}
	},

	computed: {
		
	}
})
</script>

<style lang="scss">
	div.jussirm-vue-colorpicker {
		box-sizing: border-box;
		* {
			box-sizing: border-box;
		}

		width: 300px;
		height: 300px;
		display: flex;
		align-items: stretch;

		padding: 0px;
		border: 1px solid black;
		border-radius: 0.25rem;
		background-color: black;

		> div.color-pick-container {
			flex-grow: 1;
			margin-right: 2px;
		}

		> div.color-slider-container {
			background-color: cyan;
			width: 25px;
		}
	}
</style>