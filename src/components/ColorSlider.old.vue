<template>
	<canvas ref="canvas" :id="id" class="jussirm-color-slider"
		:width="width"
		:height="height"
	></canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import convert from "color-convert";
import { generateQuiteRandomString } from "@/helpers";
import ColorRgb from "@/interfaces/ColorRgb";

export default defineComponent({
	emits: [
		"update:modelValue"
	],

	props: {
		/** By default generates 'almost certainly' unique id */
		id: {
			type: String as PropType<string>,
			default: () => generateQuiteRandomString()
		},

		modelValue: {
			type: Object as PropType<ColorRgb>,
			required: true
		}
	},

	data() { return {
		myCanvasContext: null as null|CanvasRenderingContext2D,
		height: 0,
		width: 0,
		pickerPosition: 0,

		// mouse stuff
		isMouseDown: false
	}},

	mounted() {
		// Get canvas context as the first thing after the component is mounted 
		const canvasElem = this.$refs.canvas as HTMLCanvasElement;
		this.myCanvasContext = canvasElem.getContext("2d", {
			willReadFrequently: true
		});

		// Check how big the canvas should be 
		let parentElem = this.getParentElement();
		this.height = parentElem.clientHeight;
		this.width = parentElem.clientWidth;

		// Draw canvas (next tick, when height/width is set into DOM)
		this.$nextTick(() => {
			this.drawCanvas();
			this.initMouseEvents();
		});
	},

	computed: {
		canvasContext() : CanvasRenderingContext2D {
			if (!this.myCanvasContext) {
				throw "myCanvasContext has to be initialized";
			}
			return this.myCanvasContext;
		},

		canvasInlineStyle() : {[key:string]: string} {
			return {
				width: this.width + "px",
				height: this.height + "px"
			};
		}
	},

	methods: {
		getParentElement() : HTMLElement {
			const rootElem = this.$refs.canvas as HTMLCanvasElement;
			const parent = rootElem.parentElement;
			if (parent == null) {
				// Not sure how else to tell typescript that this value will not be null
				throw "getParentElement() got null for the parent, big error...";
			}
			return parent;
		},

		drawCanvas() {
			// alias for canvasContext 
			const ctx = this.canvasContext;

			// Generate Rgb Gradient 
			let gradient = ctx.createLinearGradient(0, 0, 0, this.height);
			gradient.addColorStop(0, "rgb(255, 0, 0)");
			gradient.addColorStop(0.15, "rgb(255, 0, 255)");
			gradient.addColorStop(0.33, "rgb(0, 0, 255)");
			gradient.addColorStop(0.49, "rgb(0, 255, 255)");
			gradient.addColorStop(0.67, "rgb(0, 255, 0)");
			gradient.addColorStop(0.84, "rgb(255, 255, 0)");
			gradient.addColorStop(1, "rgb(255, 0, 0)");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, this.width, this.height);

			// Create a picker
			this.drawPicker(ctx);
		},

		drawPicker(ctx : CanvasRenderingContext2D) {
			// Where should the picker go?
			// HSL actually makes calculating this quite easy...
			const mv = this.modelValue;
			const hsl = convert.rgb.hsl(mv.r, mv.g, mv.b);
			let posY = Math.round(this.height - (this.height * (hsl[0]/360)));

			const baseY = posY;
			let path = new Path2D();
			path.moveTo(15, baseY);
			path.lineTo(23, baseY+5);
			path.lineTo(23, baseY-5);
			path.lineTo(15, baseY);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#fff";
			ctx.stroke(path);
			ctx.fillStyle = "#000";
			ctx.fill(path);
		},

		initMouseEvents() {
			/*
				Bind mousedown to canvas element but mouseup & move to window. This is because 
				we want to initiate drag from the slider, but let it move/end anywhere in the
				document (not just when the mouse is released over canvas).
			*/
			const canvasElement = this.$refs.canvas as HTMLCanvasElement;
			canvasElement.addEventListener("mousedown", this.onMouseDown);
			window.addEventListener("mouseup", this.onMouseUp);
			window.addEventListener("mousemove", this.onMouseMove);
		},

		onMouseDown(ev:MouseEvent) {
			this.isMouseDown = true;
			this.movePicker(ev);
		},

		onMouseUp() {
			this.isMouseDown = false;
		},

		onMouseMove(ev:MouseEvent) {
			if (!this.isMouseDown) {
				return;
			}

			this.movePicker(ev);
		},

		movePicker(ev:MouseEvent) {
			let canvasElem = this.$refs.canvas as HTMLCanvasElement;
			let currentY = ev.clientY - canvasElem.offsetTop;

			this.pickerPosition = currentY;

			const color = this.getSelectedColor();
			console.log(color);
			
			this.drawCanvas();
		},

		getSelectedColor() : ColorRgb {
			// Check 1 pixel.
			const imageData = this.canvasContext.getImageData(2, this.pickerPosition, 1, 1);

			// All pixel data is in the same array. For 1 pixel, we just check the first three items (4th is alpha)
			return {
				r: imageData.data[0],
				g: imageData.data[1],
				b: imageData.data[2]
			}
		}
	}
})
</script>

<style lang="scss">
	canvas.jussirm-color-slider {

	}
</style>