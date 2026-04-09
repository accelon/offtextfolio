<script lang="ts">
import { onDestroy, onMount } from 'svelte';
const blankimage=''
let {showline=0,thezip=null,imgidx=0}=$props();
import { findImageByIdx } from './ziputils.js';
let canvas=null;

const drawImage=()=>{
    const img=document.createElement('IMG');
    const ctx=canvas?.getContext('2d');
    if (!thezip||imgidx<0) {
        img.src=blankimage;
        return;
    }
    const f=findImageByIdx(thezip,imgidx);
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
        console.log(leftpos,w,showline)
        ctx.drawImage(img, leftpos, 0 , canvas.width, canvas.height, 0,0,canvas.width,canvas.height); 
        URL.revokeObjectURL(img.src)
    },50)

}
onMount(()=>drawImage());
$effect((imgidx,thezip)=>drawImage());

</script>
<canvas bind:this={canvas} style="height:10%"/>
<style>
    canvas {width:100%;top:0px;position:relative;}
</style>