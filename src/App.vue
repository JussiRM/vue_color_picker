<template>
	<div id="app">
		<div class="container">
			<color-picker v-model="color" />

			<div class="color-preview" :style="previewStyle">
				<div>
					<span class="title">VALITTU VÄRI</span>
					<span class="value">{{color}}</span>
					<span class="value">{{hex}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorPicker from "@/components/ColorPicker.vue";
import ColorHsl from "./interfaces/ColorHsl";
import colorConvert from "color-convert";
import { HSL } from "color-convert/conversions";

export default defineComponent({
	name: "App",

	components: {
		ColorPicker 
	},

	data() { return {
		color: { h: 180, s: 75, l: 50 } as ColorHsl
	}},

	computed: {
		previewStyle() : { [key:string]: string } {
			let styles = { backgroundColor: this.hslColorCss } as { [key:string]: string };
			let color = "#000";
			let hsv = colorConvert.hsl.hsv([this.color.h, this.color.s, this.color.l]);
			
			if (hsv[2] < 60) {
				color = "#fff";
			}

			styles["color"] = color;

			return styles;
		},

		hslColorCss() : string {
			const c = this.color;
			return `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
		},

		hex() : string {
			const c = this.color;
			return "#" + colorConvert.hsl.hex([c.h, c.s, c.l]).toString();
		}
	}
});
</script>

<style lang="scss">
html, body {
	font-family: "Segoe UI";
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
}

#app {
	margin: 0 auto;
	width: 800px;

	div.container {
		position: relative;
		border: 1px dashed rgba(0,0,0, 0.33);
		padding: 1rem;
		margin-top: 2rem;

		div.color-preview {
			position: absolute;
			left: 350px;
			top: 0;
			margin-top: 1rem;
			height: 100px;
			width: 370px;
			border: 1px solid rgba(0,0,0, 0.33);
			border-radius: 0.5rem;

			> div {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);

				> span {
					display: block;
					text-align: center;
					white-space: nowrap;

					&.value {
						font-family: monospace;
						letter-spacing: -1px;
					}
				}
			}
		}
	}
}
</style>
