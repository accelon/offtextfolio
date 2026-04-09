<script lang="ts">
import { onDestroy, onMount } from 'svelte';
const blankimage=''
let {showline=0,thezip=null,imageIndex=0}=$props();
import { findImageByIdx } from './ziputils.js';
let canvas=null;

const drawImage=()=>{
    const img=document.createElement('IMG');
    const ctx=canvas?.getContext('2d');
    if (!thezip||imageIndex<0) {
        img.src=blankimage;
        return;
    }
    const f=findImageByIdx(thezip,imageIndex);
    if (!f) {
        img.src=blankimage;
        return;
    } else {
        const blob=new Blob([f.content]);
        img.src=URL.createObjectURL(blob.slice());
    }
    setTimeout(()=>{  
        const w=img.naturalWidth/5;
        canvas.width=w;//one line
        canvas.height=img.naturalHeight;
        const leftpos=showline*w;
        ctx.drawImage(img, leftpos, 0 , canvas.width, canvas.height, 0,0,canvas.width,canvas.height); 
        URL.revokeObjectURL(img.src)
    },10)

}
onMount(()=>drawImage());
$effect((imageIndex,thezip)=>drawImage());

</script>
<canvas bind:this={canvas} style="height:10%"/>
<style>
    canvas {width:100%;top:0px;position:relative;}
</style>