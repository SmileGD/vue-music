<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn"
							@touchstart.prevent="progressTouchStart"
							@touchmove.prevent="progressTouchMove"
							@touchend="progressTouchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {prefixStyle} from 'common/js/dom';

	const progressBtnWidth = 16;
	const transform = prefixStyle('transform');

	export default {
		props: {
			percent: {
				type: Number,
				default: 0
			}
		},

		methods: {
			progressTouchStart(e) {
				this.touch.initiated = true;
				this.touch.startX = e.touches[0].pageX;
				this.touch.left = this.$refs.progress.clientWidth;
			},

			progressTouchMove(e) {
				if(!this.touch.initiated) {
					return;
				}
				const deltaX = e.touches[0].pageX - this.touch.startX;
				const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0, this.touch.left + deltaX));
				this._offset(offsetWidth);
			},

			progressTouchEnd() {
				this.touch.initiated = false;
				this._triggerPercent();
			},

			progressClick(e) {
				this._offset(e.offsetX);
				this._triggerPercent();
			},

			_offset(offsetWidth) {
				this.$refs.progress.style.width = `${offsetWidth}px`;
				this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
			},

			_triggerPercent() {
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				const percent = this.$refs.progress.clientWidth / barWidth;
				this.$emit('percentChange', percent);
			}
		},

		watch: {
			percent(newPercent) {
				if(newPercent >= 0 && !this.touch.initiated) {
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
					const offsetWidth = newPercent * barWidth;
					this._offset(offsetWidth);
				}
			}
		},

		created() {
			this.touch = {};
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.progress-bar {
		height: 1.5rem;
		
		.bar-inner {
			position: relative;
			top: 0.65rem;
			height: 0.2rem;
			background: rgba(0, 0, 0, 0.3);
			
			.progress {
				position: absolute;
				height: 100%;
				background: @color-theme;
			}
			
			.progress-btn-wrapper {
				position: absolute;
				left: -0.4rem;
				top: -0.65rem;
				width: 1.5rem;
				height: 1.5rem;
				
				.progress-btn {
					position: relative;
					top: 0.35rem;
					left: 0.35rem;
					box-sizing: border-box;
					width: 0.8rem;
					height: 0.8rem;
					border: 0.15rem solid @color-text;
					border-radius: 50%;
					background: @color-theme;
				}
			}
		}
	}
</style>