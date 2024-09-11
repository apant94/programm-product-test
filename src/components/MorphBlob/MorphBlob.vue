<template>
  <span class="morph-blob"></span>
</template>

<style scoped lang="sass">
.morph-blob
	min-width: 40px
	height: 40px
	background-color: #fc466b
	background-image: linear-gradient(to bottom right, #3f5efb, #fc466b)
	border-radius: 60% 40% 30% 70%/60% 30% 70% 40%
	animation: morphBorders 1s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite alternate
	&:nth-child(0)
		animation-duration: 2s
	&:nth-child(1)
		animation-duration: 4s
	&:nth-child(2)
		animation-duration: 6s
	&:nth-child(3)
		animation-duration: 8s
	@media screen and (max-width: 768px)
		min-width: 60px
		height: 60px

@keyframes morphBorders
	0%
		border-radius:54% 46% 55% 45%/56% 50% 50% 44%
	25%
		border-radius:45% 55%
	50%
		border-radius:54% 46% 55% 45%/56% 50% 50% 44%

	75%
		border-radius:52% 48% 40% 60%/58% 56% 44% 42%
	to
		border-radius:44% 56% 60% 40%/49% 55% 45% 51%
</style>
