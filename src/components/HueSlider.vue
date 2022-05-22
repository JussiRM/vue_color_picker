<template>
	<div class="jussirm-hue-slider" ref="hueSlider">
		<div class="handle" ref="handle" :style="sliderStyle"></div>
	</div>
</template>

<script lang="ts">
import { preventPercentageOutOfBounds } from '@/helpers';
import { defineComponent, PropType } from 'vue'

export default defineComponent({
	props: {
		modelValue: {
			type: Number as PropType<number>,
			required: true
		}
	},

	data() { return {
		handleY: 0,
		isDragging: false
	}},

	watch: {
		handleY() {
			let hue = this.getHueFromSlider();
			this.$emit('update:modelValue', hue);
		}
	},

	mounted() {
		// Init slider position
		this.handleY = (this.modelValue / 360);

		this.addListeners();
	},

	beforeUnmount() {
		this.removeListeners();
	},

	computed: {
		sliderStyle() : {[key:string]: string} {
			let top = (this.handleY * 100);

			top = preventPercentageOutOfBounds(top);

			return {
				"top": top.toFixed(4) + "%"
			};
		}
	},

	methods: {
		getHueFromSlider() : number {
			let multiplier = preventPercentageOutOfBounds(this.handleY*100);
			return Math.round(360 * (multiplier/100));
		},

		addListeners() {
			const hueSlider = this.$refs.hueSlider as HTMLElement;
			hueSlider.addEventListener("mousedown", this.onDragStart);
			window.addEventListener("mousemove", this.onDragMove);
			window.addEventListener("mouseup", this.onDragEnd);
		},

		removeListeners() {
			const hueSlider = this.$refs.hueSlider as HTMLElement;
			hueSlider.removeEventListener("mousedown", this.onDragStart);
			window.removeEventListener("mousemove", this.onDragMove);
			window.removeEventListener("mouseup", this.onDragEnd);
		},

		onDragStart(ev : MouseEvent) {
			this.isDragging = true;
			this.setHandlePosFromMouse(ev);
		},

		onDragMove(ev : MouseEvent) {
			if (!this.isDragging) {
				return;
			}
			
			this.setHandlePosFromMouse(ev);
		},

		onDragEnd() {
			this.isDragging = false;
		},

		setHandlePosFromMouse(ev:MouseEvent) {
			const hueSliderElem = this.$refs.hueSlider as HTMLElement;
			let currentY = ev.clientY - hueSliderElem.getBoundingClientRect().top;
			this.handleY = (currentY / hueSliderElem.clientHeight);
		}
	}
})
</script>

<style lang="scss">
	div.jussirm-hue-slider {
		position: relative;
		height: 100%;
		background: linear-gradient(to bottom, 
			hsl(0, 100%, 50%) 0%,
			hsl(60, 100%, 50%) 17%,
			hsl(120, 100%, 50%) 33%,
			hsl(180, 100%, 50%) 50%,
			hsl(240, 100%, 50%) 67%,
			hsl(300, 100%, 50%) 83%,
			hsl(360, 100%, 50%) 100%
		);

		div.handle {
			cursor: grab;
			position: absolute;
			left: -5px;
			width: calc(100% + 10px);
			height: 8px;
			transform: translateY(-4px);
			background-color: #fff;
			border: 1px solid lighten(black, 30%);
			border-radius: 10px;
		}
	}
</style>