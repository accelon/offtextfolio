
export const buildtimestampjson=(stamps,src,mp3)=>{
    if(!mp3) mp3=src;
    return {
        "folio":src,
        "audio":mp3,
        "foliolines":5,
        "timestamps":stamps
    }
}
