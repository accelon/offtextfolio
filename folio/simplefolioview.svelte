<script lang="ts">
import {  onMount } from 'svelte';
const blankimage=''
let {showline=0,thezip=null,imageIndex=0,frame}=$props();
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
    canvas.width=frame.width/5;//one line
    canvas.height=frame.height;
    canvas.style.left='0px';
    canvas.style.top=frame.top+'px';  
    setTimeout(()=>{         


        const leftpos=showline* img.naturalWidth/5;
        ctx.drawImage(img, leftpos, 0 , img.naturalWidth/5, img.naturalHeight, 0,0,canvas.width,canvas.height); 
        
        URL.revokeObjectURL(img.src)
    },10)

}
onMount(()=>setTimeout(()=>drawImage(),200));//wait for main folio frame
$effect((imageIndex,thezip)=>drawImage());

</script>
<canvas bind:this={canvas} />
<style>
    canvas {left:30px;top:0px;position:absolute;z-index:6}
</style>