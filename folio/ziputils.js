export const findImageByIdx=(zip,idx)=>{//occcasionally
    const fn=(idx+1).toString().padStart(3,'0')+'.jpg';
    
    if (zip.files[idx]&&fn==zip.files[idx].name) {
        return zip.files[idx];
    } else {
        for (let i=0;i<zip.files.length;i++) {
            if (fn==zip.files[i].name) {
                return zip.files[i];
            }
        }
    }
}
export const nextImageIndex=(totalpages,idx,scrollback=false)=>{
    let nextidx=idx+1;
    if (nextidx>totalpages-1) {
        if (scrollback) nextidx=0;
        else nextidx=idx;
    }
    return nextidx;
}
export const prevImageIndex=(totalpages,idx,scrollback=false)=>{
    let previdx=idx-1;
    if (previdx<0) {
        if (scrollback) previdx=totalpages-1;
        else previdx=idx;
    }
    return previdx;
}
