<script lang="ts">
import { onMount } from 'svelte';
import Swipe from '../swipe/swipe.svelte';
import SwipeItem from '../swipe/swipeitem.svelte';
import { findImageByIdx, prevImageIndex, nextImageIndex } from './ziputils.js';
const blankimage='blank.png'

let swiper=null;
let oldDefaultIndex=1, defaultIndex=1;//set to middle image, so that user can swipe left or right
let message='loading';
let {thezip=null,imageIndex=$bindable(0),frame=$bindable({left:0,top:0,width:0,height:0})}=$props();
const totalpages=thezip.files.length;
//swiper 要打開 allow_infinite_swipe, active_item 不能從外部改。
//永遠只有三張圖片在循環。滑鼠停止後，更新前後張的圖片。
onMount(()=>{
    let inter=setInterval(()=>{        
        if (swiper){ //swiper visible, update the image
            clearInterval(inter)
            setImages(imageIndex);
        }
    },0);
})
const setImages=(idx:number)=>{
    if (!swiper) return;
    
    let previdx=prevImageIndex(totalpages,idx);
    let nextidx=nextImageIndex(totalpages,idx);
    
    setImage((defaultIndex+1)%3,thezip,previdx);
    setImage((defaultIndex)%3,thezip,idx);
    setImage((defaultIndex+2)%3,thezip,nextidx);
    swiper.update();
    const img=document.getElementsByClassName('middleimage')[0];
    const height=img.clientHeight||frame.height;
    const width=img.clientWidth||frame.width||height*0.45; //some time width ==0
    if (width!==frame.width || height!==frame.height){
        frame.width=width;
        frame.height=height;
    }
}

const swipeConfig = {
    autoplay: false,
    delay: 0,
    showIndicators: false,
    transitionDuration: 250
};
const nextpage=()=>{
    imageIndex++;
    if (imageIndex>=totalpages) imageIndex=0;
    setImages(imageIndex);
}
const prevpage=()=>{
    imageIndex--;
    if (imageIndex<0) imageIndex=totalpages-1;
    setImages(imageIndex);
}

const mousewheel=(e)=>{
	if (e.deltaY>0) {
        nextpage();
	} else {
        prevpage();
	}
    e.preventDefault();
}

const getImages=(side:number)=>{
    const clss=["leftimage","middleimage","rightimage"];
    const cls=clss[side];
    const imgs=document.getElementsByClassName(cls);   
    return imgs;
}

const setImage=(side:number,zip,idx:number)=>{
    if (!swiper) return;

    if (idx>=totalpages) idx=0;
    else if (idx<0) idx=totalpages-1;
    if (isNaN(idx)) idx=0;
    const imgs=getImages(side);

    //need to see all clone
    for(let i=0;i<imgs.length;i++) {
        const f=findImageByIdx(zip,idx);
        if (!f) {
             console.error('no zip files',idx,zip.files)
             return;
        }
        const blob=new Blob([f.content]);
        imgs[i].src=URL.createObjectURL(blob);
    }
    swiper.update()
}

const swipeChanged=(obj)=>{ 
    const {active_item}=obj.detail;
    defaultIndex=active_item;
    let idx=imageIndex;
    

    if (oldDefaultIndex==defaultIndex) {
        return;
    }
    if ( ((oldDefaultIndex+3) - defaultIndex)%3 ==1) { //next image
        idx++;
        if (idx>=totalpages) idx=0;
        setImage((oldDefaultIndex+1)%3,thezip,idx+1); //change next image
    } else{ 
        idx--;           
        if (idx<0) idx=totalpages-1;
        setImage((oldDefaultIndex+2)%3,thezip,idx-1); //change prev image
    }
    oldDefaultIndex=defaultIndex;
    imageIndex=idx;
    swiper.update()
}


</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="swipe-holder"  onwheel={mousewheel} >
{#if thezip}
<Swipe bind:this={swiper} {defaultIndex} {...swipeConfig}  on:change={swipeChanged}>
 <SwipeItem><img src={blankimage} alt='no content' class="leftimage swipe"/></SwipeItem>
 <SwipeItem><img src={blankimage} alt='no content' class="middleimage swipe"/></SwipeItem>
 <SwipeItem><img src={blankimage} alt='no content' class="rightimage swipe"/></SwipeItem>
</Swipe>
{:else}
{message}
{/if}
</div>
<style>
img {height:100%}
.swipe-holder{
    z-index:6;
    height: 100vh;
    
}
.swipe {top:0%;left:0%;z-index:9999;position:absolute}
</style>