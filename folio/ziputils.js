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