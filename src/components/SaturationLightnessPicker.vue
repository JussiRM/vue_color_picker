<template>
	<div class="jussirm-saturation-lightness-picker" 
		:style="pickerStyle" 
		ref="container"
	>
		<div class="light-gradient"></div>
		<div class="dark-gradient"></div>

		<div class="handle" ref="handle" :style="handleStyle" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import colorConvert from "color-convert";
import { HSV } from 'color-convert/conversions';
import { preventPercentageOutOfBounds } from '@/helpers';

export default defineComponent({
	props: {
		hue: {
			type: Number as PropType<number>,
			required: true
		},

		saturation: {
			type: Number as PropType<number>,
			required: true
		},

		lightness: {
			type: Number as PropType<number>,
			required: true
		},
	},

	data() { return {
		isDragging: false,
		handlePos: {
			top: 0,
			left: 0
		}
	}},

	watch: {
		"handlePos.top"() {
			this.colorChange();
		},
		"handlePos.left"() {
			this.colorChange();
		}
	},

	mounted() {
		this.checkHandlePositionByValue();
		this.addListeners();
	},

	beforeUnmount() {
		this.removeListeners();
	},

	computed: {
		pickerStyle() : { [key:string]: string } {
			const h = this.hue;
			return {
				background: `hsl(${h}, 100%, 50%)`
			}
		},

		handleStyle() : { [key:string]: string } {
			let top = preventPercentageOutOfBounds(100 * this.handlePos.top);
			let left = preventPercentageOutOfBounds(100 * this.handlePos.left);

			return {
				top: top.toFixed(4) + "%",
				left: left.toFixed(4) + "%"
			}
		}
	},

	methods: {
		colorChange() {
			// Get position data 
			let top = preventPercentageOutOfBounds(100 * this.handlePos.top);
			let left = preventPercentageOutOfBounds(100 * this.handlePos.left);

			// Calculate HSV value from handle position...
			const hsv = [this.hue, 0, 0] as HSV;
			hsv[1] = left;
			hsv[2] = 100 - top;

			const hsl = colorConvert.hsv.hsl(hsv);
			this.$emit('update:saturation', hsl[1]);
			this.$emit('update:lightness', hsl[2]);
		},

		checkHandlePositionByValue() {
			// It's easier to check the handle position from HSV 
			const hsv = colorConvert.hsl.hsv([ this.hue, this.saturation, this.lightness ]);

			// check HSV saturation for position in the X axel 
			const hsvS = hsv[1];
			this.handlePos.left = ((hsvS / 100));
			
			// check HSV value for the Y axel 
			const hsvV = hsv[2];
			this.handlePos.top = (1 - (hsvV / 100)); //(height - (height * (this.lightness / 100)));
		},

		addListeners() {
			const container = this.$refs.container as HTMLElement;
			container.addEventListener("mousedown", this.onDragStart);
			window.addEventListener("mousemove", this.onDragMove);
			window.addEventListener("mouseup", this.onDragEnd);
		},

		removeListeners() {
			const container = this.$refs.container as HTMLElement;
			container.removeEventListener("mousedown", this.onDragStart);
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
			const container = this.$refs.container as HTMLElement;
			let currentY = ev.pageY - container.getBoundingClientRect().top;
			let currentX = ev.pageX - container.getBoundingClientRect().left;
			this.handlePos.top = (currentY / container.clientHeight);
			this.handlePos.left = (currentX / container.clientWidth);
		}
	}
})
</script>

<style lang="scss">
	div.jussirm-saturation-lightness-picker {
		position: relative;
		height: 100%;
		width: 100%;
		user-select: none;

		* {
			user-select: none;
		}

		div.dark-gradient, div.light-gradient {
			position: absolute;
			top: 0; 
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(to top, rgba(0,0,0, 1) 0%, rgba(0,0,0, 0) 100%);
		}

		div.light-gradient {
			background: linear-gradient(to right, #fff 0%, rgba(255,255,255, 0) 100%);
		}

		div.handle {
			cursor: move;
			position: absolute;
			z-index: 10;
			width: 12px;
			height: 12px;
			transform: translate(-5px, -7px); // take border into account 
			border-radius: 50%;
			background-color: #fff;
			border: 2px solid black;
		}
	}
</style>