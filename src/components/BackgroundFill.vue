<template>
    <div class="background-fill">
        <slot id="content"></slot>
    </div>
</template>

<style lang="scss">
.background-fill {
    background-color: $page_darker_gray;
    min-height: calc(100% - $nav-height);
    overflow: scroll;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
}
</style>