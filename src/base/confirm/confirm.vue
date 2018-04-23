<template>
	<transition name="confirm-fade">
		<div class="confirm" v-show="showFlag">
			<div class="confirm-wrapper">
				<div class="confirm-content">
					<p class="text">{{text}}</p>
					<div class="operate">
						<div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
						<div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			text: {
				type: String,
				default: ''
			},
			confirmBtnText: {
				type: String,
				default: '确定'
			},
			cancelBtnText: {
				type: String,
				default: '取消'
			}
		},

		data() {
			return {
				showFlag: false
			}
		},

		methods: {
			show() {
				this.showFlag = true;
			},
			hide() {
				this.showFlag = false;
			},
			cancel() {
				this.hide();
				this.$emit('cancel');
			},
			confirm() {
				this.hide();
				this.$emit('confirm');
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.confirm {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 998;
		background-color: @color-background-d;

		&.confirm-fade-enter-active {
			animation: confirm-fadein 0.3s;

			.confirm-content {
				animation: confirm-zoom 0.3s;
			}
		}

		.confirm-wrapper {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 999;

			.confirm-content {
				width: 13.5rem;
				border-radius: 0.65rem;
				background: @color-highlight-background;

				.text {
					padding: 0.95rem 0.75rem;
					line-height: 1.1rem;
					text-align: center;
					font-size: @font-size-large;
					color: @color-text-l;
				}

				.operate {
					display: flex;
					align-items: center;
					text-align: center;
					font-size: @font-size-large;

					.operate-btn {
						flex: 1;
						line-height: 1.1rem;
						padding: 0.5rem 0;
						border-top: 1px solid @color-background-d;
						color: @color-text-d;

						&.left {
							border-right: 1px solid @color-background-d;
						}
					}
				}
			}
		}
	}

	@keyframes confirm-fadein {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes confirm-zoom {
		0% {
			transform: scale(0);
		}

		50% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
		}
	}
</style>